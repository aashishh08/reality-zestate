import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  buildFallbackCategoryEditorial,
  type CategoryData,
} from "@/lib/category-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LeadPopup } from "@/components/ui/LeadPopup";
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

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const staticCat = getCategoryBySlug(slug);
  if (staticCat) {
    return {
      title: staticCat.metaTitle,
      description: staticCat.metaDescription,
      keywords: [staticCat.title, "luxury real estate", "premium properties", "Superluxere"],
      openGraph: {
        title: staticCat.metaTitle,
        description: staticCat.metaDescription,
      },
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
      };
    }
  } catch {
    /* ignore */
  }

  return { title: "Category Not Found" };
}

/** Passed to data helpers when NEXT_FETCH_NO_CACHE=0 (caching enabled) */
const DATA_REVALIDATE_SECONDS = 3600;

async function resolveEditorial(slug: string): Promise<CategoryData | null> {
  const staticCat = getCategoryBySlug(slug);
  if (staticCat) return staticCat;

  const catsRes = await getCategories({ limit: 300, offset: 0 }, DATA_REVALIDATE_SECONDS).catch(() => ({
    data: [] as { slug: string; name: string }[],
  }));
  const api = catsRes.data?.find((c) => c.slug === slug);
  if (api) return buildFallbackCategoryEditorial(slug, api.name);
  return null;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const editorial = await resolveEditorial(slug);
  if (!editorial) {
    notFound();
  }

  const [locationsRes, developersRes, categoriesRes, initialData] = await Promise.all([
    getLocations({ limit: 20, offset: 0 }, DATA_REVALIDATE_SECONDS).catch(() => ({ data: [] })),
    getDevelopers({ limit: 12, offset: 0 }, DATA_REVALIDATE_SECONDS).catch(() => []),
    getCategories({ limit: 200, offset: 0 }, DATA_REVALIDATE_SECONDS).catch(() => ({ data: [] })),
    fetchCategoryPropertiesBySlug(slug, { limit: 12, offset: 0 }, DATA_REVALIDATE_SECONDS),
  ]);

  const apiCategory =
    categoriesRes.data?.find((c) => c.slug === slug) ?? null;
  const displayName = apiCategory?.name ?? editorial.title;

  const handleFetchProperties = async (filters: PropertyFilters) => {
    "use server";

    const catsRes = await getCategories({ limit: 300, offset: 0 }, false);
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
    });
  };

  const mm = buildCategoryCollectionPageModel(displayName, editorial, initialData);

  const breadcrumbItems = [
    { label: "Projects", href: "/projects" },
    { label: displayName, href: `/category/${slug}` },
  ];

  return (
    <>
      <Header
        locations={locationsRes.data || []}
        developers={Array.isArray(developersRes) ? developersRes : []}
        categories={categoriesRes.data || []}
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
      <Footer />
      <LeadPopup />
    </>
  );
}

/** Allow `/category/[slug]` for any category row in the API, not only static marketing slugs. */
export const dynamicParams = true;
