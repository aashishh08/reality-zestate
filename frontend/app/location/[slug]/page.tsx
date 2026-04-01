/**
 * Location Properties Page
 * Displays all properties in a specific location
 * Route: /location/[slug]
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { LocationHero } from '@/components/location/LocationHero';
import {
  fetchLocationDetail,
  fetchCityProperties,
  getAllLocationSlugs,
  getLocationBySlug,
} from '@/lib/api/properties-listing';
import { PropertyFilters } from '@/types/property-listing';

interface LocationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for the page
 */
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
    title: `Properties in ${location.name} | Reality Estate`,
    description: `Discover premium properties in ${location.name}. Find residential and commercial properties with detailed information, prices, and amenities.`,
    keywords: [location.name, 'properties', 'real estate', 'residential', 'commercial'],
    openGraph: {
      title: `Properties in ${location.name}`,
      description: `Browse properties available in ${location.name}`,
      type: 'website',
      url: `/location/${location.slug}`,
    },
  };
}

/**
 * Generate static params for all locations
 */
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

/**
 * Location Page Component
 */
export default async function LocationPage({ 
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  
  // Fetch location details
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  // Fetch initial properties — filtered by citySlug (the URL slug IS the enum citySlug)
  const initialData = await fetchCityProperties(slug, {
    limit: 12,
    offset: 0,
  });

  // Handler for fetching properties with filters
  const handleFetchProperties = async (filters: PropertyFilters) => {
    'use server';

    const result = await fetchCityProperties(slug, {
      ...filters,
      limit: filters.limit || 12,
      offset: filters.offset || 0,
    });

    return result;
  };

  // Sort options specific to location pages
  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'price-asc' as const, label: 'Price: Low to High' },
    { value: 'price-desc' as const, label: 'Price: High to Low' },
    { value: 'name-asc' as const, label: 'Name: A to Z' },
  ];

  return (
    <PropertyListingTemplate
      initialData={initialData}
      onFetchProperties={handleFetchProperties}
      title={`Properties in ${location.name}`}
      subtitle={`Discover premium properties available in ${location.name}`}
      heroComponent={<LocationHero location={location} />}
      sortOptions={sortOptions}
      showFilters={true}
      contextFilters={{ citySlug: slug }}
      itemsPerPage={12}
      noResultsMessage={`No properties found in ${location.name}`}
    />
  );
}

/**
 * ISR Configuration
 * Revalidate every 1 hour (3600 seconds)
 */
export const revalidate = 3600;

/**
 * Dynamic segment configuration
 * Ensures page is generated on-demand if not pre-generated
 */
export const dynamicParams = true;
