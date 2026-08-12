/** Shared hero image URLs for location pages (OG metadata + LocationHero). */
export const LOCATION_HERO_IMAGES: Record<string, string> = {
  delhi: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&h=600&fit=crop',
  'new-delhi':
    'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&h=600&fit=crop',
  mumbai:
    'https://images.unsplash.com/photo-1580573916550-e323be2ae537?w=1200&h=600&fit=crop',
  bangalore:
    'https://images.unsplash.com/photo-1596521222512-f1b99a8b2d0d?w=1200&h=600&fit=crop',
  gurgaon:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  noida:
    'https://images.unsplash.com/photo-1486328803556-cb3e53108c30?w=1200&h=600&fit=crop',
  'golf-course-road':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  'golf-course-road-extension':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  'dwarka-expressway':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  'noida-expressway':
    'https://images.unsplash.com/photo-1486328803556-cb3e53108c30?w=1200&h=600&fit=crop',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=600&fit=crop',
  worli:
    'https://images.unsplash.com/photo-1580573916550-e323be2ae537?w=1200&h=600&fit=crop',
  default:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
};

export function getLocationHeroImageUrl(slug: string): string {
  return (
    LOCATION_HERO_IMAGES[slug.toLowerCase()] ?? LOCATION_HERO_IMAGES.default
  );
}
