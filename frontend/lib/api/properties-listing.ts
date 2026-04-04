import { fetchFromAPI, buildQueryString } from '../api-client';
import { getCategories } from './categories';
import type { Location } from './locations';
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

export async function fetchCityProperties(
  citySlug: string,
  filters?: Omit<PropertyFilters, 'citySlug'>,
): Promise<PropertyListResponse> {
  const response = await fetchFromAPI<any>(`/properties${buildQueryString({ citySlug, ...filters })}`);
  return normaliseListResponse(response, filters);
}

/** Minimal shape for `/location/[slug]` — supports cities and localities/ sectors (micro-markets). */
export type LocationListingContext = Pick<Location, 'slug' | 'type'> & {
  parent?: Pick<NonNullable<Location['parent']>, 'slug'> | null;
};

/**
 * List properties for a location row from `/locations` — uses enum `citySlug` for cities,
 * and `citySlug` + `localitySlug` for localities so the API matches `enums.js` (avoids
 * sending a locality slug as `citySlug`, which returns "Unknown city slug").
 */
export async function fetchLocationPageProperties(
  location: LocationListingContext,
  filters?: Omit<PropertyFilters, 'citySlug' | 'localitySlug'>,
): Promise<PropertyListResponse> {
  const q: PropertyFilters = { ...(filters ?? {}) };

  if (location.type === 'locality' || location.type === 'sector') {
    if (location.parent?.slug) {
      q.citySlug = location.parent.slug;
      q.localitySlug = location.slug;
    } else {
      q.localitySlug = location.slug;
    }
  } else {
    q.citySlug = location.slug;
  }

  const response = await fetchFromAPI<any>(`/properties${buildQueryString(q)}`);
  return normaliseListResponse(response, filters);
}

export async function fetchDeveloperSlugProperties(
  developerSlug: string,
  filters?: Omit<PropertyFilters, 'developerSlug'>,
): Promise<PropertyListResponse> {
  const response = await fetchFromAPI<any>(`/properties${buildQueryString({ developerSlug, ...filters })}`);
  return normaliseListResponse(response, filters);
}

/** @deprecated use fetchCityProperties */
export async function fetchLocationProperties(
  citySlug: string,
  filters?: Omit<PropertyFilters, 'citySlug'>,
): Promise<PropertyListResponse> {
  return fetchCityProperties(citySlug, filters);
}

/** @deprecated use fetchDeveloperSlugProperties */
export async function fetchDeveloperProperties(
  developerSlug: string,
  filters?: Omit<PropertyFilters, 'developerSlug'>,
): Promise<PropertyListResponse> {
  return fetchDeveloperSlugProperties(developerSlug, filters);
}

export async function fetchCategoryProperties(
  categoryId: string,
  filters?: Omit<PropertyFilters, 'categoryIds'>,
): Promise<PropertyListResponse> {
  /** Avoid Next fetch Data Cache serving a stale empty list from an older ISR/SSG build. */
  const response = await fetchFromAPI<any>(
    `/properties${buildQueryString({ categoryIds: [categoryId], ...filters })}`,
    { cache: 'no-store' },
  );
  return normaliseListResponse(response, filters);
}

/**
 * Resolve a category UUID from its slug, then list published properties in that category.
 * Uses a fresh categories lookup (`revalidate: 0`) so slug→id resolution is never stale.
 */
export async function fetchCategoryPropertiesBySlug(
  slug: string,
  filters?: Omit<PropertyFilters, 'categoryIds'>,
): Promise<PropertyListResponse> {
  const catsRes = await getCategories({ limit: 500, offset: 0 }, 0);
  const list = catsRes?.data ?? [];
  const cat = list.find((c) => c.slug === slug);
  if (!cat) {
    return {
      data: [],
      pagination: { limit: filters?.limit ?? 12, offset: filters?.offset ?? 0, total: 0 },
    };
  }
  return fetchCategoryProperties(cat.id, { ...filters, isPublished: true });
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
    const response = await fetchFromAPI<any>(`/locations?slug=${slug}`);
    const list = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
    return list.find((l: any) => l.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function getDeveloperBySlug(slug: string) {
  try {
    const response = await fetchFromAPI<any>(`/developers?slug=${slug}`);
    // normalizeResponse returns { data: [...], pagination: {...} } for paginated endpoints
    const list = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
    return list.find((d: any) => d.slug === slug) ?? null;
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

// ─── Enum helpers (cities / localities / developers from enums.js) ────────────

export interface EnumCity     { slug: string; label: string }
export interface EnumLocality { slug: string; label: string; city: string }
export interface EnumDeveloper{ slug: string; label: string }

export interface PublicEnumsData {
  cities: EnumCity[];
  localities: EnumLocality[];
  developers: EnumDeveloper[];
}

export async function fetchPublicEnums(citySlug?: string): Promise<PublicEnumsData> {
  try {
    const qs = citySlug ? `?city=${encodeURIComponent(citySlug)}` : '';
    const response = await fetchFromAPI<any>(`/enums${qs}`);
    const data = response?.data ?? response;
    return {
      cities: data?.cities ?? [],
      localities: data?.localities ?? [],
      developers: data?.developers ?? [],
    };
  } catch {
    return { cities: [], localities: [], developers: [] };
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
