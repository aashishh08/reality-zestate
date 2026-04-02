/**
 * Per-slug hardcoded copy layered on top of API-driven defaults.
 *
 * - Locations / localities: keys match `location.slug` from `/location/[slug]`
 *   (e.g. `gurgaon`, `golf-course-road`). Same route serves city + micro-market.
 * - Developers: keys match `developer.slug` from `/developer/[slug]`.
 *
 * Only include keys you want to override; everything else stays dynamic.
 */

import type { MicroMarketPageModel } from '@/types/location-micro-market';
import type { DeepPartial } from '@/lib/deep-merge';

/** Editorial + corridor sections for `/location/[slug]` */
export const LOCATION_MICRO_MARKET_OVERRIDES: Record<string, DeepPartial<MicroMarketPageModel>> = {
  /**
   * Keys must match `location.slug` from your API (lowercase in lookup).
   * Uncomment and edit — e.g. `gurgaon`, `golf-course-road`, sector slugs, etc.
   *
   * gurgaon: {
   *   hero: {
   *     moodLine: 'Old money. New highs.',
   *     stats: [
   *       { value: '₹32K–₹55K', label: 'PSF range', sub: 'Luxury segment · indicative' },
   *       { value: '—', label: 'Active projects', sub: 'Uses live total after merge — set in builder or omit' },
   *     ],
   *   },
   *   character: { pullQuote: '"…"' },
   *   faqs: [ { question: '…', answer: '…' } ], // replaces entire FAQ list if provided
   * },
   */
};

/** Listing page copy + hero extras for `/developer/[slug]` */
export interface DeveloperPageCopyOverride {
  /** Replaces PropertyListingTemplate title (default: `{name} Projects`) */
  title?: string;
  subtitle?: string;
  noResultsMessage?: string;
  /** Shown under the H1 when API `description` is empty */
  heroTagline?: string;
  /** Overrides the Unsplash map in DeveloperHero */
  heroImageUrl?: string;
}

export const DEVELOPER_PAGE_OVERRIDES: Record<string, DeveloperPageCopyOverride> = {
  // Example:
  // 'adani-realty': {
  //   heroTagline: 'Nation-wide premium residential and commercial footprint.',
  //   heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-cb3e92ad1ab?w=1200&h=600&fit=crop',
  // },
};

export function getLocationMicroMarketOverrides(
  slug: string,
): DeepPartial<MicroMarketPageModel> | undefined {
  return LOCATION_MICRO_MARKET_OVERRIDES[slug.toLowerCase()];
}

export function getDeveloperPageOverrides(slug: string): DeveloperPageCopyOverride | undefined {
  return DEVELOPER_PAGE_OVERRIDES[slug.toLowerCase()];
}
