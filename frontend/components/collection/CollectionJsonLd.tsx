/**
 * Server-only JSON-LD for collection-style pages (location / developer / category).
 * Mirrors the ProjectsIndexJsonLd pattern: BreadcrumbList + CollectionPage + ItemList,
 * with an optional `about` entity (Place for locations, Organization/RealEstateAgent
 * for developers) attached to the CollectionPage node.
 */
import { getSiteUrl } from '@/lib/site-url';

export type CollectionBreadcrumbItem = { name: string; url: string };
export type CollectionListItem = { title: string; url: string };

type Props = {
  breadcrumbItems: CollectionBreadcrumbItem[];
  collection: { name: string; description: string; url: string };
  items: CollectionListItem[];
  itemListName: string;
  /** Pre-built JSON-LD entity (e.g. Place, Organization, RealEstateAgent) describing the collection subject. */
  about?: Record<string, unknown>;
};

export function CollectionJsonLd({
  breadcrumbItems,
  collection,
  items,
  itemListName,
  about,
}: Props) {
  const base = getSiteUrl();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collection.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Superluxere',
      url: base,
    },
    ...(about ? { about } : {}),
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: itemListName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: item.url,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </>
  );
}
