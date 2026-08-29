import type { ListingUrlSearchParams } from '@/lib/listing-search-params';

export const ROBOTS_NOINDEX_FOLLOW = { index: false, follow: true } as const;
export const ROBOTS_NOINDEX_NOFOLLOW = { index: false, follow: false } as const;

/** Developer collection pages with no published inventory should not be indexed. */
export function robotsForDeveloperListingPage(
  hasQueryVariant: boolean,
  publishedCount: number,
): typeof ROBOTS_NOINDEX_FOLLOW | undefined {
  if (hasQueryVariant || publishedCount === 0) {
    return ROBOTS_NOINDEX_FOLLOW;
  }
  return undefined;
}

export type ListingQueryVariantOptions = {
  /** Include city/category query params (e.g. /projects index) */
  showCityCategory?: boolean;
};

type SearchParamsInput =
  | ListingUrlSearchParams
  | Record<string, string | string[] | undefined>;

function pickParam(
  searchParams: SearchParamsInput,
  key: keyof ListingUrlSearchParams,
): string | undefined {
  const raw = (searchParams as Record<string, string | string[] | undefined>)[key];
  if (Array.isArray(raw)) return raw[0];
  if (typeof raw === 'string') return raw;
  return (searchParams as ListingUrlSearchParams)[key];
}

/** True when the listing URL has filter/pagination params that should not be indexed. */
export function hasListingQueryVariant(
  searchParams: SearchParamsInput,
  options: ListingQueryVariantOptions = {},
): boolean {
  const tag = pickParam(searchParams, 'tag')?.trim();
  const pageParam = Number(pickParam(searchParams, 'page') || '1');

  if (tag) return true;
  if (Number.isFinite(pageParam) && pageParam > 1) return true;

  if (options.showCityCategory) {
    const city = pickParam(searchParams, 'city')?.trim();
    const category = pickParam(searchParams, 'category')?.trim();
    if (city || category) return true;
  }

  return false;
}
