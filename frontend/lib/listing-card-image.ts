import type { PropertyItem } from '@/types/property-listing';

/** On-brand neutral fallback when listing has no hero image and no developer logo */
const LISTING_CARD_FALLBACK = '/images/hero-bg.png';

/**
 * Best image for property grid / carousel cards: hero thumbnail from API, else developer logo.
 */
export function listingCardImageUrl(
  property: Pick<PropertyItem, 'thumbnailUrl' | 'Developer'>,
): string {
  const thumb = property.thumbnailUrl?.trim();
  if (thumb) return thumb;
  const logo = property.Developer?.logo?.trim();
  if (logo) return logo;
  return LISTING_CARD_FALLBACK;
}
