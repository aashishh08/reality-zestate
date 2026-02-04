/**
 * Centralized API Client
 * Handles all communication with the backend REST API
 * All requests go through this client for consistency, error handling, and logging
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
  timeout?: number;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface ApiResponse<T = any> {
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
  data?: any;
}

/**
 * Main API request function
 * All API calls should go through this function
 */
export async function fetchFromAPI<T = any>(
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

    console.log(`[API] Fetching: ${method} ${url}`);

    // Make the request
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    // Clear timeout
    clearTimeout(timeoutId);

    console.log(`[API] Response: ${method} ${url} -> ${response.status}`);

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
    let data: ApiResponse<T>;
    try {
      data = await response.json() as ApiResponse<T>;
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
      const error: ApiError = new Error(
        data.message || `API Error: ${response.statusText}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    console.log(`[API] Success: ${method} ${url}`);

    // Return data from successful response
    return data.data as T;
  } catch (error) {
    console.error(`[API] Error: ${method} ${url}`, error instanceof Error ? error.message : error);
    
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
    apiError.data = error;
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
    if ('data' in error && error.data?.message) {
      return error.data.message;
    }
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Helper to handle validation errors from API
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof Error && 'data' in error && error.data?.errors) {
    return error.data.errors;
  }
  return null;
}
