/**
 * Server-only JSON-LD for property detail pages.
 * Emits BreadcrumbList + RealEstateListing (not Product — avoids Google Shopping
 * requirements for aggregateRating/review on non-retail property listings).
 */
import type { Project } from "@/types";
import type { KeyTakeawaysData } from "@/components/project/ProjectKeyTakeaways";
import { getSiteUrl } from "@/lib/site-url";
import { formatPriceRange } from "@/lib/property-transformer";

type Props = {
  project: Project;
  slug: string;
};

type PropertyValue = { "@type": "PropertyValue"; name: string; value: string };
type ProjectDetails = NonNullable<Project["details"]>;
type HighlightKey = keyof NonNullable<ProjectDetails["highlights"]>;

const KEY_TAKEAWAY_FIELDS: { key: keyof KeyTakeawaysData; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "type", label: "Type" },
  { key: "area", label: "Area" },
  { key: "configuration", label: "Configuration" },
  { key: "sizes", label: "Sizes" },
  { key: "towers", label: "Towers" },
  { key: "floors", label: "Floors" },
  { key: "totalUnits", label: "Total Units" },
  { key: "clubhouse", label: "Clubhouse" },
  { key: "priceRange", label: "Price Range" },
  { key: "reraNo", label: "RERA Number" },
  { key: "launchDate", label: "Launch Date" },
  { key: "possessionDate", label: "Possession Date" },
  { key: "phases", label: "Phases" },
  { key: "developer", label: "Developer" },
  { key: "address", label: "Address" },
];

const HIGHLIGHT_FIELDS: [HighlightKey, string][] = [
  ["rera", "RERA Number"],
  ["configuration", "Configuration"],
  ["possession", "Possession"],
  ["totalUnits", "Total Units"],
  ["landArea", "Land Area"],
  ["priceRange", "Price Range"],
];

/** Parse display prices like "₹3.5 Cr" or "₹ 45 Lac" into INR rupees. */
function parseIndianPriceLabel(label: string): number | null {
  const normalized = label.replace(/,/g, "").trim().toLowerCase();
  if (!normalized || /on request|tbd|na\b/i.test(normalized)) return null;

  const cr = normalized.match(/([\d.]+)\s*(?:cr|crore|crores)\b/);
  if (cr) return Math.round(parseFloat(cr[1]) * 10_000_000);

  const lac = normalized.match(/([\d.]+)\s*(?:lac|lakh|lacs|lakhs)\b/);
  if (lac) return Math.round(parseFloat(lac[1]) * 100_000);

  const plain = normalized.match(/₹?\s*([\d.]+)/);
  if (plain) {
    const n = parseFloat(plain[1]);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  }

  return null;
}

/** Extract lat/lng from common Google Maps URL patterns when CMS stores an embed link. */
function extractGeoCoordinates(
  ...sources: Array<string | undefined>
): { latitude: number; longitude: number } | null {
  for (const raw of sources) {
    const s = raw?.trim();
    if (!s) continue;

    const atMatch = s.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (atMatch) {
      return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) };
    }

    const llMatch = s.match(/[?&]ll=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/i);
    if (llMatch) {
      return { latitude: parseFloat(llMatch[1]), longitude: parseFloat(llMatch[2]) };
    }

    const qCoord = s.match(/[?&]q=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)(?:&|$)/i);
    if (qCoord) {
      return { latitude: parseFloat(qCoord[1]), longitude: parseFloat(qCoord[2]) };
    }
  }
  return null;
}

function buildKeyTakeawayProperties(
  keyTakeaways: ProjectDetails["keyTakeaways"],
): PropertyValue[] {
  if (!keyTakeaways || Array.isArray(keyTakeaways)) return [];

  return KEY_TAKEAWAY_FIELDS.flatMap(({ key, label }) => {
    const v = keyTakeaways[key];
    if (typeof v !== "string" || !v.trim()) return [];
    return [{ "@type": "PropertyValue" as const, name: label, value: v.trim() }];
  });
}

