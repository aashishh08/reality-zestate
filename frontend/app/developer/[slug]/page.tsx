/**
 * Developer Properties Page
 * Displays all properties from a specific developer
 * Route: /developer/[slug]
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/site-url';
import { PropertyListingTemplate } from '@/components/PropertyListingTemplate';
import { DeveloperHero } from '@/components/developer/DeveloperHero';
import {
  fetchDeveloperSlugProperties,
  getAllDeveloperSlugs,
  getDeveloperBySlug,
} from '@/lib/api/properties-listing';
import { PropertyFilters } from '@/types/property-listing';
import { getDeveloperPageOverrides } from '@/data/page-copy-overrides';

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

  const base = getSiteUrl();
  const canonicalUrl = `${base}/developer/${developer.slug}`;
  const title = `${developer.name} Projects & Properties`;
  const description = `Explore all projects and properties by ${developer.name}. Discover residential and commercial developments with premium amenities.`;

  return {
    title,
    description,
    keywords: [developer.name, 'properties', 'projects', 'real estate', 'developer'],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${developer.name} Properties`,
      description: `Browse all properties developed by ${developer.name}`,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Superluxere',
      locale: 'en_IN',
      images: developer.logo ? [{ url: developer.logo }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${developer.name} Properties`,
      description: `Browse all properties developed by ${developer.name}`,
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

  // Fetch initial properties — filtered by developerSlug (URL slug IS the enum developerSlug)
  const initialData = await fetchDeveloperSlugProperties(slug, {
    limit: 12,
    offset: 0,
  });

  // Handler for fetching properties with filters
  const handleFetchProperties = async (filters: PropertyFilters) => {
    'use server';

    const result = await fetchDeveloperSlugProperties(slug, {
      ...filters,
      limit: filters.limit || 12,
      offset: filters.offset || 0,
    });

    return result;
  };

  const copy = getDeveloperPageOverrides(slug);

  return (
    <PropertyListingTemplate
      key={slug}
      initialData={initialData}
      onFetchProperties={handleFetchProperties}
      title={copy?.title ?? `${developer.name} Projects`}
      subtitle={copy?.subtitle ?? `Discover premium properties and projects by ${developer.name}`}
      heroComponent={
        <DeveloperHero
          developer={developer}
          tagline={copy?.heroTagline}
          heroImageSrc={copy?.heroImageUrl}
        />
      }
      contextFilters={{ developerSlug: slug }}
      itemsPerPage={12}
      noResultsMessage={copy?.noResultsMessage ?? `No properties found from ${developer.name}`}
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
