import { fetchFromAPI, buildQueryString } from '@/lib/api-client';
import {
  CORRIDOR_EDITORIAL_BY_SLUG,
  DEFAULT_CORRIDOR_DESCRIPTION,
  DEFAULT_CORRIDOR_MOOD,
  type FeaturedCorridorConfig,
} from '@/data/featured-corridors';
import { getLocations, type Location } from '@/lib/api/locations';

export interface FeaturedCorridorCard extends FeaturedCorridorConfig {
  displayName: string;
  activeProjects: number;
}

function isCityParent(parent: Location['parent']): parent is Location {
  return Boolean(parent && parent.type === 'city' && parent.slug);
}

function editorialForSlug(slug: string): Pick<FeaturedCorridorConfig, 'moodLine' | 'description'> {
  return CORRIDOR_EDITORIAL_BY_SLUG[slug] ?? {
    moodLine: DEFAULT_CORRIDOR_MOOD,
    description: DEFAULT_CORRIDOR_DESCRIPTION,
  };
}

async function publishedTotalForCorridor(
  citySlug: string,
  localitySlug: string,
  revalidate: number | false,
): Promise<number> {
  try {
    const qs = buildQueryString({
      citySlug,
      localitySlug,
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
}

/**
 * Homepage “India’s best corridors”: one card per `locality` row from the API (parent must be a city).
 * Optional mood/description from `CORRIDOR_EDITORIAL_BY_SLUG`; counts from the properties API.
 */
export async function getFeaturedCorridorCards(
  revalidate: number | false = 3600,
): Promise<FeaturedCorridorCard[]> {
  try {
    const res = await getLocations({ type: 'locality' }, revalidate);
    const rows = Array.isArray(res) ? res : res?.data ?? [];
    const localities = rows.filter(
      (loc): loc is Location =>
        Boolean(loc?.slug && loc?.name && loc?.type === 'locality' && isCityParent(loc.parent)),
    );

    const cards = await Promise.all(
      localities.map(async (loc) => {
        const citySlug = loc.parent!.slug;
        const localitySlug = loc.slug;
        const editorial = editorialForSlug(localitySlug);
        const activeProjects = await publishedTotalForCorridor(citySlug, localitySlug, revalidate);

        const base: FeaturedCorridorConfig = {
          locationSlug: localitySlug,
          citySlug,
          localitySlug,
          name: loc.name,
          moodLine: editorial.moodLine,
          description: editorial.description,
        };

        return {
          ...base,
          displayName: loc.name,
          activeProjects,
        };
      }),
    );

    return cards.sort((a, b) => a.displayName.localeCompare(b.displayName));
  } catch {
    return [];
  }
}
