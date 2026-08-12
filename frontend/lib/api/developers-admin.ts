const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api/v1';

export interface AdminDeveloper {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  heroImageUrl?: string | null;
  propertyCount: number;
}

async function authFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data: T; message?: string }> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
}

export async function getAdminDevelopers(token: string): Promise<AdminDeveloper[]> {
  const json = await authFetch<AdminDeveloper[]>('/developers/admin/all', token);
  return json.data;
}

export async function updateDeveloperSeo(
  token: string,
  id: string,
  payload: {
    seoTitle?: string | null;
    metaDescription?: string | null;
    heroImageUrl?: string | null;
  },
): Promise<AdminDeveloper> {
  const json = await authFetch<AdminDeveloper>(`/developers/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return json.data;
}
