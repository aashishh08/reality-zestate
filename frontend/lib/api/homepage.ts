import { fetchFromAPI } from '../api-client';
import { HOMEPAGE_DATA_TAG } from '../cache-tags';
import type { PropertyItem } from '@/types/property-listing';
import type { Location } from './locations';
import type { Category } from './categories';

export interface HomepageCorridorPayload {
  locationSlug: string;
  citySlug: string;
  cityName: string;
  localitySlug: string;
  name: string;
  activeProjects: number;
}

export interface HomepageData {
  trending: PropertyItem[];
  upcoming: PropertyItem[];
  boutique: PropertyItem[];
  locations: Location[];
  developers: Array<{ id: string; name: string; slug: string; logo?: string }>;
  categories: Category[];
  featuredCorridors: HomepageCorridorPayload[];
}

/**
 * Single API call for the homepage — replaces 6+ separate fetches per render.
 */
export async function fetchHomepageData(
  revalidate: number | false = 3600,
): Promise<HomepageData> {
  const options =
    revalidate === false
      ? {}
      : { next: { revalidate, tags: [HOMEPAGE_DATA_TAG] } };

  const raw = await fetchFromAPI<HomepageData>('/homepage', options);
  return {
    trending: raw?.trending ?? [],
    upcoming: raw?.upcoming ?? [],
    boutique: raw?.boutique ?? [],
    locations: raw?.locations ?? [],
    developers: raw?.developers ?? [],
    categories: raw?.categories ?? [],
    featuredCorridors: raw?.featuredCorridors ?? [],
  };
}
