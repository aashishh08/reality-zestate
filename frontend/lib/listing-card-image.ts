import type { PropertyItem } from '@/types/property-listing';

/**
 * Best image for property grid / carousel cards: hero thumbnail from API, else developer logo.
 * Returns empty string when neither exists (cards render a neutral gradient).
 */
export function listingCardImageUrl(
  property: Pick<PropertyItem, 'thumbnailUrl' | 'Developer'>,
): string {
  const thumb = property.thumbnailUrl?.trim();
  if (thumb) return thumb;
  const logo = property.Developer?.logo?.trim();
  if (logo) return logo;
  return '';
}
