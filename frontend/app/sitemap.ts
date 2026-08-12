import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import {
  fetchSitemapData,
  latestInventoryDate,
  type SitemapSlugRow,
} from '@/lib/sitemap-data';

/** ISR: regenerate sitemap at most once per hour (crawlers still get fresh URLs). */
export const revalidate = 3600;

function rowDate(row: SitemapSlugRow): Date {
  return new Date(row.updatedAt || row.createdAt || 0);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const data = await fetchSitemapData(3600);

  const blogPosts = data.blogs ?? [];
  const properties = data.properties ?? [];
  const locations = data.locations ?? [];
  const developers = data.developers ?? [];
  const categories = data.categories ?? [];
  const tags = data.tags ?? [];

  const latestBlogDate =
    blogPosts.length > 0
      ? new Date(
          Math.max(...blogPosts.map((p) => rowDate(p).getTime())),
        )
      : undefined;

  const latestPropertyDate =
    properties.length > 0
      ? new Date(
          Math.max(...properties.map((p) => rowDate(p).getTime())),
        )
      : undefined;

  const inventoryFreshness = latestInventoryDate(data);

  const staticPages: MetadataRoute.Sitemap = [
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

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: rowDate(post),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: rowDate(p),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    ...(p.thumbnailUrl ? { images: [p.thumbnailUrl] } : {}),
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${baseUrl}/location/${l.slug}`,
    lastModified: rowDate(l),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const developerPages: MetadataRoute.Sitemap = developers.map((d) => ({
    url: `${baseUrl}/developer/${d.slug}`,
    lastModified: rowDate(d),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: rowDate(c),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: rowDate(tag),
    changeFrequency: 'weekly' as const,
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
