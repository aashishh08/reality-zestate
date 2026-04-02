import { fetchFromAPI, buildQueryString } from '@/lib/api-client';
import {
  FEATURED_CORRIDORS,
  type FeaturedCorridorConfig,
} from '@/data/featured-corridors';
import type { Location } from '@/lib/api/locations';

export interface FeaturedCorridorCard extends FeaturedCorridorConfig {
  displayName: string;
  activeProjects: number;
}

function resolveDisplayName(
  slug: string,
  fallback: string,
  locations: Location[],
): string {
  const match = locations.find(
    (l) => l.slug.toLowerCase() === slug.toLowerCase(),
  );
  return match?.name ?? fallback;
}

function buildCards(
  locations: Location[],
  totals: number[],
): FeaturedCorridorCard[] {
  return FEATURED_CORRIDORS.map((c, i) => ({
    ...c,
    displayName: resolveDisplayName(c.locationSlug, c.name, locations),
    activeProjects: totals[i] ?? 0,
  }));
}

/**
 * Load featured corridors with live published project totals (per city + locality enum slugs).
 */
export async function getFeaturedCorridorCards(
  locations: Location[],
  revalidate: number | false = 3600,
): Promise<FeaturedCorridorCard[]> {
  try {
    const totals = await Promise.all(
      FEATURED_CORRIDORS.map(async (c) => {
        try {
          const qs = buildQueryString({
            citySlug: c.citySlug,
            localitySlug: c.localitySlug,
            isPublished: true,
            limit: 1,
            offset: 0,
          });
          const res = await fetchFromAPI<{
            data: unknown[];
            pagination?: { total: number };
          }>(`/properties${qs}`, revalidate === false ? {} : { next: { revalidate } });
          return res?.pagination?.total ?? 0;
        } catch {
          return 0;
        }
      }),
    );
    return buildCards(locations, totals);
  } catch {
    return buildCards(locations, FEATURED_CORRIDORS.map(() => 0));
  }
}
