import { Property, Project } from "@/types";

/**
 * Transforms backend Property with PropertySections into frontend Project format
 * This allows all properties to use the same unified detail page layout (Grand Arch style)
 */
export function transformBackendPropertyToProject(property: Property): Project {
  // Build details object from PropertySections
  const detailsFromSections = buildDetailsFromSections(property.PropertySections || []);

  // Format price display
  const priceDisplay = formatPrice(property.priceMin, property.priceMax);

  // Format location display
  const locationDisplay = property.Location?.name || "India";

  return {
    ...property,
    // Display properties
    price: priceDisplay,
    location: locationDisplay,
    image: detailsFromSections.heroImage || "/images/project-1.jpg",
    type: formatPropertyType(property.propertyType),
    category: "Exclusive",
    
    // Detailed page content built from PropertySections
    details: detailsFromSections,
  };
}

/**
 * Build the details object from PropertySections array
 */
function buildDetailsFromSections(sections: Property["PropertySections"] = []): Project["details"] {
  // Index sections by type for easy access
  const sectionMap = new Map<string, any>();
  sections.forEach((section) => {
    sectionMap.set(section.type, section.data);
  });

  // Extract data from sections
  const heroData = sectionMap.get("heroImage") || {};
  const highlightsData = sectionMap.get("highlights") || {};
  const amenitiesData = sectionMap.get("amenities") || { items: [] };
  const keyTakeawaysData = sectionMap.get("keyTakeaways") || { takeaways: [] };
  const whyInvestData = sectionMap.get("whyInvest") || { reasons: [] };
  const faqsData = sectionMap.get("faqs") || { faqs: [] };

  return {
    heroImage: heroData.image || "/images/project-1.jpg",
    subtitle: heroData.subtitle || "Luxury Development",
    
    highlights: {
      landArea: highlightsData.landArea || "N/A",
      possession: highlightsData.possession || "N/A",
      rera: highlightsData.rera || "N/A",
      configuration: highlightsData.configuration || "N/A",
      priceRange: highlightsData.priceRange || "N/A",
    },

    overview: {
      heading: "Overview of the Project",
      content: [
        "A premium property development with world-class amenities and infrastructure.",
        "Strategically located with excellent connectivity to major hubs.",
        "Designed for luxury living with modern elegance and functionality.",
        "Offers a perfect blend of comfort and sophistication.",
      ],
      features: highlightsData.features || [
        "Premium Construction",
        "World-class Amenities",
        "Excellent Connectivity",
        "Luxury Lifestyle",
      ],
    },

    amenities: transformAmenities(amenitiesData.items || []),
    
    gallery: [
      "/images/project-1.jpg",
      "/images/project-2.jpg",
      "/images/project-3.jpg",
      "/images/project-4.jpg",
    ],

    keyTakeaways: keyTakeawaysData.takeaways || [],

    whyInvest: whyInvestData.reasons || [],

    videoUrl: "",

    location: {
      mapImage: "/images/grand-arch-location.jpg",
      nearby: [
        {
          category: "Schools",
          items: [
            { name: "Delhi Public School", distance: "2 km" },
            { name: "DPS International", distance: "3 km" },
          ],
        },
        {
          category: "Hospitals",
          items: [
            { name: "Apollo Hospital", distance: "1.5 km" },
            { name: "Fortis Healthcare", distance: "2 km" },
          ],
        },
        {
          category: "Shopping",
          items: [
            { name: "Central Mall", distance: "1 km" },
            { name: "Premium Market", distance: "1.5 km" },
          ],
        },
        {
          category: "Transportation",
          items: [
            { name: "Metro Station", distance: "0.5 km" },
            { name: "Bus Stand", distance: "1 km" },
          ],
        },
      ],
    },

    faqs: faqsData.faqs || [],

    usp: [
      "Premium Location",
      "World-Class Amenities",
      "Expert Construction",
      "Investment Potential",
    ],

    floorPlans: [
      {
        type: "2 BHK",
        superArea: "1800 sq.ft",
        price: "₹ 2 Cr",
        image: "/images/3bhk-plan.png",
      },
      {
        type: "3 BHK",
        superArea: "2500 sq.ft",
        price: "₹ 3.5 Cr",
        image: "/images/4bhk-plan.png",
      },
      {
        type: "4 BHK",
        superArea: "3500 sq.ft",
        price: "₹ 5 Cr",
        image: "/images/5bhk-plan.png",
      },
    ],

    paymentPlans: [
      {
        title: "20-40-40 Payment Plan",
        type: "Standard",
        description: "20% on booking, 40% during construction, 40% on possession",
      },
      {
        title: "Progressive Payment Plan",
        type: "Flexible",
        description: "Equal payments throughout construction period",
      },
    ],

    specifications: [
      {
        category: "Structure",
        items: [
          "RCC Frame Structure",
          "Seismic Resistant Design",
          "Fire Safety Compliant",
        ],
      },
      {
        category: "Utilities",
        items: ["24/7 Power Supply", "Water Harvesting", "Waste Management"],
      },
    ],
  };
}

/**
 * Transform amenities from backend format to frontend format
 */
function transformAmenities(
  amenities: Array<{ name: string; icon?: string; image?: string }>
) {
  return amenities.map((amenity) => ({
    name: amenity.name,
    icon: amenity.icon || "🏢",
    image: amenity.image || "/images/project-1.jpg",
  }));
}

/**
 * Format property type for display
 */
function formatPropertyType(type: string): string {
  const typeMap: Record<string, string> = {
    residential: "Luxury Apartments",
    commercial: "Commercial Space",
    mixed: "Mixed-Use Development",
  };
  return typeMap[type] || type;
}

/**
 * Format price range for display
 */
function formatPrice(min: number, max: number): string {
  const formatNumber = (num: number): string => {
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(0)} Lac`;
    }
    return `₹ ${num}`;
  };

  return `${formatNumber(min)} - ${formatNumber(max)}`;
}
