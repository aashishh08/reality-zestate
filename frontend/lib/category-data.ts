/**
 * Category Data
 * Hardcoded category data for SSR/ISR generation
 * In production, this should come from an API
 */

export interface CategoryData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  citySections?: Array<{
    city: string;
    projects: string[];
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
    metaTitle: 'Luxury Apartments | Opulnz Abode',
    metaDescription: 'Discover premium apartment properties in Delhi NCR',
    heroTitle: 'Luxury Apartments',
    heroSubtitle: 'Experience premium living spaces designed for modern lifestyles',
    introText: 'Explore our collection of premium apartment properties across Delhi NCR region.',
    citySections: [
      {
        city: 'Delhi',
        projects: [],
      },
      {
        city: 'Gurgaon',
        projects: [],
      },
      {
        city: 'Noida',
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
    metaTitle: 'Luxury Villas | Opulnz Abode',
    metaDescription: 'Discover premium villa properties in Delhi NCR',
    heroTitle: 'Luxury Villas',
    heroSubtitle: 'Experience the pinnacle of luxury living',
    introText: 'Explore our collection of premium villa properties with expansive spaces.',
    citySections: [
      {
        city: 'Delhi',
        projects: [],
      },
      {
        city: 'Gurgaon',
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
    metaTitle: 'Boutique Properties | Opulnz Abode',
    metaDescription: 'Discover exclusive boutique properties',
    heroTitle: 'Boutique Collection',
    heroSubtitle: 'Limited edition luxury properties',
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
