/**
 * Homepage featured corridors — locality slugs used only as a legacy fallback when
 * no rows have `isFeatured` in the database. Names come from the locations API.
 */
export const FEATURED_CORRIDOR_SLUGS = [
  'golf-course-road',
  'golf-course-road-extension',
  'noida-expressway',
  'dwarka-expressway',
] as const;

export interface FeaturedCorridorConfig {
  locationSlug: string;
  citySlug: string;
  cityName: string;
  localitySlug: string;
  name: string;
  moodLine: string;
  description: string;
}

export const DEFAULT_CORRIDOR_MOOD = 'Curated micro-market.';

export const DEFAULT_CORRIDOR_DESCRIPTION =
  'Premium projects and developer depth in this corridor — browse listings and request a structured memo.';

/** Keyed by locality slug. Unknown slugs use defaults above. */
export const CORRIDOR_EDITORIAL_BY_SLUG: Record<
  string,
  Pick<FeaturedCorridorConfig, 'moodLine' | 'description'>
> = {
  'golf-course-road': {
    moodLine: 'Old money. New highs.',
    description:
      'The NCR’s most established luxury spine — shallow resale, deep developer pedigree, and the social infrastructure buyers expect at the very top of the market.',
  },
  'golf-course-road-extension': {
    moodLine: 'The natural extension of GCR.',
    description:
      'Newer premium supply adjacent to the established GCR spine — similar buyer profile with more runway on fresh inventory and master-planned pockets.',
  },
  'dwarka-expressway': {
    moodLine: 'The growth corridor with runway.',
    description:
      'Highway-led catchments with scaled launches and improving retail depth — where early institutional interest meets family-office scale.',
  },
  'noida-expressway': {
    moodLine: 'Structured supply, sharp product.',
    description:
      'Planned sector grids and grade-A developer lanes make this one of the most legible luxury pipelines in the NCR — easy to compare, easier to underwrite.',
  },
};
