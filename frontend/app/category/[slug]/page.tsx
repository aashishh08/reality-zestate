import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  buildFallbackCategoryEditorial,
  type CategoryData,
} from "@/lib/category-data";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PropertyListingTemplate } from "@/components/PropertyListingTemplate";
import {
  CorridorEditorialHero,
  CorridorCharacter,
  CorridorDevelopersPresence,
  CorridorFaq,
  CorridorNriStrip,
} from "@/components/location/micro-market";
import {
  fetchCategoryProperties,
  fetchCategoryPropertiesBySlug,
} from "@/lib/api/properties-listing";
import { getLocations, getDevelopers, getCategories } from "@/lib";
import { buildCategoryCollectionPageModel } from "@/lib/category-collection-page";
import type { PropertyFilters } from "@/types/property-listing";
import { CollectionJsonLd } from "@/components/collection/CollectionJsonLd";
import { ProjectFaqJsonLd } from "@/components/project/ProjectFaqJsonLd";
import {
  listingSearchParamsFromRecord,
  parseListingSearchParams,
} from "@/lib/listing-search-params";
import {
  hasListingQueryVariant,
  ROBOTS_NOINDEX_FOLLOW,
  ROBOTS_NOINDEX_NOFOLLOW,
} from "@/lib/seo/listing-metadata";

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};
  const urlSp = listingSearchParamsFromRecord(resolvedSearchParams);
  const hasQueryVariant = hasListingQueryVariant(urlSp);

  const base = getSiteUrl();
  const canonicalUrl = `${base}/category/${slug}`;

  const staticCat = getCategoryBySlug(slug);
  if (staticCat) {
    return {
      title: staticCat.metaTitle,
      description: staticCat.metaDescription,
      keywords: [staticCat.title, "luxury real estate", "premium properties", "Superluxere"],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: staticCat.metaTitle,
        description: staticCat.metaDescription,
        type: "website",
        url: canonicalUrl,
        siteName: "Superluxere",
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title: staticCat.metaTitle,
        description: staticCat.metaDescription,
      },
      ...(hasQueryVariant ? { robots: ROBOTS_NOINDEX_FOLLOW } : {}),
    };
  }

  try {
    const catsRes = await getCategories({ limit: 300, offset: 0 }, 60);
    const api = catsRes.data?.find((c) => c.slug === slug);
    if (api) {
      const fb = buildFallbackCategoryEditorial(slug, api.name);
      return {
        title: fb.metaTitle,
        description: fb.metaDescription,
        keywords: [api.name, "luxury real estate", "Superluxere"],
        alternates: { canonical: canonicalUrl },
        openGraph: {
          title: fb.metaTitle,
          description: fb.metaDescription,
          type: "website",
          url: canonicalUrl,
          siteName: "Superluxere",
          locale: "en_IN",
        },
        twitter: {
          card: "summary_large_image",
          title: fb.metaTitle,
          description: fb.metaDescription,
        },
        ...(hasQueryVariant ? { robots: ROBOTS_NOINDEX_FOLLOW } : {}),
      };
    }
  } catch {
    /* ignore */
  }

  return { title: "Category Not Found", robots: ROBOTS_NOINDEX_NOFOLLOW };
}

export const revalidate = 3600;

const CATEGORY_PAGE_CACHE_TTL = 3600;

