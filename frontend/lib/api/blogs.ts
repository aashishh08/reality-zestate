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
 * Strips full HTML document wrappers from blog content.
 * Content authored in rich-text editors (e.g. Genspark) is sometimes saved
 * as a complete HTML document. This function extracts just the body fragment
 * using indexOf/slice instead of regex so it works reliably on large strings.
 */
function stripDocumentWrappers(html: string): string {
  if (!html) return '';
  let result = html;

  // If a <body …> open tag exists, extract its inner content
  const bodyOpenIdx = result.search(/<body[\s>]/i);
  if (bodyOpenIdx !== -1) {
    const bodyTagEnd = result.indexOf('>', bodyOpenIdx) + 1;
    const bodyCloseIdx = result.toLowerCase().lastIndexOf('</body>');
    result = bodyCloseIdx > bodyTagEnd
      ? result.slice(bodyTagEnd, bodyCloseIdx)
      : result.slice(bodyTagEnd);
  } else {
    // No opening <body> — trim any trailing </body> / </html>
    const bc = result.toLowerCase().lastIndexOf('</body>');
    if (bc !== -1) result = result.slice(0, bc);
    const hc = result.toLowerCase().lastIndexOf('</html>');
    if (hc !== -1) result = result.slice(0, hc);
  }

  // Remove <head>…</head> if present
  const headOpen = result.toLowerCase().indexOf('<head');
  if (headOpen !== -1) {
    const headClose = result.toLowerCase().indexOf('</head>');
    if (headClose !== -1) result = result.slice(0, headOpen) + result.slice(headClose + 7);
  }

  // Remove <html …> / </html> wrapper tags
  result = result.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '');

  // Remove <style> blocks (they would apply globally and override page styles)
  while (result.toLowerCase().includes('<style')) {
    const so = result.toLowerCase().indexOf('<style');
    const sc = result.toLowerCase().indexOf('</style>', so);
    if (sc === -1) break;
    result = result.slice(0, so) + result.slice(sc + 8);
  }

  // Remove <script> blocks for security
  while (result.toLowerCase().includes('<script')) {
    const so = result.toLowerCase().indexOf('<script');
    const sc = result.toLowerCase().indexOf('</script>', so);
    if (sc === -1) break;
    result = result.slice(0, so) + result.slice(sc + 9);
  }

  // ── Final hard-strip: remove any stray closing document tags the above
  // logic may have missed (e.g. <body> with attributes containing '>',
  // content that only has </body></html> with no opening <body> tag, etc).
  // </body> and </html> are NEVER valid inside an HTML fragment — safe to
  // strip unconditionally.
  result = result.replace(/<\/body>/gi, '').replace(/<\/html>/gi, '');

  return result.trim();
}

/**
 * Maps raw backend blog records (which only contain id/title/slug/content/
 * isPublished/createdAt/updatedAt) to the full BlogPost shape the UI expects.
 * All missing fields are derived from what IS available.
 */
function normalizeBlogPost(raw: Record<string, any>): BlogPost {
  // Strip any full-document HTML wrappers before processing the content.
  const cleanContent = stripDocumentWrappers(raw.content || '');

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
