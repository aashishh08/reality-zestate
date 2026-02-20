/**
 * Centralized API Client
 * Handles all communication with the backend REST API
 * All requests go through this client for consistency, error handling, and logging
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// Enable debug logging only in development
const isDev = process.env.NODE_ENV === 'development';
const debugLog = (...args: any[]) => isDev && console.log('[API]', ...args);
const debugError = (...args: any[]) => isDev && console.error('[API]', ...args);

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  token?: string;
  timeout?: number;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ApiError extends Error {
  status?: number;
  data?: ApiResponse;
}

/**
 * Validates and normalizes API response
 */
function normalizeResponse<T>(data: unknown): T {
  // If it's already a plain object/array, return as-is
  if (data && typeof data === 'object') {
    // If it's an ApiResponse wrapper, extract the data
    if ('success' in data && 'data' in data) {
      const response = data as ApiResponse<T>;
      return response.data ?? (data as T);
    }
    // If it's an array or object, return directly
    return data as T;
  }
  return data as T;
}

/**
 * Main API request function
 * All API calls should go through this function
 */
export async function fetchFromAPI<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    token,
    timeout = API_TIMEOUT,
    cache,
    next,
  } = options;

  // Construct full URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Build headers
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization token if provided
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
  };

  // Add body if present (only for POST, PUT, PATCH, DELETE)
  if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    fetchOptions.body = JSON.stringify(body);
  }

  // Add cache options
  if (cache) {
    fetchOptions.cache = cache;
  }

  // Add ISR/revalidation options (Next.js specific)
  if (next) {
    (fetchOptions as any).next = next;
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    debugLog(`Fetching: ${method} ${url}`);

    // Make the request
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    // Clear timeout
    clearTimeout(timeoutId);

    debugLog(`Response: ${method} ${url} -> ${response.status}`);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    // Handle non-JSON responses (likely HTML error pages)
    if (!isJson) {
      if (!response.ok) {
        const errorText = await response.text();
        const error: ApiError = new Error(
          `Backend Error (${response.status}): ${response.statusText}`
        );
        error.status = response.status;
        throw error;
      }
    }

    // Parse response
    let data: unknown;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, it's likely an error page
      const error: ApiError = new Error(
        'Invalid API response format. Backend may not be running or returned an error page.'
      );
      error.status = response.status || 0;
      throw error;
    }

    // Handle error responses
    if (!response.ok) {
      const apiResponse = data as ApiResponse;
      const error: ApiError = new Error(
        apiResponse.message || `API Error: ${response.statusText}`
      );
      error.status = response.status;
      error.data = apiResponse;
      throw error;
    }

    debugLog(`Success: ${method} ${url}`);

    return normalizeResponse<T>(data);
  } catch (error) {
    debugError(`Error: ${method} ${url}`, error instanceof Error ? error.message : error);
    
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const apiError: ApiError = new Error(
        `Backend Connection Error: Cannot reach ${API_BASE_URL}. Make sure the backend server is running.`
      );
      apiError.status = 0;
      throw apiError;
    }

    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      const apiError: ApiError = new Error(
        `Request timeout after ${timeout}ms. Backend may be slow or not responding.`
      );
      apiError.status = 0;
      throw apiError;
    }

    // Re-throw if already an ApiError
    if (error instanceof Error && 'status' in error) {
      throw error;
    }

    // Wrap other errors
    const apiError: ApiError = new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
    apiError.data = error as ApiResponse;
    throw apiError;
  }
}

/**
 * Helper to build query string from params
 */
export function buildQueryString(
  params?: Record<string, any>
): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      // Handle arrays by adding multiple params with same key
      value.forEach(v => {
        if (v !== undefined && v !== null) {
          queryParams.append(key, String(v));
        }
      });
    } else {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Helper to handle API errors in components
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if it's an ApiError with data
    if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
      return (error.data as any).message;
    }
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Helper to handle validation errors from API
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof Error && 'data' in error && error.data && typeof error.data === 'object' && 'errors' in error.data) {
    return (error.data as any).errors;
  }
  return null;
}
