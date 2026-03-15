import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/api/blogs';
import { getProperties, getLocations, getDevelopers, getCategories } from '@/lib';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://superluxere.com';

  const [blogResponse, propertiesRes, locationsRes, developersRes, categoriesRes] =
    await Promise.all([
      getBlogs({ limit: 1000 }, false).catch(() => ({
        data: [],
        pagination: { total: 0, limit: 0, offset: 0 },
      })),
      getProperties({ limit: 500, isPublished: true }, false).catch(() => ({ data: [] })),
      getLocations({ limit: 200 }, false).catch(() => ({ data: [] })),
      getDevelopers({ limit: 100 }, false).catch(() => []),
      getCategories({ limit: 100 }, false).catch(() => ({ data: [] })),
    ]);

  const normalise = (res: any): any[] =>
    Array.isArray(res) ? res : res?.data || [];

  const blogPosts    = normalise(blogResponse);
  const properties   = normalise(propertiesRes);
  const locations    = normalise(locationsRes);
  const developers   = normalise(developersRes);
  const categories   = normalise(categoriesRes);

  // Use the most-recently-updated blog date so /blogs lastModified is meaningful
  const latestBlogDate =
    blogPosts.length > 0
      ? new Date(
          Math.max(
            ...blogPosts.map((p: any) =>
              new Date(p.updatedAt || p.publishedAt || p.createdAt || 0).getTime()
            )
          )
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

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const propertyPages: MetadataRoute.Sitemap = properties.map((p: any) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l: any) => ({
    url: `${baseUrl}/location/${l.slug}`,
    lastModified: l.updatedAt ? new Date(l.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const developerPages: MetadataRoute.Sitemap = developers.map((d: any) => ({
    url: `${baseUrl}/developer/${d.slug}`,
    lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c: any) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...propertyPages,
    ...locationPages,
    ...developerPages,
    ...categoryPages,
  ];
}
