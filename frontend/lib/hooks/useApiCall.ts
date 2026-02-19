/**
 * Custom hook for handling API calls with loading, error, and retry logic
 * Provides a clean interface for components to handle async operations
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import { ApiError } from '../api-client';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

export interface UseApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isRetrying: boolean;
}

interface UseApiCallOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  retryCount?: number;
  timeout?: number;
}

/**
 * Custom hook for handling API calls
 * Manages loading, error, and retry states
 */
export function useApiCall<T>(
  options: UseApiCallOptions = {}
): UseApiCallState<T> & {
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
  retryLastCall: () => Promise<T | null>;
} {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
    isRetrying: false,
  });

  const lastCallRef = useRef<(() => Promise<T>) | null>(null);
  const retryCountRef = useRef(0);
  
  // Memoize options to prevent unnecessary dependency changes
  const memoizedOptions = useMemo(() => ({
    retryCount: options.retryCount ?? API_CONFIG.RETRY_ATTEMPTS,
    onSuccess: options.onSuccess,
    onError: options.onError,
    timeout: options.timeout,
  }), [options.retryCount, options.onSuccess, options.onError, options.timeout]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isRetrying: false,
    });
    retryCountRef.current = 0;
    lastCallRef.current = null;
  }, []);

  const execute = useCallback(
    async (apiCall: () => Promise<T>): Promise<T | null> => {
      lastCallRef.current = apiCall;
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await apiCall();
        setState((prev) => ({
          ...prev,
          data: result,
          loading: false,
          error: null,
        }));
        retryCountRef.current = 0;
        memoizedOptions.onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        
        // Check if we should retry
        const isRetryable = isRetryableError(error);
        if (isRetryable && retryCountRef.current < memoizedOptions.retryCount) {
          retryCountRef.current += 1;
          setState((prev) => ({
            ...prev,
            loading: false,
            error: null,
            isRetrying: true,
          }));

          // Wait before retrying with exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, API_CONFIG.RETRY_DELAY * retryCountRef.current)
          );

          // Retry the call
          return execute(apiCall);
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          isRetrying: false,
        }));
        memoizedOptions.onError?.(errorMessage);
        return null;
      }
    },
    [memoizedOptions]
  );

  const retryLastCall = useCallback(async (): Promise<T | null> => {
    if (!lastCallRef.current) {
      return null;
    }
    retryCountRef.current = 0;
    return execute(lastCallRef.current);
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retryLastCall,
  };
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors are retryable
    if (error.message.includes('Failed to fetch')) {
      return true;
    }
    // Timeout errors are retryable
    if (error.name === 'AbortError') {
      return true;
    }
  }
  
  if (error instanceof Error && 'status' in error) {
    const status = (error as ApiError).status;
    // Retry on server errors (5xx) but not client errors (4xx)
    if (status && status >= 500) {
      return true;
    }
    // Special case: retry on 408 (timeout)
    if (status === 408) {
      return true;
    }
  }

  return false;
}

/**
 * Extract error message from various error types
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if it's an ApiError with data
    if ('data' in error && error.data?.message) {
      return error.data.message;
    }
    // Network errors
    if (error.message.includes('Failed to fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    // Timeout errors
    if (error.name === 'AbortError') {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    // Custom error messages from API
    if (error.message.includes('Backend')) {
      return ERROR_MESSAGES.BACKEND_ERROR;
    }
    return error.message;
  }
  return ERROR_MESSAGES.GENERIC_ERROR;
}
