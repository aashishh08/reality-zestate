/**
 * Server-only JSON-LD for property detail pages.
 * Emits two blocks: BreadcrumbList and Product (real-estate listing).
 * No "use client" — rendered on the server with project data already in scope.
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

export function ProjectDetailJsonLd({ project, slug }: Props) {
  const base = getSiteUrl();
  const pageUrl = `${base}/projects/${slug}`;

  const description =
    project.metaDescription ||
    project.details?.overview?.content?.[0] ||
    project.description ||
    `Luxury ${project.type ?? "property"} in ${project.location ?? "India"}.`;

  const heroImage =
    project.details?.heroImage?.trim() || project.image?.trim() || undefined;

  const priceLabel =
    project.priceMin || project.priceMax
      ? formatPriceRange(project.priceMin ?? 0, project.priceMax ?? 0)
      : "Price on Request";

  // ── BreadcrumbList ────────────────────────────────────────────────────────
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

  // ── Product (real-estate listing) ─────────────────────────────────────────
  const additionalProps = buildAdditionalProperties(
    project.details?.highlights,
  );

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.title,
    description,
    url: pageUrl,
    ...(heroImage ? { image: heroImage } : {}),
    brand: project.Developer?.name
      ? { "@type": "Organization", name: project.Developer.name }
      : { "@type": "Organization", name: "Superluxere" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      description: priceLabel,
    },
    ...(project.location
      ? {
          locationCreated: {
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
    ...(additionalProps.length > 0
      ? { additionalProperty: additionalProps }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
    </>
  );
}
