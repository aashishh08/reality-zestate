/**
 * Curated navigation URLs — only links to tags/categories that exist on the site
 * with published inventory (aligned with /tags/published/slugs and sitemap-data).
 */

export type StatusTagLink = {
  label: string;
  slug: string;
  color: string;
  emoji: string;
};

/** Status tags shown in the header mega-menu (must exist in DB with listings). */
export const STATUS_TAG_LINKS: StatusTagLink[] = [
  { label: 'Trending', slug: 'trending', color: '#EF4444', emoji: '🔥' },
  { label: 'Upcoming', slug: 'upcoming', color: '#F59E0B', emoji: '📅' },
  { label: 'New Launch', slug: 'new-launch', color: '#10B981', emoji: '🚀' },
  { label: 'Ready to Move', slug: 'ready-to-move', color: '#06B6D4', emoji: '🏠' },
  { label: 'Under Construction', slug: 'under-construction', color: '#F97316', emoji: '🏗️' },
  { label: 'Featured', slug: 'featured', color: '#8B5CF6', emoji: '⭐' },
  { label: 'Investment Pick', slug: 'investment-pick', color: '#DB2777', emoji: '💰' },
  { label: 'Hot Property', slug: 'hot-property', color: '#DC2626', emoji: '🔥' },
];

export type NavLink = { label: string; href: string };

/** Footer “Explore” column — no dead /tag/luxury (use /category/luxury). */
export const FOOTER_EXPLORE_LINKS: NavLink[] = [
  { label: 'Trending Projects', href: '/tag/trending' },
  { label: 'Upcoming Launches', href: '/tag/upcoming' },
  { label: 'New Launch', href: '/tag/new-launch' },
  { label: 'Ready to Move', href: '/tag/ready-to-move' },
  { label: 'Luxury Homes', href: '/category/luxury' },
  { label: 'About Us', href: '/about-us' },
];

/** Footer “Project types” chips — slugs from categories with published inventory. */
export const FOOTER_CATEGORY_LINKS: NavLink[] = [
  { label: 'Luxury', href: '/category/luxury' },
  { label: 'Ultra Luxury', href: '/category/ultra-luxury' },
  { label: 'Ultra Villas', href: '/category/ultra-villas' },
  { label: 'Golf Residences', href: '/category/golf-residences' },
  { label: 'Branded Residences', href: '/category/branded-residences' },
];
