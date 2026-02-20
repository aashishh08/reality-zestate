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
 * Get all blogs
 * Used for ISR pages with revalidation
 */
export async function getBlogs(
  filters?: BlogFilters,
  revalidate: number | false = 3600
): Promise<BlogsResponse> {
  const queryString = buildQueryString(filters);

  return fetchFromAPI<BlogsResponse>(
    `/blogs${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate, // ISR revalidation
      },
    }
  );
}

/**
 * Get blog by slug
 * Used for SSR pages (always fresh)
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost> {
  return fetchFromAPI<BlogPost>(
    `/blogs/${slug}`,
    {
      method: 'GET',
      cache: 'no-store', // SSR: no caching
    }
  );
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
