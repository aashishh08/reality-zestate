// Backend Property Type (from API)
export interface Property {
  id: string;
  slug: string;
  title: string;
  propertyType?: 'residential' | 'commercial';
  priceMin?: number | null;
  priceMax?: number | null;
  isPublished?: boolean;
  status?: 'draft' | 'published' | 'archived';
  seoTitle?: string | null;
  h1Heading?: string | null;
  metaDescription?: string | null;
  /** Display-only micro-area on project page; not used for listing filters. */
  sublocality?: string | null;

  Developer?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };

  Location?: {
    id: string;
    name: string;
    slug: string;
    type: string;
    parentId?: string;
  };

  Categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  Tags?: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  }>;

  PropertySections?: Array<{
    id: string;
    type: string;
    title: string;
    order: number;
    isVisible: boolean;
    data: Record<string, any>;
  }>;

  createdAt?: string;
  updatedAt?: string;
}

// Frontend Project Type (for display - combines API data with UI properties)
export interface Project extends Property {
  // UI Display properties
  location?: string; // Display location name
  price?: string; // Display price range
  image?: string; // Display image URL
  category?: "Trending" | "Upcoming" | "Boutique" | "Exclusive" | "Featured" | "New Launch" | "Luxury" | "Affordable" | string;
  tagColor?: string;

  type?: string;
  completionDate?: string;
  description?: string;
  subProjects?: {
    id: string;
    slug: string;
    title: string;
    location: string;
    price: string;
    image: string;
    type: string;
    description?: string;
  }[];

  // Detailed page content
  details?: {
    heroImage?: string;
    subtitle?: string;
    introText?: string;
    highlights?: {
      landArea?: string;
      possession?: string;
      rera?: string;
      configuration?: string;
      priceRange?: string;
      totalUnits?: string;
    };
    overview?: {
      heading: string;
      content: string[];
      features?: string[];
    };
    amenities?: {
      name: string;
      icon: string;
      image?: string;
    }[];
    floorPlans?: {
      type: string;
      superArea: string;
      price: string;
      image?: string;
    }[];
    masterPlan?: string;
    masterPlanDescription?: string;
    location?: {
      address?: string;
      mapImage?: string;
      nearby: {
        category: string;
        icon?: string;
        items: { name: string; distance?: string }[];
      }[];
      connectivity?: {
        place: string;
        icon?: string;
        time: string;
      }[];
    };
    gallery?: string[];
    /** Structured (CMS) or legacy string list (seed data). */
    keyTakeaways?:
      | {
          status?: string;
          type?: string;
          area?: string;
          configuration?: string;
          sizes?: string;
          towers?: string;
          floors?: string;
          totalUnits?: string;
          clubhouse?: string;
          priceRange?: string;
          reraNo?: string;
          launchDate?: string;
          possessionDate?: string;
          phases?: string;
          developer?: string;
          address?: string;
        }
      | string[];
    whyInvest?: string[] | Array<{ title: string; subtitle: string; icon?: string }>;
    investmentAnalysis?: string;
    whyInvestStats?: {
      annualAppreciation?: string;
      rentalYield?: string;
      preLaunchGain?: string;
    };
    amenitiesStats?: {
      clubhouseSqFt?: string;
      amenitiesCount?: string;
      swimmingPools?: string;
      diningOptions?: string;
    };
    floorPlanDescriptionSections?: {
      heading: string;
      body: string;
    }[];
    videoUrl?: string;
    paymentPlans?: {
      title: string;
      type: string;
      description: string;
    }[];
    sectionHeadings?: {
      keyTakeaways?: string;
      whyInvest?: string;
      gallery?: string;
      amenities?: string;
      floorPlans?: string;
      paymentPlans?: string;
      location?: string;
      masterPlan?: string;
      faqs?: string;
      team?: string;
    };
    faqs?: {
      question: string;
      answer: string;
      category?: string;
    }[];
    team?: {
      members: {
        role: string;
        name: string;
        color: string;
        description: string;
        achievements: string[];
      }[];
      highlights?: {
        title: string;
        subtitle: string;
        icon?: string;
      }[];
    };

    /** Legacy seed data only — not rendered on the default project page */
    usp?: string[];
    specifications?: { category: string; items: string[] }[];
  };
}
