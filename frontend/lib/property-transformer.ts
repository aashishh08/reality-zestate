import { Property, Project } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULTS (only used when a section is genuinely absent from DB)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_AMENITIES = [
  { name: "Swimming Pool", icon: "🏊", image: "/images/project-1.jpg" },
  { name: "Gymnasium & Fitness Centre", icon: "💪", image: "/images/project-2.jpg" },
  { name: "Clubhouse", icon: "🏛️", image: "/images/project-3.jpg" },
  { name: "Landscaped Gardens", icon: "🌳", image: "/images/project-4.jpg" },
  { name: "Children's Play Area", icon: "🎪", image: "/images/project-1.jpg" },
  { name: "24/7 Security", icon: "🔒", image: "/images/project-2.jpg" },
  { name: "Power Backup", icon: "⚡", image: "/images/project-3.jpg" },
  { name: "Parking", icon: "🚗", image: "/images/project-4.jpg" },
];

const DEFAULT_FLOOR_PLANS = [
  { type: "2 BHK", superArea: "1800 sq.ft", price: "₹ 2 Cr", image: "/images/3bhk-plan.png" },
  { type: "3 BHK", superArea: "2500 sq.ft", price: "₹ 3.5 Cr", image: "/images/4bhk-plan.png" },
  { type: "4 BHK", superArea: "3500 sq.ft", price: "₹ 5 Cr", image: "/images/5bhk-plan.png" },
];

const DEFAULT_PAYMENT_PLANS = [
  { title: "20-40-40 Payment Plan", type: "Standard", description: "20% on booking, 40% during construction, 40% on possession" },
  { title: "Progressive Payment Plan", type: "Flexible", description: "Equal payments throughout the construction period" },
];

const DEFAULT_WHY_INVEST = [
  { title: "Prime Location Appreciation", subtitle: "Strategic location with high appreciation potential", icon: "location" },
  { title: "Brand Legacy", subtitle: "Trusted developer with proven track record", icon: "award" },
  { title: "Investment Returns", subtitle: "Strong rental yield and capital appreciation", icon: "trending" },
  { title: "Market Timing", subtitle: "Pre-launch pricing advantage", icon: "calendar" },
];

const DEFAULT_FAQS = [
  { question: "What is the project about?", answer: "A premium residential development with world-class amenities.", category: "General" },
  { question: "What unit configurations are available?", answer: "Multiple configurations from 2 BHK to 4+ BHK.", category: "Units" },
  { question: "What are the payment options?", answer: "Flexible plans including CLP, DP and subvention options.", category: "Payment" },
  { question: "When is the possession timeline?", answer: "Contact our sales team for detailed information.", category: "Possession" },
];

const DEFAULT_OVERVIEW_CONTENT = [
  "A premium property development with world-class amenities and infrastructure.",
  "Strategically located with excellent connectivity to major hubs.",
  "Designed for luxury living with modern elegance and functionality.",
  "Offers a perfect blend of comfort and sophistication.",
];

const DEFAULT_LOCATION = {
  address: "Prime Location",
  mapImage: "/images/grand-arch-location.jpg",
  nearby: [
    { category: "Educational Institutions", icon: "education", items: [{ name: "Delhi Public School" }, { name: "Heritage School" }] },
    { category: "Healthcare Facilities", icon: "healthcare", items: [{ name: "Apollo Hospital" }, { name: "Fortis Healthcare" }] },
    { category: "Shopping & Entertainment", icon: "shopping", items: [{ name: "Central Mall" }, { name: "Ambience Mall" }] },
  ],
  connectivity: [
    { place: "IGI Airport", icon: "airport", time: "20 mins" },
    { place: "Business District", icon: "building", time: "15 mins" },
  ],
};

