/**
 * Site-wide WebSite JSON-LD with SearchAction — helps Google show a sitelinks
 * search box and gives AI crawlers a clear entry point for on-site discovery.
 */
import { getSiteUrl } from '@/lib/site-url';

export function WebSiteJsonLd() {
  const base = getSiteUrl();

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: 'Superluxere',
    url: base,
    description:
      "India's premier luxury real estate portal — curated premium residential and commercial projects across Delhi NCR, Mumbai, Bengaluru, and Goa.",
    publisher: {
      '@id': `${base}/#organization`,
    },
    inLanguage: 'en-IN',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${base}/blogs?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${base}/projects?city={city_slug}`,
        },
        'query-input': 'required name=city_slug',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
