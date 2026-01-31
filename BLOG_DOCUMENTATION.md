# Blog System Documentation

## Overview

This blog system is built with **Next.js 14+** and implements advanced SEO optimization techniques including **SSR (Server-Side Rendering)**, **ISR (Incremental Static Regeneration)**, and **dynamic metadata generation**.

## Architecture

### Pages

1. **Blog Listing Page** (`/app/blogs/page.tsx`)
   - Uses **ISR** with 1-hour revalidation
   - Supports filtering by category, tag, and search
   - Pagination support
   - Featured post display on first page
   - Dynamic metadata for SEO

2. **Individual Blog Post** (`/app/blogs/[slug]/page.tsx`)
   - Uses **SSR** for fresh content on every request
   - Rich SEO metadata (Open Graph, Twitter Cards)
   - JSON-LD structured data for search engines
   - Social sharing buttons
   - Related content suggestions

### Components

- **BlogNavigation** - Sticky navigation with category filters and search
- **BlogCard** - Reusable blog post card with featured variant
- Loading states and error handling

### Data Layer

- **`lib/blog-api.ts`** - API service layer with mock data
- **`types/blog.ts`** - TypeScript interfaces for type safety

## SEO Features

### 1. **Metadata Optimization**
- Dynamic page titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- Keywords and author information

### 2. **Structured Data (JSON-LD)**
Each blog post includes structured data for:
- Article type
- Author information
- Publication dates
- Featured images
- Publisher information

### 3. **Performance Optimization**
- **ISR** for blog listing (revalidates every hour)
- **SSR** for individual posts (always fresh)
- Image optimization with Next.js Image component
- Lazy loading for images
- Skeleton loading states

### 4. **Content Optimization**
- Semantic HTML structure
- Proper heading hierarchy (H1, H2, H3)
- Alt text for images
- Read time calculation
- Category and tag taxonomy

## API Integration (CRM Ready)

The system is designed to easily integrate with your CRM API:

### Current Setup (Mock Data)
```typescript
// lib/blog-api.ts
export async function getBlogPosts(filters?: BlogFilters): Promise<BlogListResponse> {
  // Currently returns mock data
  return getMockBlogPosts(filters);
}
```

### Production Setup (API Integration)
```typescript
// lib/blog-api.ts
export async function getBlogPosts(filters?: BlogFilters): Promise<BlogListResponse> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.tag) params.append('tag', filters.tag);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

  const url = `${API_BASE_URL}/blogs?${params.toString()}`;
  const response = await fetch(url, { 
    next: { revalidate: 3600 } // ISR: revalidate every hour
  });
  
  return response.json();
}
```

### Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Expected API Endpoints

Your CRM should provide these endpoints:

### 1. Get All Blog Posts
```
GET /api/blogs?category={slug}&tag={tag}&search={query}&page={num}&pageSize={size}

Response:
{
  "posts": BlogPost[],
  "total": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

### 2. Get Single Blog Post
```
GET /api/blogs/{slug}

Response: BlogPost
```

### 3. Get Categories
```
GET /api/blogs/categories

Response: BlogCategory[]
```

### 4. Create Blog Post (CRM Portal)
```
POST /api/blogs

Request Body:
{
  "title": string,
  "excerpt": string,
  "content": string, // HTML content
  "author": {
    "name": string,
    "avatar"?: string,
    "bio"?: string
  },
  "featuredImage": string,
  "categoryId": string,
  "tags": string[],
  "seo": {
    "metaTitle"?: string,
    "metaDescription"?: string,
    "keywords"?: string[]
  }
}

Response: BlogPost
```

### 5. Update Blog Post
```
PUT /api/blogs/{id}

Request Body: Same as create

Response: BlogPost
```

### 6. Delete Blog Post
```
DELETE /api/blogs/{id}

Response: { success: boolean }
```

## Image Management

Blog images should be stored in:
- `/public/images/blog/` - Featured images
- `/public/images/authors/` - Author avatars

For production, consider using:
- **Cloudinary** for image hosting and optimization
- **AWS S3** for scalable storage
- **Next.js Image Optimization** API

## Revalidation Strategy

### ISR (Blog Listing)
- Revalidates every **1 hour** (3600 seconds)
- Serves cached version for better performance
- Updates in background when cache expires

### SSR (Individual Posts)
- Fetches fresh data on every request
- Ensures latest content is always displayed
- Important for time-sensitive updates

### On-Demand Revalidation
You can trigger revalidation when content changes:

```typescript
// In your CRM webhook or API route
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { slug } = await request.json();
  
  // Revalidate specific blog post
  revalidatePath(`/blogs/${slug}`);
  
  // Revalidate blog listing
  revalidatePath('/blogs');
  
  return Response.json({ revalidated: true });
}
```

## Testing

### Local Testing
```bash
npm run dev
```

Visit:
- http://localhost:3000/blogs - Blog listing
- http://localhost:3000/blogs/luxury-penthouses-gurgaon-2026 - Sample post

### Production Build
```bash
npm run build
npm start
```

## Performance Metrics

Target metrics:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Future Enhancements

1. **Comments System** - Add Disqus or custom comments
2. **Related Posts** - ML-based content recommendations
3. **Reading Progress** - Progress bar for long articles
4. **Table of Contents** - Auto-generated from headings
5. **Newsletter Integration** - Mailchimp/SendGrid integration
6. **Analytics** - Google Analytics 4 integration
7. **RSS Feed** - Auto-generated RSS feed
8. **AMP Pages** - Accelerated Mobile Pages support

## Troubleshooting

### Images Not Loading
- Ensure images are in `/public/images/blog/`
- Check image paths in mock data
- Verify Next.js Image domains in `next.config.ts`

### ISR Not Working
- Check `revalidate` value in page
- Ensure production build (`npm run build`)
- ISR only works in production mode

### SEO Metadata Not Showing
- Use browser dev tools to inspect `<head>`
- Test with [Open Graph Debugger](https://www.opengraph.xyz/)
- Validate structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js ISR Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [SEO Best Practices](https://nextjs.org/learn/seo/introduction-to-seo)
