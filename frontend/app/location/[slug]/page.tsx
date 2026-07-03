/**
 * Location Properties Page — micro-market / corridor template
 * Route: /location/[slug]
 *
 * Editorial hero, project listings, corridor story, developers, NRI, FAQ.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/site-url';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  CorridorEditorialHero,
  CorridorCharacter,
  CorridorDevelopersPresence,
  CorridorFaq,
  CorridorNriStrip,
} from '@/components/location/micro-market';
import {
  fetchLocationPageProperties,
  getAllLocationSlugs,
  getLocationBySlug,
  type LocationListingContext,
} from '@/lib/api/properties-listing';
import { getLocations, getDevelopers, getCategories } from '@/lib';
import { buildMicroMarketPageModel } from '@/lib/location-micro-market';
import { PropertyFilters } from '@/types/property-listing';
import { LocationViewTracker } from '@/components/analytics/LocationViewTracker';
import { ProjectFaqJsonLd } from '@/components/project/ProjectFaqJsonLd';
import { CollectionJsonLd } from '@/components/collection/CollectionJsonLd';
import {
  listingSearchParamsFromRecord,
  parseListingSearchParams,
} from '@/lib/listing-search-params';
import {
  hasListingQueryVariant,
  ROBOTS_NOINDEX_FOLLOW,
  ROBOTS_NOINDEX_NOFOLLOW,
} from '@/lib/seo/listing-metadata';

export async function generateMetadata({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};
  const urlSp = listingSearchParamsFromRecord(resolvedSearchParams);
  const hasQueryVariant = hasListingQueryVariant(urlSp);

  const location = await getLocationBySlug(slug);

  if (!location) {
    return {
      title: 'Location Not Found',
      description: 'The location you are looking for does not exist.',
      robots: ROBOTS_NOINDEX_NOFOLLOW,
    };
  }

  const base = getSiteUrl();
  const canonicalUrl = `${base}/location/${location.slug}`;
  const title = `${location.name} — Luxury Projects`;
  const description = `Discover curated projects in ${location.name}. Explore developers and corridor fundamentals before you book a site visit.`;
  const ogDescription = `Browse premium inventory in ${location.name}.`;

  return {
    title,
    description,
    keywords: [location.name, 'luxury real estate', 'micro-market', 'India', 'Superluxere'],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: ogDescription,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Superluxere',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: ogDescription,
    },
    ...(hasQueryVariant ? { robots: ROBOTS_NOINDEX_FOLLOW } : {}),
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllLocationSlugs();
    return slugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

const LOCATION_PAGE_CACHE_TTL = 3600;

export const revalidate = 3600;

export default async function LocationPage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await paramsPromise;
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};
  const urlSp = listingSearchParamsFromRecord(resolvedSearchParams);
  const initialUrlFilters = parseListingSearchParams(urlSp, { itemsPerPage: 12 });

  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const listingContext: LocationListingContext = {
    slug: location.slug,
    type: location.type,
    parent: location.parent ? { slug: location.parent.slug } : undefined,
  };

  const serializedListingContext = {
    slug: location.slug,
    type: location.type,
    parentSlug: location.parent?.slug ?? null,
  } as const;

  const [
    locationsRes,
    developersRes,
    categoriesRes,
    initialData,
  ] = await Promise.all([
    getLocations({ limit: 20, offset: 0 }, LOCATION_PAGE_CACHE_TTL).catch(() => ({ data: [] })),
    getDevelopers({ limit: 12, offset: 0 }, LOCATION_PAGE_CACHE_TTL).catch(() => []),
    getCategories({ limit: 50, offset: 0 }, LOCATION_PAGE_CACHE_TTL).catch(() => ({ data: [] })),
    fetchLocationPageProperties(listingContext, {
      ...initialUrlFilters,
      limit: initialUrlFilters.limit ?? 12,
      offset: initialUrlFilters.offset ?? 0,
      isPublished: true,
    }),
  ]);

  const handleFetchProperties = async (filters: PropertyFilters) => {
    'use server';

    const loc: LocationListingContext = {
      slug: serializedListingContext.slug,
      type: serializedListingContext.type,
      parent: serializedListingContext.parentSlug
        ? { slug: serializedListingContext.parentSlug }
        : undefined,
    };

    return fetchLocationPageProperties(loc, {
      ...filters,
      limit: filters.limit || 12,
      offset: filters.offset || 0,
      isPublished: filters.isPublished ?? true,
    });
  };

  const mm = buildMicroMarketPageModel(location, initialData);

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    ...(location.parent
      ? [{ label: location.parent.name, href: `/location/${location.parent.slug}` } as const]
      : []),
    { label: location.name, href: `/location/${slug}` },
  ];

  const base = getSiteUrl();
  const pageUrl = `${base}/location/${slug}`;
  const placeEntity = {
    '@type': 'Place',
    name: location.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      ...(location.parent ? { addressRegion: location.parent.name } : {}),
      addressCountry: 'IN',
    },
    ...(location.parent
      ? {
          containedInPlace: {
            '@type': 'Place',
            name: location.parent.name,
          },
        }
      : {}),
  };

  return (
    <>
      <LocationViewTracker locationSlug={slug} locationType={location.type} />
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
          title={`Properties in ${location.name}`}
          subtitle={`Discover premium properties available in ${location.name}`}
          contextFilters={
            location.type === 'locality' || location.type === 'sector'
              ? location.parent?.slug
                ? {
                    citySlug: location.parent.slug,
                    localitySlug: location.slug,
                    isPublished: true,
                  }
                : { localitySlug: location.slug, isPublished: true }
              : { citySlug: location.slug, isPublished: true }
          }
          itemsPerPage={12}
          noResultsMessage={`No properties found in ${location.name}`}
          projectsSection={mm.projectsSection}
          syncUrl
          initialUrlFilters={initialUrlFilters}
        />

        <CorridorCharacter {...mm.character} />
        <CorridorDevelopersPresence
          locationTitle={location.name}
          sectionSubtitle={mm.developers.sectionSubtitle}
          items={mm.developers.items}
        />
        <CorridorNriStrip {...mm.nri} />
        <CorridorFaq locationName={location.name} items={mm.faqs} />
        </div>
      </div>
      <CollectionJsonLd
        breadcrumbItems={[
          { name: 'Home', url: base },
          { name: 'All projects', url: `${base}/projects` },
          { name: location.name, url: pageUrl },
        ]}
        collection={{
          name: `${location.name} — Luxury Projects`,
          description: `Curated premium properties and developer presence in ${location.name}.`,
          url: pageUrl,
        }}
        items={(initialData.data ?? []).map((p) => ({
          title: p.title,
          url: `${base}/projects/${p.slug}`,
        }))}
        itemListName={`Properties in ${location.name}`}
        about={placeEntity}
      />
      <ProjectFaqJsonLd faqs={mm.faqs} />
      <Footer />
    </>
  );
}

export const dynamicParams = true;
