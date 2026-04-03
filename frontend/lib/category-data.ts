/**
 * Category Data
 * Hardcoded category data for SSR/ISR generation
 * In production, this should come from an API
 */

import { Project } from '@/types';

/** When a category exists in the API but not in static `categories` (e.g. Luxury, Commercial). */
export function buildFallbackCategoryEditorial(slug: string, name: string): CategoryData {
  return {
    slug,
    title: name,
    metaTitle: `${name} | Superluxere`,
    metaDescription: `Browse premium ${name} properties curated on Superluxere.`,
    heroTitle: name,
    heroSubtitle: 'Curated luxury inventory',
    heroImage: '/images/hero-bg.png',
    introText: `Discover published properties in the ${name} collection.`,
  };
}

export interface CategoryData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  /** Hero background — public path under `/images` */
  heroImage?: string;
  introText: string;
  citySections?: Array<{
    cityName: string;
    citySlug: string;
    projects: Project[];
  }>;
  features?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  contentSections?: Array<{
    title: string;
    content: string;
  }>;
  specialOffer?: {
    title: string;
    validTill: string;
    description: string;
  };
}

// Sample category data - should be replaced with API calls
const categories: Record<string, CategoryData> = {
  apartment: {
    slug: 'apartment',
    title: 'Apartments',
    metaTitle: 'Luxury Apartments | Superluxere',
    metaDescription: 'Discover premium apartment properties in Delhi NCR',
    heroTitle: 'Luxury Apartments',
    heroSubtitle: 'Experience premium living spaces designed for modern lifestyles',
    heroImage: '/images/hero-bg.png',
    introText: 'Explore our collection of premium apartment properties across Delhi NCR region.',
    citySections: [
      {
        cityName: 'Delhi',
        citySlug: 'delhi',
        projects: [],
      },
      {
        cityName: 'Gurgaon',
        citySlug: 'gurgaon',
        projects: [],
      },
      {
        cityName: 'Noida',
        citySlug: 'noida',
        projects: [],
      },
    ],
    features: [
      {
        title: 'World-Class Amenities',
        description: 'Swimming pools, fitness centers, and more',
        icon: 'amenities',
      },
      {
        title: 'Prime Locations',
        description: 'Located in the heart of major cities',
        icon: 'location',
      },
      {
        title: 'Modern Design',
        description: 'Thoughtfully designed spaces',
        icon: 'design',
      },
    ],
    contentSections: [
      {
        title: 'Why Choose Our Apartments?',
        content: 'Our apartment collections offer the perfect blend of luxury and comfort...',
      },
    ],
    specialOffer: {
      title: 'Special Launch Offer',
      validTill: 'January 31, 2026',
      description: 'Get exclusive benefits on early bookings',
    },
  },
  villa: {
    slug: 'villa',
    title: 'Villas',
    metaTitle: 'Luxury Villas | Superluxere',
    metaDescription: 'Discover premium villa properties in Delhi NCR',
    heroTitle: 'Luxury Villas',
    heroSubtitle: 'Experience the pinnacle of luxury living',
    heroImage: '/images/hero-bg.png',
    introText: 'Explore our collection of premium villa properties with expansive spaces.',
    citySections: [
      {
        cityName: 'Delhi',
        citySlug: 'delhi',
        projects: [],
      },
      {
        cityName: 'Gurgaon',
        citySlug: 'gurgaon',
        projects: [],
      },
    ],
    features: [
      {
        title: 'Private Spaces',
        description: 'Exclusive villas with private gardens',
        icon: 'privacy',
      },
      {
        title: 'High-End Finishes',
        description: 'Premium materials and craftsmanship',
        icon: 'premium',
      },
      {
        title: 'Secure Communities',
        description: '24/7 security and gated access',
        icon: 'security',
      },
    ],
    contentSections: [
      {
        title: 'Villa Living at Its Best',
        content: 'Our villas offer spacious layouts with modern amenities...',
      },
    ],
    specialOffer: {
      title: 'Villa Pre-Launch Offer',
      validTill: 'February 28, 2026',
      description: 'Secure your villa today with special discounts',
    },
  },
  boutique: {
    slug: 'boutique',
    title: 'Boutique Collection',
    metaTitle: 'Boutique Properties | Superluxere',
    metaDescription: 'Discover exclusive boutique properties',
    heroTitle: 'Boutique Collection',
    heroSubtitle: 'Limited edition luxury properties',
    heroImage: '/images/hero-bg.png',
    introText: 'Experience our exclusive boutique collection of premium properties.',
    features: [
      {
        title: 'Limited Units',
        description: 'Exclusive and limited availability',
        icon: 'exclusive',
      },
      {
        title: 'Bespoke Design',
        description: 'Customized to perfection',
        icon: 'design',
      },
      {
        title: 'Premium Services',
        description: 'Concierge and premium amenities',
        icon: 'service',
      },
    ],
    specialOffer: {
      title: 'Exclusive Boutique Offer',
      validTill: 'March 31, 2026',
      description: 'Limited time offer for boutique properties',
    },
  },

  'golf-residences': {
    slug: 'golf-residences',
    title: 'Golf Residences',
    metaTitle: 'Golf Residences | Superluxere',
    metaDescription: 'Private golf-fronting homes and estates across India’s finest fairways.',
    heroTitle: 'Golf Residences',
    heroSubtitle: 'Fairway-front living with club culture at your doorstep',
    heroImage: '/images/hero-bg.png',
    introText:
      'From championship courses to quiet green vistas, golf-tied residences blend recreation, privacy, and long-term rarity in one address.',
    features: [
      { title: 'Course adjacency', description: 'Homes positioned along or overlooking premier layouts', icon: 'location' },
      { title: 'Club access', description: 'Membership pathways and lifestyle programming where available', icon: 'service' },
      { title: 'Low-density land', description: 'Sprawling plots and villas designed for breathing room', icon: 'privacy' },
    ],
    contentSections: [
      {
        title: 'Why golf-side real estate endures',
        content:
          'Golf communities anchor enduring values: open space, security, and a buyer cohort that prioritises leisure and legacy. We surface only inventory that meets Superluxere’s verifiable standard.',
      },
    ],
  },

  'branded-residences': {
    slug: 'branded-residences',
    title: 'Branded Residences',
    metaTitle: 'Branded Residences | Superluxere',
    metaDescription: 'Hotel and luxury-brand residences with global service pedigree.',
    heroTitle: 'Branded Residences',
    heroSubtitle: 'Iconic names, private ownership, five-star service rails',
    heroImage: '/images/hero-bg.png',
    introText:
      'Partnerships with global hospitality and design houses bring turnkey service, elite fit-outs, and exit liquidity to a select set of owners.',
    features: [
      { title: 'Household-name operators', description: 'Recognised global brands overseeing operations', icon: 'premium' },
      { title: 'Service stack', description: 'Concierge, F&B, and residence management on demand', icon: 'service' },
      { title: 'Design coherence', description: 'Architect-led interiors with brand design guidelines', icon: 'design' },
    ],
    contentSections: [
      {
        title: 'Suited for whom',
        content:
          'Frequent travellers, cross-border families, and collectors who want a managed second home with a recognised depreciation profile and rental optionality.',
      },
    ],
  },

  'himalayan-living': {
    slug: 'himalayan-living',
    title: 'Himalayan Living',
    metaTitle: 'Himalayan Living | Superluxere',
    metaDescription: 'Alpine villas and retreats across the Himalayan belt.',
    heroTitle: 'Himalayan Living',
    heroSubtitle: 'Altitude, silence, and nature at a different scale',
    heroImage: '/images/hero-bg.png',
    introText:
      'Curated mountain inventory emphasises climate-proof construction, views, and access—whether for year-round living or a generational retreat.',
    features: [
      { title: 'Climate-smart builds', description: 'Insulation, heating, and structural choices for mountain zones', icon: 'design' },
      { title: 'Experiential access', description: 'Trailheads, resorts, and cultural anchors nearby', icon: 'location' },
      { title: 'Low light pollution', description: 'Night skies and soundscapes that cities cannot replicate', icon: 'privacy' },
    ],
  },

  'senior-living': {
    slug: 'senior-living',
    title: 'Senior Living',
    metaTitle: 'Senior Living | Superluxere',
    metaDescription: 'Premium senior living with care layers and resort-grade amenities.',
    heroTitle: 'Senior Living',
    heroSubtitle: 'Independence, healthcare adjacency, and community design',
    heroImage: '/images/category-senior-living.jpg',
    introText:
      'We feature developments with clear care pathways, emergency readiness, and amenity programming tuned to active ageing.',
    features: [
      { title: 'Care continuum', description: 'IL, AL, and memory support where applicable—always clarity-first', icon: 'service' },
      { title: 'Accessibility', description: 'Single-level options, lifts, and tactile design language', icon: 'design' },
      { title: 'Wellness', description: 'Physio, pools, and social programming baked into master plans', icon: 'amenities' },
    ],
  },

  'ultra-villas': {
    slug: 'ultra-villas',
    title: 'Ultra Villas',
    metaTitle: 'Ultra Villas | Superluxere',
    metaDescription: 'Ultra-luxury villas with land, pools, and bespoke architecture.',
    heroTitle: 'Ultra Villas',
    heroSubtitle: 'Land-rich compounds for multi-generational use',
    heroImage: '/images/hero-bg.png',
    introText:
      'Stand-alone villas with exceptional land-to-built ratios, private pools, and room for staff quarters—selected for privacy and scale.',
    features: [
      { title: 'Land bank', description: 'Quarter-acre to multi-acre plots in gated contexts', icon: 'privacy' },
      { title: 'Bespoke architecture', description: 'Named architects and interior ateliers', icon: 'design' },
      { title: 'Staff readiness', description: 'Service entries, utility wings, and security infrastructure', icon: 'security' },
    ],
  },

  'off-market': {
    slug: 'off-market',
    title: 'Off-Market',
    metaTitle: 'Off-Market Properties | Superluxere',
    metaDescription: 'Private inventory not broadly advertised—by introduction only.',
    heroTitle: 'Off-Market',
    heroSubtitle: 'Discreet listings for qualified buyers',
    heroImage: '/images/hero-bg.png',
    introText:
      'These opportunities are shared after fit checks. Expect NDA-friendly briefs, seller or developer dialogue, and pricing that reflects bilateral negotiation—not portal anchors.',
    features: [
      { title: 'Qualified access', description: 'We verify intent and capital before sharing packs', icon: 'security' },
      { title: 'No noisy bidding', description: 'Timetables tailored to large-ticket decisions', icon: 'exclusive' },
      { title: 'Single touchpoint', description: 'One Superluxere lead coordinates all meetings', icon: 'service' },
    ],
  },
};

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): CategoryData | null {
  return categories[slug] || null;
}

/**
 * Get all category slugs for static generation
 */
export function getAllCategorySlugs(): string[] {
  return Object.keys(categories);
}

/**
 * Get all categories
 */
export function getAllCategories(): CategoryData[] {
  return Object.values(categories);
}
