import type { PropertyListResponse } from '@/types/property-listing';
import { getSiteUrl } from '@/lib/site-url';

type Props = {
  initialData: PropertyListResponse;
};

/**
 * BreadcrumbList + WebSite collection context + ItemList for the first SSR page of results.
 */
export function ProjectsIndexJsonLd({ initialData }: Props) {
  const base = getSiteUrl();
  const rows = initialData.data ?? [];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: base,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All projects',
        item: `${base}/projects`,
      },
    ],
  };

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Luxury real estate projects — Superluxere',
    description:
      'Browse published premium property listings across India. Filter by city, category, and status.',
    url: `${base}/projects`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Superluxere',
      url: base,
    },
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured project listings',
    numberOfItems: rows.length,
    itemListElement: rows.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: p.title,
      url: `${base}/projects/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
