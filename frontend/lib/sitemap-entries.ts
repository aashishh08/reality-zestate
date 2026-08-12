import { getSiteUrl } from '@/lib/site-url';
import {
  fetchSitemapData,
  latestInventoryDate,
  type SitemapSlugRow,
} from '@/lib/sitemap-data';

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'daily' | 'weekly' | 'monthly';
  priority?: number;
};

function safeDate(row: SitemapSlugRow): Date | undefined {
  const d = new Date(row.updatedAt || row.createdAt || 0);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function maxRowDate(rows: SitemapSlugRow[]): Date | undefined {
  if (!rows.length) return undefined;
  const ts = Math.max(
    ...rows.map((row) => safeDate(row)?.getTime() ?? 0),
  );
  return Number.isFinite(ts) && ts > 0 ? new Date(ts) : undefined;
}

export async function buildSitemapEntries(): Promise<SitemapEntry[]> {
  const baseUrl = getSiteUrl();
  const data = await fetchSitemapData(3600);

  const blogPosts = data.blogs ?? [];
  const properties = data.properties ?? [];
  const locations = data.locations ?? [];
  const developers = data.developers ?? [];
  const categories = data.categories ?? [];
  const tags = data.tags ?? [];

  const latestBlogDate = maxRowDate(blogPosts);
  const latestPropertyDate = maxRowDate(properties);
  const inventoryFreshness = latestInventoryDate(data);

  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      ...(inventoryFreshness ? { lastModified: inventoryFreshness } : {}),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      ...(latestPropertyDate ? { lastModified: latestPropertyDate } : {}),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blogs`,
      ...(latestBlogDate ? { lastModified: latestBlogDate } : {}),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const blogPages: SitemapEntry[] = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: safeDate(post),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const propertyPages: SitemapEntry[] = properties.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: safeDate(p),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const locationPages: SitemapEntry[] = locations.map((l) => ({
    url: `${baseUrl}/location/${l.slug}`,
    lastModified: safeDate(l),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const developerPages: SitemapEntry[] = developers.map((d) => ({
    url: `${baseUrl}/developer/${d.slug}`,
    lastModified: safeDate(d),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const categoryPages: SitemapEntry[] = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: safeDate(c),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const tagPages: SitemapEntry[] = tags
    .filter((tag) => Boolean(tag?.slug))
    .map((tag) => ({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: safeDate(tag),
      changeFrequency: 'weekly',
      priority: 0.65,
    }));

  return [
    ...staticPages,
    ...blogPages,
    ...propertyPages,
    ...locationPages,
    ...developerPages,
    ...categoryPages,
    ...tagPages,
  ];
}

/** Minimal fallback if the API is unreachable during generation. */
export function buildFallbackSitemapEntries(): SitemapEntry[] {
  const baseUrl = getSiteUrl();
  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/blogs`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about-us`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
