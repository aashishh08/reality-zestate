import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { fetchProperties, fetchPublicEnums } from '@/lib/api/properties-listing';
import { getCategories } from '@/lib';
import { getSiteUrl } from '@/lib/site-url';
import { getDefaultOgImageUrl } from '@/lib/seo';
import type { PropertyFilters, PropertyListResponse } from '@/types/property-listing';
import { ProjectsIndexJsonLd } from '@/components/projects/ProjectsIndexJsonLd';
import {
  listingSearchParamsFromRecord,
  parseListingSearchParams,
} from '@/lib/listing-search-params';
import {
  hasListingQueryVariant,
  ROBOTS_NOINDEX_FOLLOW,
} from '@/lib/seo/listing-metadata';

const EMPTY_LISTING: PropertyListResponse = {
  data: [],
  pagination: { limit: 12, offset: 0, total: 0 },
};

// searchParams makes this page dynamically rendered.
// export const revalidate conflicts with searchParams in Next.js 15+ (DYNAMIC_SERVER_USAGE).
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};
  const urlSp = listingSearchParamsFromRecord(resolvedSearchParams);
  const hasQueryVariant = hasListingQueryVariant(urlSp, { showCityCategory: true });

  const base = getSiteUrl();
  const canonicalUrl = `${base}/projects`;
  const fallbackImage = getDefaultOgImageUrl();
  const title = 'All Projects';
  const description =
    'Browse luxury real estate projects across India. Filter by city, category, and launch status.';
  return {
    title,
    description,
    keywords: [
      'luxury projects',
      'premium properties India',
      'Superluxere',
      'real estate listings',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Superluxere',
      locale: 'en_IN',
      images: [{ url: fallbackImage, width: 1200, height: 630, alt: 'Superluxere Projects' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fallbackImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasQueryVariant ? { robots: ROBOTS_NOINDEX_FOLLOW } : {}),
  };
}

async function fetchAllProjectsPage(filters: PropertyFilters) {
  'use server';
  try {
    return await fetchProperties({
      ...filters,
      isPublished: true,
      limit: filters.limit ?? 12,
      offset: filters.offset ?? 0,
    });
  } catch {
    throw new Error(
      'Property listings could not be loaded. Ensure the backend is running and database migrations have been applied (e.g. yarn db:migrate in the backend).',
    );
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};
  const urlSp = listingSearchParamsFromRecord(resolvedSearchParams);

  const [enums, categoriesRes] = await Promise.all([
    fetchPublicEnums().catch(() => ({
      cities: [] as { slug: string; label: string }[],
      localities: [],
      developers: [],
    })),
    getCategories({ limit: 500, offset: 0 }, 0).catch(() => ({
      data: [] as { id: string; slug: string; name: string }[],
    })),
  ]);

  const cityOptions = (enums.cities ?? []).map((c) => ({
    slug: c.slug,
    label: c.label,
  }));
  const categoryOptions = (categoriesRes.data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
  }));
  const categorySlugToId = Object.fromEntries(
    categoryOptions.map((c) => [c.slug, c.id]),
  );

  const initialUrlFilters = parseListingSearchParams(urlSp, {
    itemsPerPage: 12,
    showCityCategory: true,
    categorySlugToId,
  });

  const propertiesResult = await fetchProperties({
    ...initialUrlFilters,
    isPublished: true,
    limit: initialUrlFilters.limit ?? 12,
    offset: initialUrlFilters.offset ?? 0,
  }).catch(() => null);

  const initialData = propertiesResult ?? EMPTY_LISTING;
  const listingsUnavailable = propertiesResult === null;

  return (
    <>
      <ProjectsIndexJsonLd initialData={initialData} />
      <div className="relative min-h-screen selection:bg-gold selection:text-white pt-16 lg:pt-20">
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-background">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
        </div>

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All projects', href: '/projects' },
          ]}
        />

        <PropertyListingTemplate
          initialData={initialData}
          onFetchProperties={fetchAllProjectsPage}
          title="All projects"
          subtitle="Published luxury listings — refine by city and category."
          heroComponent={
            <div className="border-b border-border bg-linear-to-b from-[#F5F0E8]/90 to-background px-4 py-12 sm:px-6 md:px-12">
              <div className="mx-auto max-w-[1400px] text-center md:text-left">
                {listingsUnavailable && (
                  <div
                    className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950"
                    role="alert"
                  >
                    <p className="font-medium">Listings could not be loaded from the server.</p>
                    <p className="mt-1 text-amber-900/90">
                      This usually means the database is empty or migrations have not been run
                      (PostgreSQL error: missing tables). From the backend folder run migrations,
                      then restart the API.
                    </p>
                  </div>
                )}
                <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Directory
                </p>
                <h1 className="font-serif text-3xl text-charcoal md:text-4xl lg:text-5xl">
                  All projects
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Explore every published listing on Superluxere. Use city and category
                  filters below, or narrow by launch status.
                </p>
              </div>
            </div>
          }
          showCityCategoryFilters
          cityOptions={cityOptions}
          categoryOptions={categoryOptions}
          syncUrl
          initialUrlFilters={initialUrlFilters}
          itemsPerPage={12}
          noResultsMessage="No properties match your filters. Try clearing filters or choose another city."
        />

        <Footer />
      </div>
    </>
  );
}
