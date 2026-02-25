import { fetchFromAPI, buildQueryString } from '../api-client';
import { PropertyListResponse, PropertyFilters } from '@/types/property-listing';

// ─── Shared normaliser ────────────────────────────────────────────────────────

function normaliseListResponse(response: any, filters?: { limit?: number; offset?: number }): PropertyListResponse {
  return {
    data: Array.isArray(response) ? response : (response?.data ?? []),
    pagination: response?.pagination ?? {
      limit: filters?.limit ?? 12,
      offset: filters?.offset ?? 0,
      total: Array.isArray(response) ? response.length : (response?.pagination?.total ?? 0),
    },
  };
}

function findBySlug<T extends { slug: string }>(response: any, slug: string): T | null {
  if (Array.isArray(response)) {
    return response.find((item: T) => item.slug === slug) ?? null;
  }
  if (response && typeof response === 'object') {
    const item = response as T;
    return item.slug === slug ? item : null;
  }
  return null;
}

// ─── Property queries ─────────────────────────────────────────────────────────

export async function fetchLocationProperties(
  locationId: string,
  filters?: Omit<PropertyFilters, 'locationId'>,
): Promise<PropertyListResponse> {
  const response = await fetchFromAPI<any>(`/properties${buildQueryString({ locationId, ...filters })}`);
  return normaliseListResponse(response, filters);
}

export async function fetchDeveloperProperties(
  developerId: string,
  filters?: Omit<PropertyFilters, 'developerId'>,
): Promise<PropertyListResponse> {
  const response = await fetchFromAPI<any>(`/properties${buildQueryString({ developerId, ...filters })}`);
  return normaliseListResponse(response, filters);
}

export async function fetchCategoryProperties(
  categoryId: string,
  filters?: Omit<PropertyFilters, 'categoryId'>,
): Promise<PropertyListResponse> {
  return fetchFromAPI<PropertyListResponse>(`/properties${buildQueryString({ categoryId, ...filters })}`);
}

export async function fetchProperties(filters: PropertyFilters): Promise<PropertyListResponse> {
  const response = await fetchFromAPI<any>(`/properties${buildQueryString(filters)}`);
  return normaliseListResponse(response, filters);
}

// ─── Detail lookups ───────────────────────────────────────────────────────────

export async function fetchLocationDetail(slug: string) {
  return fetchFromAPI(`/locations?slug=${slug}`);
}

export async function fetchDeveloperDetail(slug: string) {
  return fetchFromAPI(`/developers?slug=${slug}`);
}

export async function fetchCategoryDetail(slug: string) {
  return fetchFromAPI(`/categories?slug=${slug}`);
}

// ─── Slug resolvers (used by generateStaticParams) ───────────────────────────

export async function getLocationBySlug(slug: string) {
  try {
    const response = await fetchFromAPI(`/locations?slug=${slug}`);
    return findBySlug(response, slug);
  } catch {
    return null;
  }
}

export async function getDeveloperBySlug(slug: string) {
  try {
    const response = await fetchFromAPI(`/developers?slug=${slug}`);
    return findBySlug(response, slug);
  } catch {
    return null;
  }
}

export async function getAllLocationSlugs(): Promise<string[]> {
  try {
    const response = await fetchFromAPI<any>('/locations?type=city&limit=100');
    const data = Array.isArray(response?.data) ? response.data : [];
    return data.map((loc: any) => loc.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getAllDeveloperSlugs(): Promise<string[]> {
  try {
    const response = await fetchFromAPI<any>('/developers?limit=100');
    const data = Array.isArray(response?.data) ? response.data : [];
    return data.map((dev: any) => dev.slug).filter(Boolean);
  } catch {
    return [];
  }
}

// ─── Tag helpers ──────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}

export async function fetchAllTags(): Promise<Tag[]> {
  try {
    const response = await fetchFromAPI<any>('/tags');
    return Array.isArray(response) ? response : (response?.data ?? []);
  } catch {
    return [];
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const response = await fetchFromAPI<any>(`/tags/${slug}`);
    const tag = response?.data ?? response;
    return tag?.slug === slug ? tag : null;
  } catch {
    return null;
  }
}

export async function fetchTagProperties(
  tagSlug: string,
  filters?: Omit<PropertyFilters, 'tags'>,
): Promise<PropertyListResponse & { tag?: Tag }> {
  const response = await fetchFromAPI<any>(`/tags/${tagSlug}/properties${buildQueryString({ ...filters })}`);
  return {
    data: Array.isArray(response) ? response : (response?.data ?? []),
    pagination: response?.pagination ?? { limit: filters?.limit ?? 12, offset: filters?.offset ?? 0, total: 0 },
    tag: response?.tag,
  };
}

export async function getAllTagSlugs(): Promise<string[]> {
  try {
    const tags = await fetchAllTags();
    return tags.map(t => t.slug).filter(Boolean);
  } catch {
    return [];
  }
}
