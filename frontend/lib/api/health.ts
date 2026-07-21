/**
 * Health Check API
 * Monitors backend service status
 */

import { fetchFromAPI } from '../api-client';

export interface ServiceHealth {
  status: 'up' | 'down';
  container: string;
  responseTimeMs: number;
  uptime: {
    seconds: number;
    human: string;
  } | null;
  error?: string;
  host?: string;
  port?: number;
  database?: string | null;
  url?: string;
}

export interface HealthResponse {
  success: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  timestamp: string;
  environment: string;
  services: {
    backend: ServiceHealth;
    database: ServiceHealth;
    frontend: ServiceHealth;
  };
}

/**
 * Check backend and dependent service health
 */
export async function checkHealth(): Promise<HealthResponse> {
  return fetchFromAPI<HealthResponse>(
    '/health',
    {
      method: 'GET',
      cache: 'no-store',
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
