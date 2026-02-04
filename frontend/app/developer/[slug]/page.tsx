/**
 * Developer Properties Page
 * Displays all properties from a specific developer
 * Route: /developer/[slug]
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { DeveloperHero } from '@/components/developer/DeveloperHero';
import {
  fetchDeveloperProperties,
  getAllDeveloperSlugs,
  getDeveloperBySlug,
} from '@/lib/api/properties-listing';
import { PropertyFilters } from '@/types/property-listing';

interface DeveloperPageProps {
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
  const developer = await getDeveloperBySlug(slug);

  if (!developer) {
    return {
      title: 'Developer Not Found',
      description: 'The developer you are looking for does not exist.',
    };
  }

  return {
    title: `${developer.name} Projects & Properties | Reality Estate`,
    description: `Explore all projects and properties by ${developer.name}. Discover residential and commercial developments with premium amenities.`,
    keywords: [developer.name, 'properties', 'projects', 'real estate', 'developer'],
    openGraph: {
      title: `${developer.name} Properties`,
      description: `Browse all properties developed by ${developer.name}`,
      type: 'website',
      url: `/developer/${developer.slug}`,
      images: developer.logo ? [{ url: developer.logo }] : undefined,
    },
  };
}

/**
 * Generate static params for all developers
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllDeveloperSlugs();
    return slugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Developer Page Component
 */
export default async function DeveloperPage({ 
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  
  // Fetch developer details
  const developer = await getDeveloperBySlug(slug);

  if (!developer) {
    notFound();
  }

  // Fetch initial properties
  const initialData = await fetchDeveloperProperties(developer.id, {
    limit: 12,
    offset: 0,
  });

  // Handler for fetching properties with filters
  // This will be used by the template for filter/sort/pagination
  const handleFetchProperties = async (filters: PropertyFilters) => {
    'use server';

    const result = await fetchDeveloperProperties(developer.id, {
      ...filters,
      limit: filters.limit || 12,
      offset: filters.offset || 0,
    });

    return result;
  };

  // Sort options specific to developer pages
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
      title={`${developer.name} Projects`}
      subtitle={`Discover premium properties and projects by ${developer.name}`}
      heroComponent={<DeveloperHero developer={developer} />}
      sortOptions={sortOptions}
      showFilters={true}
      contextFilters={{ developerId: developer.id }}
      itemsPerPage={12}
      noResultsMessage={`No properties found from ${developer.name}`}
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
