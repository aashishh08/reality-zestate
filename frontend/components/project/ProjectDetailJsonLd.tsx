/**
 * Server-only JSON-LD for property detail pages.
 * Emits BreadcrumbList + RealEstateListing (not Product — avoids Google Shopping
 * requirements for aggregateRating/review on non-retail property listings).
 */
import type { Project } from "@/types";
import { getSiteUrl } from "@/lib/site-url";
import { formatPriceRange } from "@/lib/property-transformer";

type Props = {
  project: Project;
  slug: string;
};

function buildAdditionalProperties(
  highlights: Project["details"]["highlights"],
): Array<{ "@type": string; name: string; value: string }> {
  if (!highlights) return [];
  const map: [keyof typeof highlights, string][] = [
    ["rera", "RERA Number"],
    ["configuration", "Configuration"],
    ["possession", "Possession"],
    ["totalUnits", "Total Units"],
    ["landArea", "Land Area"],
    ["priceRange", "Price Range"],
  ];
  return map
    .filter(([key]) => {
      const v = highlights[key];
      return typeof v === "string" && v.trim().length > 0;
    })
    .map(([key, name]) => ({
      "@type": "PropertyValue",
      name,
      value: (highlights[key] as string).trim(),
    }));
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

  const additionalProps = buildAdditionalProperties(project.details?.highlights);
  const offer = buildOffer(project, pageUrl, priceLabel);
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
    ...(offer ? { offers: offer } : {}),
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
    ...(project.location
      ? {
          contentLocation: {
            "@type": "Place",
            name: project.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: project.location,
              addressCountry: "IN",
            },
          },
        }
      : {}),
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
