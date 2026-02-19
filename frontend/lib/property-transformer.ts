import { Property, Project } from "@/types";

/**
 * Default amenities to display when backend data is not available
 */
const DEFAULT_AMENITIES = [
  { name: "Swimming Pool", icon: "🏊", image: "/images/project-1.jpg" },
  { name: "Gymnasium & Fitness Center", icon: "💪", image: "/images/project-2.jpg" },
  { name: "Clubhouse", icon: "🏛️", image: "/images/project-3.jpg" },
  { name: "Landscaped Gardens", icon: "🌳", image: "/images/project-4.jpg" },
  { name: "Children's Play Area", icon: "🎪", image: "/images/project-1.jpg" },
  { name: "24/7 Security", icon: "🔒", image: "/images/project-2.jpg" },
  { name: "Power Backup", icon: "⚡", image: "/images/project-3.jpg" },
  { name: "Parking", icon: "🚗", image: "/images/project-4.jpg" },
];

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
  const introData = sectionMap.get("intro") || {};
  const highlightsData = sectionMap.get("highlights") || {};
  const amenitiesData = sectionMap.get("amenities") || { items: [] };
  const keyTakeawaysData = sectionMap.get("keyTakeaways") || { takeaways: [] };
  const whyInvestData = sectionMap.get("whyInvest") || { reasons: [] };
  const faqsData = sectionMap.get("faqs") || { faqs: [] };
  const masterPlanData = sectionMap.get("masterPlan") || {};

  return {
    heroImage: heroData.image || "/images/project-1.jpg",
    subtitle: heroData.subtitle || "Luxury Development",
    introText: introData.text || "Discover premium living at its finest with world-class amenities, strategic location, and architectural excellence. Experience a lifestyle that redefines luxury and comfort in every detail.",

    highlights: {
      landArea: highlightsData.landArea || "N/A",
      possession: highlightsData.possession || "N/A",
      rera: highlightsData.rera || "N/A",
      configuration: highlightsData.configuration || "N/A",
      priceRange: highlightsData.priceRange || "N/A",
      totalUnits: highlightsData.totalUnits || "N/A",
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

    masterPlan: masterPlanData.image || "/images/project-1.jpg",
    masterPlanDescription: masterPlanData.description || [],

    gallery: [
      "/images/project-1.jpg",
      "/images/project-2.jpg",
      "/images/project-3.jpg",
      "/images/project-4.jpg",
    ],

    keyTakeaways: keyTakeawaysData.takeaways || [],

    whyInvest: whyInvestData.reasons || [
      { title: "Prime Location Appreciation", subtitle: "Strategic location with high appreciation potential", icon: "location" },
      { title: "Brand Legacy", subtitle: "Trusted developer with proven track record", icon: "award" },
      { title: "Investment Returns", subtitle: "Strong rental yield and capital appreciation", icon: "trending" },
      { title: "Market Timing", subtitle: "Pre-launch pricing advantage", icon: "calendar" }
    ],

    investmentAnalysis: whyInvestData.analysis || `This premium development offers a compelling investment opportunity in one of the most sought-after locations. The strategic location ensures excellent connectivity to major business hubs, entertainment zones, and essential amenities.

The property benefits from being developed by a renowned builder with a proven track record in delivering quality projects on time. This reputation provides investors with the assurance of transparent dealings and reliable possession timelines.

From an appreciation perspective, the micro-market has demonstrated consistent growth over the years. The area's infrastructure development, coupled with limited supply of premium properties, creates a favorable environment for long-term capital appreciation. Historical data suggests properties in this corridor have delivered superior returns compared to other residential zones.

Rental yield potential is another attractive aspect of this investment. The location commands premium rents due to its proximity to corporate offices and lifestyle amenities. Luxury apartments in this area typically generate rental yields in the range of 3-4%, providing steady cash flow for investors.

The current pre-launch phase presents an optimal entry point from a pricing perspective. Early investors typically benefit from significant appreciation by the time of possession, as seen in previous projects in similar locations. Combined with flexible payment plans, this timing advantage enhances the overall investment proposition.`,

    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",

    location: {
      address: "Prime Location",
      mapImage: "/images/grand-arch-location.jpg",
      nearby: [
        {
          category: "Educational Institutions",
          icon: "education",
          items: [
            { name: "Delhi Public School" },
            { name: "DPS International" },
            { name: "The Shri Ram School" },
            { name: "Heritage School" },
          ],
        },
        {
          category: "Healthcare Facilities",
          icon: "healthcare",
          items: [
            { name: "Apollo Hospital" },
            { name: "Fortis Healthcare" },
            { name: "Max Hospital" },
            { name: "Medanta Hospital" },
          ],
        },
        {
          category: "Shopping & Entertainment",
          icon: "shopping",
          items: [
            { name: "Central Mall" },
            { name: "Premium Market" },
            { name: "DLF Cyber Hub" },
            { name: "Ambience Mall" },
          ],
        },
      ],
      connectivity: [
        { place: "IGI Airport", icon: "airport", time: "20 mins" },
        { place: "Sector 54 Chowk", icon: "location", time: "5 mins" },
        { place: "Business District", icon: "building", time: "15 mins" },
        { place: "Highway", icon: "location", time: "10 mins" },
      ],
    },

    faqs: faqsData.faqs || [
      {
        question: "What is the project about?",
        answer: "This is a premium residential development featuring ultra-luxury apartments with world-class amenities and strategic location.",
        category: "General"
      },
      {
        question: "What are the available unit configurations?",
        answer: "We offer multiple configurations ranging from 2 BHK to 4+ BHK units, each designed with premium finishes and modern amenities.",
        category: "Units"
      },
      {
        question: "What are the payment options?",
        answer: "We provide flexible payment plans including construction-linked, down payment, and progressive payment options to suit your needs.",
        category: "Payment"
      },
      {
        question: "When is the possession timeline?",
        answer: "The project is planned for possession within the specified timeline. Contact our sales team for detailed information.",
        category: "Possession"
      }
    ],

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

    team: {
      members: [
        {
          role: "Architect",
          name: "Renowned Architecture Firm",
          color: "#3B82F6",
          description: "Experienced architects bringing international standards to the project with award-winning designs.",
          achievements: [
            "Multiple architecture excellence awards",
            "100+ million sq.ft. designed globally",
            "Specialized in luxury residential developments",
          ],
        },
        {
          role: "Landscape Design",
          name: "International Landscape Partners",
          color: "#10B981",
          description: "World-class landscape designers creating sustainable outdoor spaces that enhance living experience.",
          achievements: [
            "40+ years of design excellence",
            "Projects across multiple continents",
            "Focus on sustainable landscaping",
          ],
        },
        {
          role: "Construction",
          name: "Trusted Construction Partner",
          color: "#F97316",
          description: "Experienced construction team with proven track record in delivering premium quality projects.",
          achievements: [
            "50+ years of construction expertise",
            "25+ million sq.ft. delivered",
            "ISO certified quality processes",
          ],
        },
      ],
      highlights: [
        {
          title: "Global Expertise",
          subtitle: "International design standards",
        },
        {
          title: "Proven Track Record",
          subtitle: "100+ million sq.ft. delivered",
        },
        {
          title: "Award Winning",
          subtitle: "Multiple industry accolades",
        },
      ],
    },
  };
}

/**
 * Transform amenities from backend format to frontend format
 * Returns default amenities if no data is provided
 */
function transformAmenities(
  amenities: Array<{ name: string; icon?: string; image?: string }>
) {
  // If no amenities provided, return defaults
  if (!amenities || amenities.length === 0) {
    return DEFAULT_AMENITIES;
  }

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