const DEFAULT_TEAM = {
  members: [
    {
      role: "Architect",
      name: "Renowned Architecture Firm",
      color: "#3B82F6",
      description: "Experienced architects bringing international standards.",
      achievements: ["Multiple architecture excellence awards", "100+ million sq.ft. designed globally"],
    },
    {
      role: "Landscape Design",
      name: "International Landscape Partners",
      color: "#10B981",
      description: "World-class landscape designers creating sustainable spaces.",
      achievements: ["40+ years of design excellence", "Projects across multiple continents"],
    },
    {
      role: "Construction",
      name: "Trusted Construction Partner",
      color: "#F97316",
      description: "Reliable construction team with ISO-certified quality processes.",
      achievements: ["50+ years of expertise", "25+ million sq.ft. delivered"],
    },
  ],
  highlights: [
    { title: "Global Expertise", subtitle: "International design standards" },
    { title: "Proven Track Record", subtitle: "100+ million sq.ft. delivered" },
    { title: "Award Winning", subtitle: "Multiple industry accolades" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TRANSFORMER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transforms a backend Property (with PropertySections) into a frontend Project.
 * Every detail field is sourced from a dedicated PropertySection record.
 * Defaults are only applied when the section is genuinely absent from the DB.
 */
export function transformBackendPropertyToProject(property: Property): Project {
  const details = buildDetailsFromSections(property.PropertySections || []);

  return {
    ...property,
    price: formatPrice(property.priceMin ?? 0, property.priceMax ?? 0),
    location: property.Location?.name || "India",
    image: (details?.heroImage) || "/images/project-1.jpg",
    type: formatPropertyType(property.propertyType ?? 'residential'),
    category: "Exclusive",
    details,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildDetailsFromSections(sections: Property["PropertySections"] = []): Project["details"] {
  // Index sections by type — multi-type entries keep LAST (highest order)
  const sm = new Map<string, any>();
  [...sections]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(s => sm.set(s.type, s.data));

  /** Always returns a plain object, never null/undefined */
  const safe = (key: string): Record<string, any> => {
    const val = sm.get(key);
    return val && typeof val === 'object' && !Array.isArray(val) ? val : {};
  };

  const hero = safe("heroImage");
  const intro = safe("intro");
  const highlights = safe("highlights");
  const overview = safe("overview");
  const keyTakeaways = safe("keyTakeaways");
  const gallery = safe("gallery");
  const amenities = safe("amenities");
  const floorPlans = safe("floorPlans");
  const paymentPlans = safe("paymentPlans");
  const whyInvest = safe("whyInvest");
  const location = safe("location");
  const masterPlan = safe("masterPlan");
  const faqs = safe("faqs");
  const team = safe("team");
  const usp = safe("usp");
  const specs = safe("specifications");

  // Normalise whyInvest reasons: ensure every item has a valid `icon` key
  // (only the 4 keys in iconMap are valid; anything else → 'trending' as safe fallback)
  const VALID_WHY_ICONS = new Set(['location', 'award', 'trending', 'calendar']);
  const rawReasons: any[] = Array.isArray(whyInvest.reasons) ? whyInvest.reasons : [];
  const normalisedReasons = rawReasons.map((r: any) => ({
    title: typeof r.title === 'string' ? r.title : '',
    subtitle: typeof r.subtitle === 'string' ? r.subtitle : '',
    icon: VALID_WHY_ICONS.has(r.icon) ? r.icon : 'trending',
  }));

  return {
    heroImage: hero.image || "/images/project-1.jpg",
    subtitle: hero.subtitle || "Luxury Development",
    videoUrl: hero.videoUrl || "https://www.youtube.com/embed/ScMzIvxBSi4",

    introText: intro.text
      || "Discover premium living at its finest with world-class amenities, strategic location and architectural excellence.",

    highlights: {
      landArea: highlights.landArea || "N/A",
      possession: highlights.possession || "N/A",
      rera: highlights.rera || "N/A",
      configuration: highlights.configuration || "N/A",
      priceRange: highlights.priceRange || "N/A",
      totalUnits: highlights.totalUnits || "N/A",
    },

    overview: {
      heading: overview.heading || "Overview of the Project",
      content: overview.content?.length ? overview.content : DEFAULT_OVERVIEW_CONTENT,
      features: overview.features?.length
        ? overview.features
        : ["Premium Construction", "World-class Amenities", "Excellent Connectivity", "Luxury Lifestyle"],
    },

    keyTakeaways: keyTakeaways.takeaways?.length ? keyTakeaways.takeaways : [],

    gallery: gallery.images?.length
      ? gallery.images
      : ["/images/project-1.jpg", "/images/project-2.jpg", "/images/project-3.jpg", "/images/project-4.jpg"],

    amenities: amenities.items?.length
      ? amenities.items.map((a: any) => ({ name: a.name, icon: a.icon || "🏢", image: a.image || "/images/project-1.jpg" }))
      : DEFAULT_AMENITIES,

    floorPlans: floorPlans.plans?.length
      ? floorPlans.plans.map((p: any) => ({ type: p.type, superArea: p.superArea, price: p.price, image: p.image || "/images/3bhk-plan.png" }))
      : DEFAULT_FLOOR_PLANS,

    paymentPlans: paymentPlans.plans?.length ? paymentPlans.plans : DEFAULT_PAYMENT_PLANS,

    whyInvest: normalisedReasons.length ? normalisedReasons : DEFAULT_WHY_INVEST,
    investmentAnalysis: typeof whyInvest.analysis === 'string' && whyInvest.analysis
      ? whyInvest.analysis
      : buildDefaultInvestmentAnalysis(),

    location: location.address
      ? {
        address: location.address,
        mapImage: location.mapImage || "/images/grand-arch-location.jpg",
        nearby: location.nearby || [],
        connectivity: location.connectivity || [],
      }
      : DEFAULT_LOCATION,

    masterPlan: masterPlan.image || "/images/project-1.jpg",
    masterPlanDescription: masterPlan.description || [],

    faqs: faqs.faqs?.length ? faqs.faqs : DEFAULT_FAQS,

    team: team.members?.length
      ? { members: team.members, highlights: team.highlights || [] }
      : DEFAULT_TEAM,

    usp: usp.items?.length
      ? usp.items
      : ["Premium Location", "World-Class Amenities", "Expert Construction", "Investment Potential"],

    specifications: specs.specifications?.length ? specs.specifications : [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    residential: "Luxury Apartments",
    commercial: "Commercial Space",
    mixed: "Mixed-Use Development",
  };
  return map[type] || type;
}

function formatPrice(min: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 10_000_000) return `₹ ${(n / 10_000_000).toFixed(1)} Cr`;
    if (n >= 100_000) return `₹ ${(n / 100_000).toFixed(0)} Lac`;
    return `₹ ${n}`;
  };
  if (!min && !max) return "Price on Request";
  if (!max) return `${fmt(min)} Onwards`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function buildDefaultInvestmentAnalysis(): string {
  return `This premium development offers a compelling investment opportunity in one of the most sought-after locations. The strategic location ensures excellent connectivity to major business hubs, entertainment zones, and essential amenities.

The property benefits from being developed by a renowned builder with a proven track record in delivering quality projects on time. This reputation provides investors with the assurance of transparent dealings and reliable possession timelines.

From an appreciation perspective, the micro-market has demonstrated consistent growth. The area's infrastructure development, coupled with limited supply of premium properties, creates a favourable environment for long-term capital appreciation.

Rental yield potential is another attractive aspect of this investment. The location commands premium rents due to its proximity to corporate offices and lifestyle amenities. Luxury apartments in this area typically generate rental yields in the range of 3–4%, providing steady cash flow for investors.`;
}