async function resolveEditorial(slug: string): Promise<CategoryData | null> {
  const staticCat = getCategoryBySlug(slug);
  if (staticCat) return staticCat;

  const catsRes = await getCategories({ limit: 300, offset: 0 }, CATEGORY_PAGE_CACHE_TTL).catch(() => ({
    data: [] as { slug: string; name: string }[],
  }));
  const api = catsRes.data?.find((c) => c.slug === slug);
  if (api) return buildFallbackCategoryEditorial(slug, api.name);
  return null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};
  const urlSp = listingSearchParamsFromRecord(resolvedSearchParams);
  const initialUrlFilters = parseListingSearchParams(urlSp, { itemsPerPage: 12 });

  const editorial = await resolveEditorial(slug);
  if (!editorial) {
    notFound();
  }

  const [locationsRes, developersRes, categoriesRes, initialData] = await Promise.all([
    getLocations({ limit: 20, offset: 0 }, CATEGORY_PAGE_CACHE_TTL).catch(() => ({ data: [] })),
    getDevelopers({ limit: 12, offset: 0 }, CATEGORY_PAGE_CACHE_TTL).catch(() => []),
    getCategories({ limit: 300, offset: 0 }, CATEGORY_PAGE_CACHE_TTL).catch(() => ({ data: [] })),
    fetchCategoryPropertiesBySlug(slug, {
      ...initialUrlFilters,
      limit: initialUrlFilters.limit ?? 12,
      offset: initialUrlFilters.offset ?? 0,
    }),
  ]);

  const apiCategory =
    categoriesRes.data?.find((c) => c.slug === slug) ?? null;
  const displayName = apiCategory?.name ?? editorial.title;

  const handleFetchProperties = async (filters: PropertyFilters) => {
    "use server";

    const catsRes = await getCategories({ limit: 500, offset: 0 }, 0);
    const cat = catsRes.data?.find((c) => c.slug === slug);
    if (!cat?.id) {
      return {
        data: [],
        pagination: {
          limit: filters.limit ?? 12,
          offset: filters.offset ?? 0,
          total: 0,
        },
      };
    }

    return fetchCategoryProperties(cat.id, {
      ...filters,
      limit: filters.limit || 12,
      offset: filters.offset || 0,
      isPublished: filters.isPublished ?? true,
    }, slug);
  };

  const mm = buildCategoryCollectionPageModel(displayName, editorial, initialData);

  const breadcrumbItems = [
    { label: "Projects", href: "/projects" },
    { label: displayName, href: `/category/${slug}` },
  ];

  const base = getSiteUrl();
  const pageUrl = `${base}/category/${slug}`;
  const categoryAbout = {
    "@type": "Thing",
    name: displayName,
    description:
      editorial.introText ||
      `Curated ${displayName} luxury real estate listings across India.`,
  };

  return (
    <>
      <CollectionJsonLd
        breadcrumbItems={[
          { name: "Home", url: base },
          { name: "All projects", url: `${base}/projects` },
          { name: displayName, url: pageUrl },
        ]}
        collection={{
          name: `${displayName} — curated collection — Superluxere`,
          description:
            editorial.introText ||
            `Discover premium properties in the ${displayName} collection.`,
          url: pageUrl,
        }}
        items={(initialData.data ?? []).map((p) => ({
          title: p.title,
          url: `${base}/projects/${p.slug}`,
        }))}
        itemListName={`${displayName} properties`}
        about={categoryAbout}
      />
      <div className="relative min-h-screen selection:bg-gold selection:text-white pt-16 lg:pt-20">
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-background">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
        </div>
        <div className="relative">
          <Breadcrumbs items={breadcrumbItems} />

          <CorridorEditorialHero {...mm.hero} />

          <PropertyListingTemplate
            key={slug}
            initialData={initialData}
            onFetchProperties={handleFetchProperties}
            title={`${displayName} — curated collection`}
            subtitle={
              editorial.introText ||
              `Discover premium properties in the ${displayName} collection.`
            }
            itemsPerPage={12}
            noResultsMessage={`No properties found in ${displayName}`}
            projectsSection={mm.projectsSection}
            syncUrl
            initialUrlFilters={initialUrlFilters}
          />

          <CorridorCharacter {...mm.character} />
          <CorridorDevelopersPresence
            locationTitle={displayName}
            sectionSubtitle={mm.developers.sectionSubtitle}
            items={mm.developers.items}
          />
          <CorridorNriStrip {...mm.nri} />
          <CorridorFaq locationName={displayName} items={mm.faqs} />
        </div>
      </div>
      <ProjectFaqJsonLd faqs={mm.faqs} />
      <Footer />
    </>
  );
}

/** Allow `/category/[slug]` for any category row in the API, not only static marketing slugs. */
export const dynamicParams = true;
