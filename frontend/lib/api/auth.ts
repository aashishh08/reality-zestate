/**
 * Auth API
 * Handles authentication-related API calls
 * Used for admin panel (future)
 */

import { fetchFromAPI } from '../api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: 'SUPER_ADMIN';
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
}

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return fetchFromAPI<AuthResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: credentials,
    }
  );
}

/**
 * Register user (admin only, typically)
 */
export async function register(
  data: RegisterRequest,
  token?: string
): Promise<AuthResponse> {
  return fetchFromAPI<AuthResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: data,
      token,
    }
  );
}

/**
 * Store token in localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth_token');
}

/**
 * Clear token from localStorage
 */
export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
