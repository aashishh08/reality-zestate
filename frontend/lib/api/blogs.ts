/**
 * Blogs API
 * Handles all blog-related API calls
 */

import { fetchFromAPI, buildQueryString } from '../api-client';

export interface BlogFilters {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  featuredImage: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  tags: string[];
  readTime: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  isPublished?: boolean;
  createdAt?: string;
}

export interface BlogsResponse {
  data: BlogPost[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Maps raw backend blog records (which only contain id/title/slug/content/
 * isPublished/createdAt/updatedAt) to the full BlogPost shape the UI expects.
 * All missing fields are derived from what IS available.
 */
function normalizeBlogPost(raw: Record<string, any>): BlogPost {
  const plainText = (raw.content || '').replace(/<[^>]+>/g, '').trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // Use stored excerpt if present, otherwise auto-generate from content
  const autoExcerpt =
    plainText.length > 160 ? plainText.substring(0, 157) + '...' : plainText;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || autoExcerpt || raw.title,
    content: raw.content || '',
    author: { name: raw.authorName || 'Team Superluxere' },
    publishedAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    featuredImage: raw.featuredImage || '',
    category: { id: 'real-estate', name: 'Real Estate', slug: 'real-estate' },
    tags: raw.tags || [],
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
    isPublished: raw.isPublished,
    createdAt: raw.createdAt,
    seo: (raw.metaTitle || raw.metaDescription)
      ? { metaTitle: raw.metaTitle, metaDescription: raw.metaDescription }
      : undefined,
  };
}

/**
 * Get all published blogs
 * Used for ISR pages with revalidation
 */
export async function getBlogs(
  filters?: BlogFilters,
  revalidate: number | false = 60
): Promise<BlogsResponse> {
  const queryString = buildQueryString(filters);

  // revalidate: false means no ISR — use no-store so Next.js never caches the fetch
  const fetchOptions =
    revalidate === false
      ? { method: 'GET' as const, cache: 'no-store' as RequestCache }
      : { method: 'GET' as const, next: { revalidate } };

  const raw = await fetchFromAPI<BlogsResponse>(`/blogs${queryString}`, fetchOptions);

  return {
    data: (raw.data || []).map(normalizeBlogPost),
    pagination: raw.pagination || { limit: 10, offset: 0, total: 0 },
  };
}

/**
 * Get blog by slug
 * Used for SSR pages (always fresh)
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost> {
  const raw = await fetchFromAPI<Record<string, any>>(
    `/blogs/${slug}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  return normalizeBlogPost(raw);
}

/**
 * Create blog (admin only)
 */
export async function createBlog(
  data: Partial<BlogPost>,
  token: string
): Promise<BlogPost> {
  return fetchFromAPI<BlogPost>(
    '/blogs',
    {
      method: 'POST',
      body: data,
      token,
    }
  );
}

/**
 * Update blog (admin only)
 */
export async function updateBlog(
  id: string,
  data: Partial<BlogPost>,
  token: string
): Promise<BlogPost> {
  return fetchFromAPI<BlogPost>(
    `/blogs/${id}`,
    {
      method: 'PUT',
      body: data,
      token,
    }
  );
}

/**
 * Delete blog (admin only)
 */
export async function deleteBlog(
  id: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  return fetchFromAPI(
    `/blogs/${id}`,
    {
      method: 'DELETE',
      token,
    }
  );
}
