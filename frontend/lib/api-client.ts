const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  token?: string;
  timeout?: number;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: { limit: number; offset: number; total: number };
}

export interface ApiError extends Error {
  status?: number;
  data?: ApiResponse;
}

// ─── Response normaliser ──────────────────────────────────────────────────────

/**
 * Unwraps `{ success, data, pagination? }` envelopes returned by the backend:
 * - Paginated: returns `{ data, pagination }` so callers can access both.
 * - Simple wrapper: returns the inner `data` value.
 * - Raw objects/arrays: returned as-is.
 */
function normalizeResponse<T>(raw: unknown): T {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('success' in obj && 'data' in obj) {
      if ('pagination' in obj) {
        const { success: _s, ...rest } = obj;
        return rest as T;
      }
      return (obj['data'] ?? raw) as T;
    }
  }
  return raw as T;
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

export async function fetchFromAPI<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
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

  const url = `${API_BASE_URL}${endpoint}`;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    ...(body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      ? { body: JSON.stringify(body) }
      : {}),
    ...(cache ? { cache } : {}),
    ...(next ? { next } as any : {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!isJson && !response.ok) {
      const error: ApiError = new Error(`Backend Error (${response.status}): ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      const error: ApiError = new Error('Invalid API response format. Backend may not be running.');
      error.status = response.status || 0;
      throw error;
    }

    if (!response.ok) {
      const apiResponse = data as ApiResponse;
      const error: ApiError = new Error(apiResponse.message || `API Error: ${response.statusText}`);
      error.status = response.status;
      error.data = apiResponse;
      throw error;
    }

    return normalizeResponse<T>(data);
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const apiError: ApiError = new Error(
        `Backend Connection Error: Cannot reach ${API_BASE_URL}. Make sure the backend server is running.`,
      );
      apiError.status = 0;
      throw apiError;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      const apiError: ApiError = new Error(`Request timeout after ${timeout}ms.`);
      apiError.status = 0;
      throw apiError;
    }

    if (error instanceof Error && 'status' in error) throw error;

    const apiError: ApiError = new Error(
      error instanceof Error ? error.message : 'An unknown error occurred',
    );
    apiError.data = error as ApiResponse;
    throw apiError;
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function buildQueryString(params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) return '';

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      value.forEach(v => v != null && qs.append(key, String(v)));
    } else {
      qs.append(key, String(value));
    }
  }

  const result = qs.toString();
  return result ? `?${result}` : '';
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const data = (error as ApiError).data;
    if (data && typeof data === 'object' && 'message' in data) return (data as any).message;
    return error.message;
  }
  return 'An unknown error occurred';
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  const data = (error as ApiError)?.data;
  if (data && typeof data === 'object' && 'errors' in data) return (data as any).errors;
  return null;
}
