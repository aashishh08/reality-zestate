import { Property, Project } from "@/types";
import type { PropertyItem } from "@/types/property-listing";
import { listingCardImageUrl } from "@/lib/listing-card-image";

// ─────────────────────────────────────────────────────────────────────────────
// Listing card — API list response has no PropertySections; avoid inventing copy
// ─────────────────────────────────────────────────────────────────────────────

function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    residential: "Luxury Apartments",
    commercial: "Commercial Space",
    mixed: "Mixed-Use Development",
  };
  return map[type] || type;
}

export function formatPriceRange(min: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 10_000_000) return `₹ ${(n / 10_000_000).toFixed(1)} Cr`;
    if (n >= 100_000) return `₹ ${(n / 100_000).toFixed(0)} Lac`;
    return `₹ ${n}`;
  };
  if (!min && !max) return "Price on Request";
  if (!max) return `${fmt(min)} Onwards`;
  return `${fmt(min)} – ${fmt(max)}`;
}

/** Minimal `Project` for cards when only list-API fields are available (no sections). */
export function transformListingPropertyToProject(property: PropertyItem | Property): Project {
  return {
    ...(property as Property),
    price: formatPriceRange(property.priceMin ?? 0, property.priceMax ?? 0),
    location: property.Location?.name || "India",
    image: listingCardImageUrl(property as PropertyItem),
    type: formatPropertyType(property.propertyType ?? "residential"),
    category: "Exclusive",
    details: undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Details: one section row per type (last wins). Hidden sections ignored.
// No placeholder amenities / floor plans / team — only DB-backed content.
// ─────────────────────────────────────────────────────────────────────────────

const VALID_WHY_ICONS = new Set(["location", "award", "trending", "calendar"]);

function safeData(sectionMap: Map<string, any>, key: string): Record<string, any> {
  const val = sectionMap.get(key);
  return val && typeof val === "object" && !Array.isArray(val) ? val : {};
}

function hasHighlightValues(h: Record<string, any>): boolean {
  const keys = ["landArea", "possession", "rera", "configuration", "priceRange", "totalUnits"] as const;
  return keys.some((k) => typeof h[k] === "string" && h[k].trim().length > 0);
}

/**
 * Transforms a backend Property (with PropertySections) into a frontend Project.
 */
export function transformBackendPropertyToProject(property: Property): Project {
  const details = buildDetailsFromSections(property.PropertySections || []);

  const thumbOrLogo = listingCardImageUrl(property as PropertyItem);
  return {
    ...property,
    price: formatPriceRange(property.priceMin ?? 0, property.priceMax ?? 0),
    location: property.Location?.name || "India",
    image: details?.heroImage?.trim() || thumbOrLogo || "",
    type: formatPropertyType(property.propertyType ?? "residential"),
    category: "Exclusive",
    details,
  };
}

function buildDetailsFromSections(sections: Property["PropertySections"] = []): Project["details"] {
  const visible = [...sections]
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sm = new Map<string, any>();
  visible.forEach((s) => sm.set(s.type, s.data));

  const hero = safeData(sm, "heroImage");
  const intro = safeData(sm, "intro");
  const highlightsRaw = safeData(sm, "highlights");
  const overview = safeData(sm, "overview");
  const gallery = safeData(sm, "gallery");
  const amenities = safeData(sm, "amenities");
  const floorPlans = safeData(sm, "floorPlans");
  const paymentPlans = safeData(sm, "paymentPlans");
  const whyInvest = sm.has("whyInvest") ? safeData(sm, "whyInvest") : null;
  const location = safeData(sm, "location");
  const masterPlan = safeData(sm, "masterPlan");
  const faqs = safeData(sm, "faqs");
  const team = sm.has("team") ? safeData(sm, "team") : null;

  const sh = (type: string) => {
    const v = safeData(sm, type).sectionHeading;
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };

  const rawReasons: any[] =
    whyInvest && Array.isArray(whyInvest.reasons) ? whyInvest.reasons : [];
  const normalisedReasons = rawReasons.map((r: any) => ({
    title: typeof r.title === "string" ? r.title : "",
    subtitle: typeof r.subtitle === "string" ? r.subtitle : "",
    icon: VALID_WHY_ICONS.has(r?.icon) ? r.icon : "trending",
  }));

  const investmentAnalysisRaw =
    whyInvest && typeof whyInvest.analysis === "string" ? whyInvest.analysis.trim() : "";
  const investmentAnalysis = investmentAnalysisRaw || undefined;

  let whyInvestStats:
    | {
        annualAppreciation?: string;
        rentalYield?: string;
        preLaunchGain?: string;
      }
    | undefined;
  if (whyInvest && whyInvest.stats && typeof whyInvest.stats === "object") {
    const st = whyInvest.stats;
    const out: NonNullable<Project["details"]>["whyInvestStats"] = {};
    if (typeof st.annualAppreciation === "string" && st.annualAppreciation.trim())
      out.annualAppreciation = st.annualAppreciation.trim();
    if (typeof st.rentalYield === "string" && st.rentalYield.trim())
      out.rentalYield = st.rentalYield.trim();
    if (typeof st.preLaunchGain === "string" && st.preLaunchGain.trim())
      out.preLaunchGain = st.preLaunchGain.trim();
    whyInvestStats = Object.keys(out).length ? out : undefined;
  } else {
    whyInvestStats = undefined;
  }

  const whyInvestList =
    whyInvest && normalisedReasons.length > 0 ? normalisedReasons : undefined;

  let amenitiesStats: NonNullable<Project["details"]>["amenitiesStats"];
  if (amenities.stats && typeof amenities.stats === "object") {
    const st = amenities.stats;
    const out: NonNullable<Project["details"]>["amenitiesStats"] = {};
    if (typeof st.clubhouseSqFt === "string" && st.clubhouseSqFt.trim())
      out.clubhouseSqFt = st.clubhouseSqFt.trim();
    if (typeof st.amenitiesCount === "string" && st.amenitiesCount.trim())
      out.amenitiesCount = st.amenitiesCount.trim();
    if (typeof st.swimmingPools === "string" && st.swimmingPools.trim())
      out.swimmingPools = st.swimmingPools.trim();
    if (typeof st.diningOptions === "string" && st.diningOptions.trim())
      out.diningOptions = st.diningOptions.trim();
    amenitiesStats = Object.keys(out).length ? out : undefined;
  } else {
    amenitiesStats = undefined;
  }

  const floorPlanDescriptionSections: { heading: string; body: string }[] | undefined =
    sm.has("floorPlans") &&
    Array.isArray(floorPlans.descriptionSections) &&
    floorPlans.descriptionSections.length > 0
      ? floorPlans.descriptionSections.filter(
          (s: any) =>
            s &&
            (String(s.heading || "").trim() || String(s.body || "").trim()),
        )
      : sm.has("floorPlans")
        ? []
        : undefined;

  const kt = safeData(sm, "keyTakeaways");
  const hasStructuredData = Boolean(
    kt.status ||
      kt.type ||
      kt.area ||
      kt.configuration ||
      kt.sizes ||
      kt.towers ||
      kt.floors ||
      kt.totalUnits ||
      kt.clubhouse ||
      kt.priceRange ||
      kt.reraNo ||
      kt.launchDate ||
      kt.possessionDate ||
      kt.phases ||
      kt.developer ||
      kt.address,
  );

  const keyTakeaways = hasStructuredData
    ? {
        status: typeof kt.status === "string" ? kt.status : undefined,
        type: typeof kt.type === "string" ? kt.type : undefined,
        area: typeof kt.area === "string" ? kt.area : undefined,
        configuration: typeof kt.configuration === "string" ? kt.configuration : undefined,
        sizes: typeof kt.sizes === "string" ? kt.sizes : undefined,
        towers: typeof kt.towers === "string" ? kt.towers : undefined,
        floors: typeof kt.floors === "string" ? kt.floors : undefined,
        totalUnits: typeof kt.totalUnits === "string" ? kt.totalUnits : undefined,
        clubhouse: typeof kt.clubhouse === "string" ? kt.clubhouse : undefined,
        priceRange: typeof kt.priceRange === "string" ? kt.priceRange : undefined,
        reraNo: typeof kt.reraNo === "string" ? kt.reraNo : undefined,
        launchDate: typeof kt.launchDate === "string" ? kt.launchDate : undefined,
        possessionDate: typeof kt.possessionDate === "string" ? kt.possessionDate : undefined,
        phases: typeof kt.phases === "string" ? kt.phases : undefined,
        developer: typeof kt.developer === "string" ? kt.developer : undefined,
        address: typeof kt.address === "string" ? kt.address : undefined,
      }
    : undefined;

  const addr = typeof location.address === "string" ? location.address.trim() : "";
  const mapImg = typeof location.mapImage === "string" ? location.mapImage.trim() : "";
  const nearbyArr = Array.isArray(location.nearby) ? location.nearby : [];
  const connArr = Array.isArray(location.connectivity) ? location.connectivity : [];
  const hasLocationSection = sm.has("location");
  const locationBlock =
    hasLocationSection && (addr || mapImg || nearbyArr.length > 0 || connArr.length > 0)
      ? {
          address: addr || undefined,
          mapImage: mapImg || undefined,
          nearby: nearbyArr,
          connectivity: connArr,
        }
      : undefined;

  const masterImage =
    typeof masterPlan.image === "string" && masterPlan.image.trim()
      ? masterPlan.image.trim()
      : undefined;
  const masterDesc = (() => {
    const d = masterPlan.description;
    if (typeof d === "string" && d.trim()) return d.trim();
    if (Array.isArray(d) && d.length) return d.join("\n\n");
    return undefined;
  })();

  const overviewBlock =
    sm.has("overview") && Array.isArray(overview.content) && overview.content.length > 0
      ? {
          heading:
            typeof overview.heading === "string" && overview.heading.trim()
              ? overview.heading.trim()
              : "Overview of the Project",
          content: overview.content.filter((x: any) => typeof x === "string" && x.trim()),
          features: Array.isArray(overview.features)
            ? overview.features.filter((x: any) => typeof x === "string" && x.trim())
            : undefined,
        }
      : undefined;

  if (overviewBlock && (!overviewBlock.features || overviewBlock.features.length === 0)) {
    delete overviewBlock.features;
  }

  const heroImg =
    typeof hero.image === "string" && hero.image.trim() ? hero.image.trim() : undefined;
  const heroSubtitle =
    typeof hero.subtitle === "string" && hero.subtitle.trim() ? hero.subtitle.trim() : undefined;

  return {
    ...(heroImg ? { heroImage: heroImg } : {}),
    ...(heroSubtitle ? { subtitle: heroSubtitle } : {}),
    videoUrl:
      typeof hero.videoUrl === "string" && hero.videoUrl.trim()
        ? hero.videoUrl.trim()
        : undefined,

    introText:
      typeof intro.text === "string" && intro.text.trim() ? intro.text.trim() : undefined,

    highlights:
      sm.has("highlights") && hasHighlightValues(highlightsRaw)
        ? {
            landArea: highlightsRaw.landArea?.trim() || undefined,
            possession: highlightsRaw.possession?.trim() || undefined,
            rera: highlightsRaw.rera?.trim() || undefined,
            configuration: highlightsRaw.configuration?.trim() || undefined,
            priceRange: highlightsRaw.priceRange?.trim() || undefined,
            totalUnits: highlightsRaw.totalUnits?.trim() || undefined,
          }
        : undefined,

    overview: overviewBlock,

    keyTakeaways,

    gallery: gallery.images?.length ? gallery.images : undefined,

    amenities:
      amenities.items?.length > 0
        ? amenities.items.map((a: any) => ({
            name: a.name,
            icon: a.icon || "🏢",
            image: a.image && String(a.image).trim() ? a.image : undefined,
          }))
        : undefined,

    floorPlans:
      floorPlans.plans?.length > 0
        ? floorPlans.plans.map((p: any) => ({
            type: p.type,
            superArea: p.superArea,
            price: p.price,
            ...(p.image && String(p.image).trim() ? { image: String(p.image).trim() } : {}),
          }))
        : undefined,

    paymentPlans:
      paymentPlans.plans?.length > 0 ? paymentPlans.plans : undefined,

    whyInvest: whyInvestList,
    investmentAnalysis,
    whyInvestStats,

    location: locationBlock,

    masterPlan: masterImage,
    masterPlanDescription: masterDesc,

    faqs: faqs.faqs?.length ? faqs.faqs : undefined,

    team:
      team && team.members?.length > 0
        ? { members: team.members, highlights: team.highlights || [] }
        : undefined,

    amenitiesStats,

    floorPlanDescriptionSections,

    sectionHeadings: {
      keyTakeaways: sh("keyTakeaways"),
      whyInvest: sh("whyInvest"),
      gallery: sh("gallery"),
      amenities: sh("amenities"),
      floorPlans: sh("floorPlans"),
      paymentPlans: sh("paymentPlans"),
      location: sh("location"),
      masterPlan: sh("masterPlan"),
      faqs: sh("faqs"),
      team: sh("team"),
    },
  };
}
