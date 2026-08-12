import type { Metadata } from 'next';
import { getDefaultOgImageUrl } from '@/lib/seo';
import { getLocationHeroImageUrl } from '@/lib/seo/location-hero-images';

export interface CollectionSeoSource {
  name: string;
  slug: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  heroImageUrl?: string | null;
  logo?: string | null;
}

interface BuildCollectionMetadataOptions {
  canonicalPath: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgDescription?: string;
  keywords: string[];
  /** Use location hero map when heroImageUrl is unset */
  locationSlug?: string;
  robots?: Metadata['robots'];
}

export function buildCollectionPageMetadata(
  entity: CollectionSeoSource,
  {
    canonicalPath,
    defaultTitle,
    defaultDescription,
    defaultOgDescription,
    keywords,
    locationSlug,
    robots,
  }: BuildCollectionMetadataOptions,
): Metadata {
  const title = entity.seoTitle?.trim() || defaultTitle;
  const description = entity.metaDescription?.trim() || defaultDescription;
  const ogDescription = defaultOgDescription ?? description;

  const ogImage =
    entity.heroImageUrl?.trim() ||
    entity.logo?.trim() ||
    (locationSlug ? getLocationHeroImageUrl(locationSlug) : getDefaultOgImageUrl());

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description: ogDescription,
      type: 'website',
      url: canonicalPath,
      siteName: 'Superluxere',
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: ogDescription,
      images: [ogImage],
    },
    ...(robots ? { robots } : {}),
  };
}
