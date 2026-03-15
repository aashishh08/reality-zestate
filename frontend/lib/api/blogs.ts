/**
 * Blogs API
 * Handles all blog-related API calls
 */

import { fetchFromAPI, buildQueryString } from '../api-client';
import { sanitizeHtml } from '../utils/sanitize-html';

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
  // Strip any full-document HTML wrappers before processing the content.
  const cleanContent = sanitizeHtml(raw.content || '');

  // Sample only the first 2 000 characters to estimate word count —
  // avoids running a regex over a potentially large HTML document.
  const sample = cleanContent.substring(0, 2000).replace(/<[^>]+>/g, '').trim();
  const sampleWordCount = sample.split(/\s+/).filter(Boolean).length;
  // Scale estimate if content is longer than the sample window.
  const contentLen = cleanContent.length;
  const wordCount = contentLen > 2000
    ? Math.round(sampleWordCount * (contentLen / 2000))
    : sampleWordCount;

  // Use stored excerpt if present, otherwise auto-generate from sample
  const autoExcerpt =
    sample.length > 160 ? sample.substring(0, 157) + '...' : sample;

  if (process.env.NODE_ENV !== 'production' || process.env.BLOG_DEBUG === '1') {
    const raw_ = raw.content || '';
    console.log('[blog:normalizeBlogPost] slug=', raw.slug);
    console.log('[blog:normalizeBlogPost] raw content length=', raw_.length);
    console.log('[blog:normalizeBlogPost] raw first 300=', raw_.slice(0, 300));
    console.log('[blog:normalizeBlogPost] has </body>=', /<\/body/i.test(raw_));
    console.log('[blog:normalizeBlogPost] has </html>=', /<\/html/i.test(raw_));
    console.log('[blog:normalizeBlogPost] after sanitize </body>=', /<\/body/i.test(cleanContent));
  }

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || autoExcerpt || raw.title,
    content: cleanContent,
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
 * Cached for 5 minutes (ISR-compatible). Admin edits use the write API directly
 * so stale reads here are acceptable for public-facing pages.
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost> {
  const raw = await fetchFromAPI<Record<string, any>>(
    `/blogs/${slug}`,
    {
      method: 'GET',
      next: { revalidate: 300 },
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
