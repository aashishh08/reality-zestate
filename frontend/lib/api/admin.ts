import { fetchFromAPI } from '../api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export async function adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
  // fetchFromAPI already unwraps { success, data } → returns data directly
  return fetchFromAPI<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export async function adminRegister(data: RegisterRequest): Promise<AuthResponse> {
  return fetchFromAPI<AuthResponse>('/auth/register', {
    method: 'POST',
    body: data,
  });
}

export async function getAllBlogs(token: string, filters?: { search?: string; limit?: number; offset?: number }) {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';

  return fetchFromAPI(`/blogs/admin/all${queryString}`, {
    method: 'GET',
    token,
  });
}

export async function getBlogById(id: string, token: string) {
  return fetchFromAPI(`/blogs/admin/${id}`, {
    method: 'GET',
    token,
  });
}

export async function deleteBlog(id: string, token: string) {
  return fetchFromAPI(`/blogs/${id}`, {
    method: 'DELETE',
    token,
  });
}