function buildHighlightProperties(
  highlights: ProjectDetails["highlights"],
  usedNames: Set<string>,
): PropertyValue[] {
  if (!highlights) return [];

  return HIGHLIGHT_FIELDS.flatMap(([key, name]) => {
    if (usedNames.has(name.toLowerCase())) return [];
    const v = highlights[key];
    if (typeof v !== "string" || !v.trim()) return [];
    return [{ "@type": "PropertyValue" as const, name, value: v.trim() }];
  });
}

function buildFloorPlanProperties(
  floorPlans: ProjectDetails["floorPlans"],
): PropertyValue[] {
  if (!floorPlans?.length) return [];

  return floorPlans.flatMap((plan) => {
    const type = plan.type?.trim();
    if (!type) return [];
    const parts = [plan.superArea?.trim(), plan.price?.trim()].filter(Boolean);
    return [
      {
        "@type": "PropertyValue" as const,
        name: `Floor plan — ${type}`,
        value: parts.length ? parts.join(" · ") : type,
      },
    ];
  });
}

function buildFloorPlanOffers(
  floorPlans: ProjectDetails["floorPlans"],
  pageUrl: string,
): Record<string, unknown>[] {
  if (!floorPlans?.length) return [];

  return floorPlans.flatMap((plan) => {
    const name = plan.type?.trim();
    if (!name) return [];

    const price = plan.price ? parseIndianPriceLabel(plan.price) : null;
    const description = [plan.superArea?.trim(), plan.price?.trim()].filter(Boolean).join(" — ");

    const offer: Record<string, unknown> = {
      "@type": "Offer",
      name,
      availability: "https://schema.org/InStock",
      url: pageUrl,
      ...(description ? { description } : {}),
      itemOffered: {
        "@type": "Accommodation",
        name,
        ...(plan.superArea?.trim()
          ? {
              floorSize: {
                "@type": "QuantitativeValue",
                value: plan.superArea.replace(/[^\d.]/g, "") || plan.superArea.trim(),
                unitText: "sq.ft",
              },
            }
          : {}),
      },
    };

    if (price != null) {
      offer.price = String(price);
      offer.priceCurrency = "INR";
    }

    return [offer];
  });
}

function buildOffersNode(
  project: Project,
  pageUrl: string,
  priceLabel: string,
): Record<string, unknown> | null {
  const listingOffer = buildOffer(project, pageUrl, priceLabel);
  const unitOffers = buildFloorPlanOffers(project.details?.floorPlans, pageUrl);

  if (unitOffers.length > 0) {
    const prices = unitOffers
      .map((o) => (typeof o.price === "string" ? Number(o.price) : NaN))
      .filter((n) => Number.isFinite(n) && n > 0);

    const aggregate: Record<string, unknown> = {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      offerCount: unitOffers.length,
      offers: unitOffers,
    };

    if (prices.length > 0) {
      aggregate.lowPrice = String(Math.min(...prices));
      aggregate.highPrice = String(Math.max(...prices));
    }

    return aggregate;
  }

  return listingOffer;
}

function buildContentLocation(project: Project): Record<string, unknown> | null {
  const kt = project.details?.keyTakeaways;
  const structuredKt = kt && !Array.isArray(kt) ? kt : null;
  const locSection = project.details?.location;

  const streetAddress =
    structuredKt?.address?.trim() || locSection?.address?.trim() || undefined;
  const locality = project.location?.trim();
  const sublocality = project.sublocality?.trim();

  if (!streetAddress && !locality && !sublocality) return null;

  const postalAddress: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressCountry: "IN",
  };
  if (streetAddress) postalAddress.streetAddress = streetAddress;
  if (sublocality) {
    postalAddress.addressLocality = sublocality;
    if (locality) postalAddress.addressRegion = locality;
  } else if (locality) {
    postalAddress.addressLocality = locality;
  }

  const geo = extractGeoCoordinates(streetAddress, locSection?.mapImage);

  const place: Record<string, unknown> = {
    "@type": "Place",
    name: locality || sublocality || streetAddress,
    address: postalAddress,
  };

  if (geo) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  return place;
}

