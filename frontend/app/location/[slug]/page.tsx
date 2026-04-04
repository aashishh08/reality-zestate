/**
 * Location Properties Page — micro-market / corridor template
 * Route: /location/[slug]
 *
 * Editorial hero, project listings, corridor story, developers, NRI, FAQ.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LeadPopup } from '@/components/ui/LeadPopup';
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

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const location = await getLocationBySlug(slug);

  if (!location) {
    return {
      title: 'Location Not Found',
      description: 'The location you are looking for does not exist.',
    };
  }

  return {
    title: `${location.name} — Luxury Projects`,
    description: `Discover curated projects in ${location.name}. Explore developers and corridor fundamentals before you book a site visit.`,
    keywords: [location.name, 'luxury real estate', 'micro-market', 'India', 'Superluxere'],
    openGraph: {
      title: `${location.name} — Luxury Projects`,
      description: `Browse premium inventory in ${location.name}.`,
      type: 'website',
      url: `/location/${location.slug}`,
    },
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

/**
 * Micro-market pages must not ship a stale SSG shell with empty listings (same issue as
 * `/category/[slug]`): filter pills triggered a fresh fetch; full refresh showed 0 again.
 */
export const dynamic = 'force-dynamic';

export default async function LocationPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;

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
      limit: 12,
      offset: 0,
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
      <Footer />
      <LeadPopup />
    </>
  );
}

export const dynamicParams = true;
