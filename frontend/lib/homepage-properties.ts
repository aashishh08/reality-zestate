import { fetchFromAPI, buildQueryString } from '@/lib/api-client';
import type { PropertyItem } from '@/types/property-listing';

/**
 * Homepage sections that load properties from `/properties` with a single tag filter.
 * Backend applies the tag in SQL; we also filter client-side so rows always match the section.
 */
export const HOME_PROPERTY_SECTION_TAGS = {
  trending: 'trending',
  upcoming: 'upcoming',
  boutique: 'featured',
} as const;

export type HomePropertySection = keyof typeof HOME_PROPERTY_SECTION_TAGS;

function unwrapPropertiesPayload(raw: unknown): PropertyItem[] {
  if (Array.isArray(raw)) return raw as PropertyItem[];
  if (
    raw &&
    typeof raw === 'object' &&
    'data' in raw &&
    Array.isArray((raw as { data: unknown }).data)
  ) {
    return (raw as { data: PropertyItem[] }).data;
  }
  return [];
}

export function filterPropertiesByTagSlug(
  properties: PropertyItem[],
  tagSlug: string,
): PropertyItem[] {
  const want = tagSlug.toLowerCase();
  return properties.filter((p) => p.Tags?.some((t) => t.slug?.toLowerCase() === want) ?? false);
}

/**
 * Published properties for one homepage row: `tags=<slug>` on the API + post-filter on `Tags`.
 */
export async function fetchHomeSectionProperties(
  section: HomePropertySection,
  options: { limit?: number; revalidate?: number | false } = {},
): Promise<PropertyItem[]> {
  const limit = options.limit ?? 8;
  const revalidate = options.revalidate ?? 3600;
  const tagSlug = HOME_PROPERTY_SECTION_TAGS[section];
  const qs = buildQueryString({
    tags: tagSlug,
    limit,
    offset: 0,
    isPublished: true,
  });

  try {
    const raw = await fetchFromAPI<unknown>(
      `/properties${qs}`,
      revalidate === false ? {} : { next: { revalidate } },
    );
    const list = unwrapPropertiesPayload(raw);
    // Backend already filters by tag; keep a soft filter only when Tags are present (avoids empty sections if JSON omits them).
    const filtered = filterPropertiesByTagSlug(list, tagSlug);
    return filtered.length > 0 ? filtered : list;
  } catch {
    return [];
  }
}
