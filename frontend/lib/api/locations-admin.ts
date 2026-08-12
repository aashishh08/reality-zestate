const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002/api/v1';

export interface AdminLocality {
  id: string;
  name: string;
  slug: string;
  type: 'locality';
  parentId: string;
  propertyCount: number;
  isFeatured?: boolean;
  featuredOrder?: number | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  heroImageUrl?: string | null;
  parent?: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
}

export interface AdminCity {
  id: string;
  name: string;
  slug: string;
  type: 'city';
  propertyCount: number;
  seoTitle?: string | null;
  metaDescription?: string | null;
  heroImageUrl?: string | null;
  children: AdminLocality[];
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

export async function getAdminLocations(token: string): Promise<AdminCity[]> {
  const json = await authFetch<AdminCity[]>('/locations/admin/all', token);
  return json.data;
}

export async function createCity(
  token: string,
  payload: { name: string; slug: string },
): Promise<AdminCity> {
  const json = await authFetch<AdminCity>('/locations/cities', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function createLocality(
  token: string,
  payload: { name: string; slug: string; parentId: string },
): Promise<AdminLocality> {
  const json = await authFetch<AdminLocality>('/locations/localities', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return json.data;
}

export async function updateLocation(
  token: string,
  id: string,
  payload: {
    name: string;
    parentId?: string;
    isFeatured?: boolean;
    featuredOrder?: number | null;
    seoTitle?: string | null;
    metaDescription?: string | null;
    heroImageUrl?: string | null;
  },
): Promise<AdminCity | AdminLocality> {
  const json = await authFetch<AdminCity | AdminLocality>(`/locations/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return json.data;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
