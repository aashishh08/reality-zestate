import { fetchFromAPI } from '@/lib/api-client';

export interface SitemapSlugRow {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  thumbnailUrl?: string;
}

export interface SitemapApiData {
  blogs: SitemapSlugRow[];
  properties: SitemapSlugRow[];
  locations: SitemapSlugRow[];
  developers: SitemapSlugRow[];
  categories: SitemapSlugRow[];
  tags: SitemapSlugRow[];
}

const EMPTY_SITEMAP_DATA: SitemapApiData = {
  blogs: [],
  properties: [],
  locations: [],
  developers: [],
  categories: [],
  tags: [],
};

export async function fetchSitemapData(
  revalidate = 3600,
): Promise<SitemapApiData> {
  return fetchFromAPI<SitemapApiData>('/sitemap-data', {
    next: { revalidate },
  }).catch(() => EMPTY_SITEMAP_DATA);
}

function maxDate(rows: SitemapSlugRow[]): Date | undefined {
  if (!rows.length) return undefined;
  const ts = Math.max(
    ...rows.map((row) =>
      new Date(row.updatedAt || row.createdAt || 0).getTime(),
    ),
  );
  return Number.isFinite(ts) && ts > 0 ? new Date(ts) : undefined;
}

/** Stable lastmod for mostly-static pages — driven by latest inventory activity. */
export function latestInventoryDate(data: SitemapApiData): Date | undefined {
  return maxDate([
    ...data.properties,
    ...data.blogs,
    ...data.locations,
    ...data.developers,
    ...data.categories,
    ...data.tags,
  ]);
}
