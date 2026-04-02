import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/category-data";
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
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    keywords: [category.title, "luxury real estate", "premium properties", "Superluxere"],
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
    },
  };
}

export const revalidate = 7200;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const editorial = getCategoryBySlug(slug);

  if (!editorial) {
    notFound();
  }

  const [locationsRes, developersRes, categoriesRes, initialData] = await Promise.all([
    getLocations({ limit: 20, offset: 0 }, revalidate).catch(() => ({ data: [] })),
    getDevelopers({ limit: 12, offset: 0 }, revalidate).catch(() => []),
    getCategories({ limit: 200, offset: 0 }, revalidate).catch(() => ({ data: [] })),
    fetchCategoryPropertiesBySlug(slug, { limit: 12, offset: 0 }, revalidate),
  ]);

  const apiCategory =
    categoriesRes.data?.find((c) => c.slug === slug) ?? null;
  const displayName = apiCategory?.name ?? editorial.title;
  const categoryId = apiCategory?.id ?? null;

  const handleFetchProperties = async (filters: PropertyFilters) => {
    "use server";

    if (!categoryId) {
      return {
        data: [],
        pagination: {
          limit: filters.limit ?? 12,
          offset: filters.offset ?? 0,
          total: 0,
        },
      };
    }

    const result = await fetchCategoryProperties(categoryId, {
      ...filters,
      limit: filters.limit || 12,
      offset: filters.offset || 0,
      isPublished: true,
    });

    return result;
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

export const dynamicParams = false;
