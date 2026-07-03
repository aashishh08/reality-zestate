/**
 * Parse and build URL search params for property listing pages.
 * Mirrors the /blogs pagination pattern.
 */

import type { PropertyFilters } from '@/types/property-listing';

export type ListingUrlSearchParams = {
  page?: string;
  tag?: string;
  city?: string;
  category?: string;
};

type ParseOptions = {
  itemsPerPage?: number;
  /** Allow city/category query params (e.g. /projects index) */
  showCityCategory?: boolean;
  categorySlugToId?: Record<string, string>;
};

type BuildOptions = {
  itemsPerPage?: number;
  showCityCategory?: boolean;
  categoryIdToSlug?: Record<string, string>;
};

export function parseListingSearchParams(
  sp: ListingUrlSearchParams,
  options: ParseOptions = {},
): Partial<PropertyFilters> {
  const itemsPerPage = options.itemsPerPage ?? 12;
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  const filters: Partial<PropertyFilters> = {
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
  };

  const tag = sp.tag?.trim();
  if (tag) filters.tags = [tag];

  if (options.showCityCategory) {
    const city = sp.city?.trim();
    if (city) filters.citySlug = city;

    const catSlug = sp.category?.trim();
    if (catSlug && options.categorySlugToId?.[catSlug]) {
      filters.categoryIds = [options.categorySlugToId[catSlug]];
    }
  }

  return filters;
}

export function buildListingSearchParams(
  filters: PropertyFilters,
  options: BuildOptions = {},
): URLSearchParams {
  const params = new URLSearchParams();
  const itemsPerPage = options.itemsPerPage ?? 12;
  const page = Math.floor((filters.offset ?? 0) / itemsPerPage) + 1;

  if (page > 1) params.set('page', String(page));

  if (filters.tags?.length === 1) {
    params.set('tag', filters.tags[0]);
  }

  if (options.showCityCategory) {
    if (filters.citySlug) params.set('city', filters.citySlug);

    if (filters.categoryIds?.length === 1 && options.categoryIdToSlug) {
      const slug = options.categoryIdToSlug[filters.categoryIds[0]];
      if (slug) params.set('category', slug);
    }
  }

  return params;
}

export function listingSearchParamsFromRecord(
  raw: Record<string, string | string[] | undefined>,
): ListingUrlSearchParams {
  const pick = (key: string) => {
    const v = raw[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  return {
    page: pick('page'),
    tag: pick('tag'),
    city: pick('city'),
    category: pick('category'),
  };
}
