import { MetadataRoute } from 'next';
import { fetchFromAPI } from '@/lib/api-client';
import { getSiteUrl } from '@/lib/site-url';

/** ISR: regenerate sitemap at most once per hour (crawlers still get fresh URLs). */
export const revalidate = 3600;

interface SitemapSlugRow {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface SitemapApiData {
  blogs: SitemapSlugRow[];
  properties: SitemapSlugRow[];
  locations: SitemapSlugRow[];
  developers: SitemapSlugRow[];
  categories: SitemapSlugRow[];
  tagSlugs: string[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const data = await fetchFromAPI<SitemapApiData>('/sitemap-data', {
    next: { revalidate: 3600 },
  }).catch(() => ({
    blogs: [],
    properties: [],
    locations: [],
    developers: [],
    categories: [],
    tagSlugs: [],
  }));

  const blogPosts = data.blogs ?? [];
  const properties = data.properties ?? [];
  const locations = data.locations ?? [];
  const developers = data.developers ?? [];
  const categories = data.categories ?? [];
  const tagSlugs = data.tagSlugs ?? [];

  const latestBlogDate =
    blogPosts.length > 0
      ? new Date(
          Math.max(
            ...blogPosts.map((p) =>
              new Date(p.updatedAt || p.createdAt || 0).getTime(),
            ),
          ),
        )
      : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: latestBlogDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${baseUrl}/location/${l.slug}`,
    lastModified: l.updatedAt ? new Date(l.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const developerPages: MetadataRoute.Sitemap = developers.map((d) => ({
    url: `${baseUrl}/developer/${d.slug}`,
    lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const tagPages: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
    url: `${baseUrl}/tag/${slug}`,
    lastModified: new Date(),
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
