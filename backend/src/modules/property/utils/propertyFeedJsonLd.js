/**
 * Helpers for typed property facts and JSON-LD feed generation.
 */

const SITE_URL = (process.env.SITE_URL || process.env.CORS_ORIGIN || 'https://superluxere.com')
  .replace(/\/$/, '');

export function getSiteBaseUrl() {
  return SITE_URL.includes('localhost') ? 'https://superluxere.com' : SITE_URL;
}

/** Normalise typed fact fields from request body. */
export function parseTypedFacts(data) {
  const out = {};
  if (data.bedrooms !== undefined) {
    const n = parseInt(data.bedrooms, 10);
    out.bedrooms = Number.isFinite(n) && n > 0 ? n : null;
  }
  if (data.bathrooms !== undefined) {
    const n = parseInt(data.bathrooms, 10);
    out.bathrooms = Number.isFinite(n) && n > 0 ? n : null;
  }
  if (data.areaSqftMin !== undefined) {
    const n = parseInt(data.areaSqftMin, 10);
    out.areaSqftMin = Number.isFinite(n) && n > 0 ? n : null;
  }
  if (data.areaSqftMax !== undefined) {
    const n = parseInt(data.areaSqftMax, 10);
    out.areaSqftMax = Number.isFinite(n) && n > 0 ? n : null;
  }
  if (data.reraNumber !== undefined) {
    out.reraNumber = typeof data.reraNumber === 'string' && data.reraNumber.trim()
      ? data.reraNumber.trim().slice(0, 120)
      : null;
  }
  if (data.possessionDate !== undefined) {
    out.possessionDate = data.possessionDate || null;
  }
  if (data.launchDate !== undefined) {
    out.launchDate = data.launchDate || null;
  }
  if (data.latitude !== undefined) {
    const n = parseFloat(data.latitude);
    out.latitude = Number.isFinite(n) ? n : null;
  }
  if (data.longitude !== undefined) {
    const n = parseFloat(data.longitude);
    out.longitude = Number.isFinite(n) ? n : null;
  }
  return out;
}

/** Build Schema.org RealEstateListing node for a property row. */
export function buildRealEstateListingJsonLd(property, position) {
  const base = getSiteBaseUrl();
  const pageUrl = `${base}/projects/${property.slug}`;
  const priceMin = property.priceMin != null ? Number(property.priceMin) : null;
  const priceMax = property.priceMax != null ? Number(property.priceMax) : null;

  const listing = {
    '@type': 'RealEstateListing',
    name: property.title,
    url: pageUrl,
    datePosted: property.createdAt,
  };

  if (property.propertyType) {
    listing.category = property.propertyType === 'commercial' ? 'Commercial' : 'Residential';
  }

  if (priceMin != null || priceMax != null) {
    listing.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      ...(priceMin != null ? { lowPrice: String(priceMin) } : {}),
      ...(priceMax != null ? { highPrice: String(priceMax) } : {}),
    };
  }

  const additional = [];
  if (property.bedrooms) {
    additional.push({ '@type': 'PropertyValue', name: 'Bedrooms', value: String(property.bedrooms) });
  }
  if (property.bathrooms) {
    additional.push({ '@type': 'PropertyValue', name: 'Bathrooms', value: String(property.bathrooms) });
  }
  if (property.areaSqftMin || property.areaSqftMax) {
    const range = [property.areaSqftMin, property.areaSqftMax].filter(Boolean).join(' – ');
    additional.push({ '@type': 'PropertyValue', name: 'Area (sq.ft)', value: range });
  }
  if (property.reraNumber) {
    additional.push({ '@type': 'PropertyValue', name: 'RERA Number', value: property.reraNumber });
  }
  if (property.launchDate) {
    additional.push({ '@type': 'PropertyValue', name: 'Launch Date', value: property.launchDate });
  }
  if (property.possessionDate) {
    additional.push({ '@type': 'PropertyValue', name: 'Possession Date', value: property.possessionDate });
  }
  if (additional.length) listing.additionalProperty = additional;

  const dev = property.Developer;
  if (dev?.name) {
    listing.seller = {
      '@type': 'Organization',
      name: dev.name,
      ...(dev.slug ? { url: `${base}/developer/${dev.slug}` } : {}),
    };
  }

  const loc = property.Location;
  if (loc?.name || property.latitude != null) {
    const place = { '@type': 'Place', name: loc?.name || property.title };
    if (property.latitude != null && property.longitude != null) {
      place.geo = {
        '@type': 'GeoCoordinates',
        latitude: Number(property.latitude),
        longitude: Number(property.longitude),
      };
    }
    listing.contentLocation = place;
  }

  if (property.thumbnailUrl) {
    listing.image = property.thumbnailUrl;
  }

  return {
    '@type': 'ListItem',
    position,
    item: listing,
  };
}

/** Wrap listings in an ItemList JSON-LD document. */
export function buildPropertiesFeedJsonLd(properties, { offset = 0 } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((p, i) => buildRealEstateListingJsonLd(p, offset + i + 1)),
  };
}
