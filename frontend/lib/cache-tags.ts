/**
 * Next.js `fetch` cache tags — use with `next: { tags: [...] }` and `revalidateTag()`.
 */
export const HOMEPAGE_PROPERTY_SECTIONS_TAG = 'homepage-property-sections';
export const PROPERTY_DETAIL_TAG = 'property-detail';
export const PROPERTY_LIST_TAG = 'property-list';
export const PROJECTS_INDEX_TAG = 'projects-index';
export const LOCATION_DETAIL_TAG = 'location-detail';
export const CATEGORY_DETAIL_TAG = 'category-detail';

export function propertyDetailTag(slug: string) {
  return `property-detail:${slug}`;
}

export function locationDetailTag(slug: string) {
  return `location-detail:${slug}`;
}

export function categoryDetailTag(slug: string) {
  return `category-detail:${slug}`;
}
