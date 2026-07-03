import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/api/blogs';
import { getProperties, getLocations, getDevelopers, getCategories, getAllTagSlugs } from '@/lib';
import { fetchTagProperties } from '@/lib/api/properties-listing';
import { getSiteUrl } from '@/lib/site-url';

const BATCH = 500;

async function collectAllBlogSlugs(): Promise<
  { slug: string; updatedAt?: string }[]
> {
  const first = await getBlogs({ limit: BATCH, offset: 0 }, false).catch(() => ({
    data: [] as { slug: string; updatedAt?: string }[],
    pagination: { total: 0, limit: BATCH, offset: 0 },
  }));
  const total = first.pagination?.total ?? first.data?.length ?? 0;
  const out = [...(first.data || [])];
  for (let offset = BATCH; offset < total; offset += BATCH) {
    const res = await getBlogs({ limit: BATCH, offset }, false).catch(() => ({
      data: [] as { slug: string; updatedAt?: string }[],
    }));
    out.push(...(res.data || []));
  }
  return out;
}

async function collectAllPublishedPropertySlugs(): Promise<
  { slug: string; updatedAt?: string }[]
> {
  const first = await getProperties(
    { limit: BATCH, offset: 0, isPublished: true },
    false,
  ).catch(() => ({
    data: [] as { slug: string; updatedAt?: string }[],
    pagination: { total: 0, limit: BATCH, offset: 0 },
  }));
  const total = first.pagination?.total ?? first.data?.length ?? 0;
  const out = [...(first.data || [])];
  for (let offset = BATCH; offset < total; offset += BATCH) {
    const res = await getProperties(
      { limit: BATCH, offset, isPublished: true },
      false,
    ).catch(() => ({ data: [] as { slug: string; updatedAt?: string }[] }));
    out.push(...(res.data || []));
  }
  return out;
}

async function collectTagSlugsWithProperties(): Promise<string[]> {
  const allSlugs = await getAllTagSlugs().catch(() => [] as string[]);
  if (!allSlugs.length) return [];

  const results = await Promise.all(
    allSlugs.map(async (slug) => {
      const res = await fetchTagProperties(slug, {
        limit: 1,
        offset: 0,
        isPublished: true,
      }).catch(() => null);
      return (res?.pagination?.total ?? 0) > 0 ? slug : null;
    }),
  );

  return results.filter((slug): slug is string => Boolean(slug));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const [
    blogPosts,
    properties,
    locationsRes,
    developersRes,
    categoriesRes,
    tagSlugs,
  ] = await Promise.all([
    collectAllBlogSlugs(),
    collectAllPublishedPropertySlugs(),
    getLocations({ limit: 500 }, false).catch(() => ({ data: [] })),
    getDevelopers({ limit: 200 }, false).catch(() => []),
    getCategories({ limit: 500 }, false).catch(() => ({ data: [] })),
    collectTagSlugsWithProperties(),
  ]);

  const normalise = (res: unknown): any[] =>
    Array.isArray(res) ? res : (res as { data?: unknown[] })?.data || [];

  const locations = normalise(locationsRes);
  const developers = normalise(developersRes);
  const categories = normalise(categoriesRes);

  const latestBlogDate =
    blogPosts.length > 0
      ? new Date(
          Math.max(
            ...blogPosts.map((p: { updatedAt?: string; publishedAt?: string; createdAt?: string }) =>
              new Date(p.updatedAt || p.publishedAt || p.createdAt || 0).getTime(),
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

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: { slug: string; updatedAt?: string }) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const propertyPages: MetadataRoute.Sitemap = properties.map((p: { slug: string; updatedAt?: string }) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l: { slug: string; updatedAt?: string }) => ({
    url: `${baseUrl}/location/${l.slug}`,
    lastModified: l.updatedAt ? new Date(l.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const developerPages: MetadataRoute.Sitemap = developers.map((d: { slug: string; updatedAt?: string }) => ({
    url: `${baseUrl}/developer/${d.slug}`,
    lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c: { slug: string; updatedAt?: string }) => ({
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
