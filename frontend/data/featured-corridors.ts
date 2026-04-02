/**
 * Curated micro-markets for the homepage corridor row.
 * Counts are filled at request time from the properties API; slugs must match backend enums.
 */
export interface FeaturedCorridorConfig {
  /** Slug for `/location/[slug]` — should match a row in `locations`. */
  locationSlug: string;
  citySlug: string;
  localitySlug: string;
  /** Fallback if the location is not in the homepage locations payload */
  name: string;
  moodLine: string;
  description: string;
}

export const FEATURED_CORRIDORS: FeaturedCorridorConfig[] = [
  {
    locationSlug: 'golf-course-road',
    citySlug: 'gurgaon',
    localitySlug: 'golf-course-road',
    name: 'Golf Course Road',
    moodLine: 'Old money. New highs.',
    description:
      'The NCR’s most established luxury spine — shallow resale, deep developer pedigree, and the social infrastructure buyers expect at the very top of the market.',
  },
  {
    locationSlug: 'dwarka-expressway',
    citySlug: 'gurgaon',
    localitySlug: 'dwarka-expressway',
    name: 'Dwarka Expressway',
    moodLine: 'The growth corridor with runway.',
    description:
      'Highway-led catchments with scaled launches and improving retail depth — where early institutional interest meets family-office scale.',
  },
  {
    locationSlug: 'bandra',
    citySlug: 'mumbai',
    localitySlug: 'bandra',
    name: 'Bandra',
    moodLine: 'Sea-facing scarcity.',
    description:
      'West Mumbai’s marquee belt for legacy apartments and new towers alike — liquidity, visibility, and tenant demand that rarely goes out of fashion.',
  },
  {
    locationSlug: 'noida-expressway',
    citySlug: 'noida',
    localitySlug: 'noida-expressway',
    name: 'Noida Expressway',
    moodLine: 'Structured supply, sharp product.',
    description:
      'Planned sector grids and grade-A developer lanes make this one of the most legible luxury pipelines in the NCR — easy to compare, easier to underwrite.',
  },
];
