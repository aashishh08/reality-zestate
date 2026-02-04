/**
 * Health Check API
 * Monitors backend service status
 */

import { fetchFromAPI } from '../api-client';

export interface HealthResponse {
  success: boolean;
  message: string;
}

/**
 * Check if backend is running
 */
export async function checkHealth(): Promise<HealthResponse> {
  return fetchFromAPI<HealthResponse>(
    '/health',
    {
      method: 'GET',
      cache: 'no-store', // Always check fresh
    }
  );
}

/**
 * Try to connect to backend with timeout
 */
export async function isBackendAvailable(timeoutMs: number = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/health`,
      {
        method: 'GET',
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