function buildAdditionalProperties(project: Project): PropertyValue[] {
  const fromTakeaways = buildKeyTakeawayProperties(project.details?.keyTakeaways);
  const usedNames = new Set(fromTakeaways.map((p) => p.name.toLowerCase()));
  const fromHighlights = buildHighlightProperties(project.details?.highlights, usedNames);
  const fromFloorPlans = buildFloorPlanProperties(project.details?.floorPlans);

  return [...fromTakeaways, ...fromHighlights, ...fromFloorPlans];
}

function resolveListingPrice(project: Project): number | null {
  const min = project.priceMin;
  const max = project.priceMax;
  if (typeof min === "number" && min > 0) return min;
  if (typeof max === "number" && max > 0) return max;
  return null;
}

function buildOffer(
  project: Project,
  pageUrl: string,
  priceLabel: string,
): Record<string, unknown> | null {
  const price = resolveListingPrice(project);
  if (price == null) return null;

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: String(price),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: pageUrl,
    description: priceLabel,
  };

  const min = project.priceMin;
  const max = project.priceMax;
  if (
    typeof min === "number" &&
    min > 0 &&
    typeof max === "number" &&
    max > 0 &&
    min !== max
  ) {
    offer.priceSpecification = {
      "@type": "PriceSpecification",
      price: String(min),
      minPrice: String(min),
      maxPrice: String(max),
      priceCurrency: "INR",
    };
  }

  return offer;
}

function collectListingImages(project: Project): string[] {
  const urls = new Set<string>();
  const hero = project.details?.heroImage?.trim() || project.image?.trim();
  if (hero) urls.add(hero);
  for (const url of project.details?.gallery ?? []) {
    const trimmed = url?.trim();
    if (trimmed) urls.add(trimmed);
  }
  return [...urls];
}

function countOverviewWords(project: Project): number {
  const paragraphs = project.details?.overview?.content ?? [];
  const text = paragraphs
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

export function ProjectDetailJsonLd({ project, slug }: Props) {
  const base = getSiteUrl();
  const pageUrl = `${base}/projects/${slug}`;

  const description =
    project.metaDescription ||
    project.details?.overview?.content?.[0] ||
    project.description ||
    `Luxury ${project.type ?? "property"} in ${project.location ?? "India"}.`;

  const listingImages = collectListingImages(project);

  const priceLabel =
    project.priceMin || project.priceMax
      ? formatPriceRange(project.priceMin ?? 0, project.priceMax ?? 0)
      : "Price on Request";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: "All projects",
        item: `${base}/projects`,
      },
      { "@type": "ListItem", position: 3, name: project.title, item: pageUrl },
    ],
  };

  const additionalProps = buildAdditionalProperties(project);
  const offers = buildOffersNode(project, pageUrl, priceLabel);
  const contentLocation = buildContentLocation(project);
  const dateModified = project.updatedAt || project.createdAt;

  const listing: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": pageUrl,
    name: project.title,
    description,
    url: pageUrl,
    inLanguage: "en-IN",
    ...(listingImages.length > 0 ? { image: listingImages } : {}),
    ...(project.createdAt ? { datePosted: project.createdAt } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(offers ? { offers } : {}),
    provider: {
      "@type": "RealEstateAgent",
      name: "Superluxere",
      url: base,
    },
    ...(project.Developer?.name
      ? {
          seller: {
            "@type": "Organization",
            name: project.Developer.name,
          },
        }
      : {}),
    ...(contentLocation ? { contentLocation } : {}),
    ...(additionalProps.length > 0 ? { additionalProperty: additionalProps } : {}),
  };

  const overviewWordCount = countOverviewWords(project);
  const webPage =
    overviewWordCount > 300
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${pageUrl}#overview`,
          url: pageUrl,
          name: project.details?.overview?.heading || `${project.title} Overview`,
          description,
          inLanguage: "en-IN",
          isPartOf: { "@type": "WebSite", name: "Superluxere", url: base },
          ...(dateModified ? { dateModified } : {}),
          ...(project.createdAt ? { datePublished: project.createdAt } : {}),
          wordCount: overviewWordCount,
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listing) }}
      />
      {webPage ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
        />
      ) : null}
    </>
  );
}
