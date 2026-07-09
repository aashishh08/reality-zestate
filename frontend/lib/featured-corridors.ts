import { fetchFromAPI, buildQueryString } from '@/lib/api-client';
import {
  CORRIDOR_EDITORIAL_BY_SLUG,
  DEFAULT_CORRIDOR_DESCRIPTION,
  DEFAULT_CORRIDOR_MOOD,
  FEATURED_CORRIDOR_SLUGS,
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
 * Build featured corridor cards from consolidated homepage API payload.
 */
export function buildFeaturedCorridorCardsFromApi(
  corridors: Array<{
    localitySlug: string;
    citySlug: string;
    name: string;
    activeProjects: number;
    locationSlug?: string;
  }>,
): FeaturedCorridorCard[] {
  return corridors.map((row) => {
    const localitySlug = row.localitySlug;
    const editorial = editorialForSlug(localitySlug);
    return {
      locationSlug: row.locationSlug ?? localitySlug,
      citySlug: row.citySlug,
      localitySlug,
      name: row.name,
      moodLine: editorial.moodLine,
      description: editorial.description,
      displayName: row.name,
      activeProjects: row.activeProjects,
    };
  });
}

const featuredSlugOrder = new Map(
  FEATURED_CORRIDOR_SLUGS.map((slug, index) => [slug, index]),
);

/**
 * Homepage “India’s best corridors”: whitelisted localities from `FEATURED_CORRIDOR_SLUGS`.
 * Mood/description from `CORRIDOR_EDITORIAL_BY_SLUG`; counts from the properties API.
 * Prefer `buildFeaturedCorridorCardsFromApi` when homepage payload is already loaded.
 */
export async function getFeaturedCorridorCards(
  revalidate: number | false = 3600,
): Promise<FeaturedCorridorCard[]> {
  try {
    const res = await getLocations({ type: 'locality' }, revalidate);
    const rows = Array.isArray(res) ? res : res?.data ?? [];
    const localities = rows.filter(
      (loc): loc is Location =>
        Boolean(
          loc?.slug &&
            loc?.name &&
            loc?.type === 'locality' &&
            isCityParent(loc.parent) &&
            featuredSlugOrder.has(loc.slug),
        ),
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

    return cards.sort(
      (a, b) =>
        (featuredSlugOrder.get(a.localitySlug) ?? 0) -
        (featuredSlugOrder.get(b.localitySlug) ?? 0),
    );
  } catch {
    return [];
  }
}
