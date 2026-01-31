# Quick Start Guide: Adding Blogs via CRM

This guide will help you integrate your CRM portal to add and manage blog posts.

## Prerequisites

- CRM portal with admin access
- API endpoint configured
- Image hosting setup (Cloudinary, AWS S3, or similar)

## Step 1: Configure Environment

Add your API URL to `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Step 2: Update API Service

In `lib/blog-api.ts`, uncomment the actual API calls:

```typescript
export async function getBlogPosts(filters?: BlogFilters): Promise<BlogListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const url = `${API_BASE_URL}/blogs?${params.toString()}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}
```

## Step 3: Create Blog Post via CRM

### API Endpoint
```
POST https://your-api-domain.com/api/blogs
```

### Request Headers
```
Authorization: Bearer {your-access-token}
Content-Type: application/json
```

### Request Body Example
```json
{
  "title": "Top 10 Luxury Penthouses in Gurgaon for 2026",
  "slug": "luxury-penthouses-gurgaon-2026",
  "excerpt": "Discover the most exclusive penthouses in Gurgaon that redefine luxury living with breathtaking views and world-class amenities.",
  "content": "<h2>Introduction</h2><p>Gurgaon has emerged as one of India's premier destinations for luxury real estate...</p><h2>Top Penthouses</h2><p>Here are the top 10 luxury penthouses...</p>",
  "author": {
    "name": "Priya Sharma",
    "bio": "Luxury Real Estate Consultant with 10+ years of experience"
  },
  "featuredImage": "https://cdn.example.com/blog/luxury-penthouse.jpg",
  "categoryId": "cat-uuid-1",
  "tags": ["penthouses", "gurgaon", "luxury", "investment"],
  "publishedAt": "2026-01-10T10:00:00Z",
  "seo": {
    "metaTitle": "Top 10 Luxury Penthouses in Gurgaon 2026 | Opulnz Abode",
    "metaDescription": "Explore the most exclusive luxury penthouses in Gurgaon. Premium properties with world-class amenities and stunning views.",
    "keywords": ["luxury penthouses gurgaon", "premium apartments", "gurgaon real estate"]
  }
}
```

### Response
```json
{
  "id": "uuid-string",
  "slug": "luxury-penthouses-gurgaon-2026",
  "title": "Top 10 Luxury Penthouses in Gurgaon for 2026",
  // ... full blog post object
}
```

## Step 4: Upload Images

### Upload Featured Image
```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/image.jpg" \
  -F "type=featured" \
  https://your-api-domain.com/api/blogs/upload-image
```

### Response
```json
{
  "url": "https://cdn.example.com/blog/image-uuid.jpg",
  "width": 1920,
  "height": 1080,
  "size": 245678
}
```

Use this URL as the `featuredImage` in your blog post.

## Step 5: Trigger Revalidation

After creating/updating a blog post, trigger Next.js revalidation:

### Webhook Endpoint
```
POST https://your-nextjs-app.com/api/revalidate
```

### Request Body
```json
{
  "action": "create",
  "slug": "luxury-penthouses-gurgaon-2026"
}
```

This ensures the blog listing and individual post pages are updated immediately.

## Step 6: Verify on Frontend

Visit your blog pages:
- **Listing**: https://your-domain.com/blogs
- **Individual Post**: https://your-domain.com/blogs/luxury-penthouses-gurgaon-2026

## CRM Portal Features Checklist

Your CRM portal should include:

### ✅ Blog Management
- [ ] List all blog posts
- [ ] Create new blog post
- [ ] Edit existing blog post
- [ ] Delete blog post
- [ ] Preview blog post
- [ ] Publish/Unpublish toggle

### ✅ Rich Text Editor
- [ ] WYSIWYG editor for content
- [ ] HTML source editing
- [ ] Image upload and insertion
- [ ] Link insertion
- [ ] Heading styles (H2, H3, etc.)
- [ ] Lists (ordered, unordered)
- [ ] Blockquotes
- [ ] Code blocks

### ✅ SEO Tools
- [ ] Meta title input (with character counter)
- [ ] Meta description input (with character counter)
- [ ] Keywords input (tag-based)
- [ ] OG image upload
- [ ] Slug auto-generation from title
- [ ] Preview how post appears in search results

### ✅ Media Management
- [ ] Featured image upload
- [ ] Image library/gallery
- [ ] Image cropping/resizing
- [ ] Alt text for images
- [ ] Image optimization

### ✅ Organization
- [ ] Category selection
- [ ] Tag management (create, select)
- [ ] Author selection
- [ ] Publication date picker
- [ ] Draft/Published status

### ✅ Analytics (Optional)
- [ ] View count
- [ ] Read time calculation
- [ ] Popular posts dashboard
- [ ] Search analytics

## Content Guidelines

### Title
- **Length**: 10-60 characters (optimal for SEO)
- **Style**: Clear, descriptive, includes keywords
- **Example**: "Top 10 Luxury Penthouses in Gurgaon for 2026"

### Slug
- **Format**: lowercase, hyphen-separated
- **Length**: 3-10 words
- **Example**: `luxury-penthouses-gurgaon-2026`

### Excerpt
- **Length**: 50-160 characters
- **Purpose**: Summary for listing pages and meta description
- **Example**: "Discover the most exclusive penthouses in Gurgaon that redefine luxury living..."

### Content
- **Format**: HTML
- **Structure**: Use H2, H3 for sections
- **Length**: 800-2000 words (optimal for SEO)
- **Images**: Include 3-5 images throughout
- **Links**: Add internal links to related properties/blogs

### Featured Image
- **Dimensions**: 1200x630px (recommended)
- **Format**: JPEG or WebP
- **Size**: < 500KB (optimized)
- **Aspect Ratio**: 1.91:1

### SEO Metadata
- **Meta Title**: 50-60 characters (includes brand name)
- **Meta Description**: 120-160 characters
- **Keywords**: 5-10 relevant keywords
- **OG Image**: Same as featured image or custom

### Categories
Choose one:
- Luxury Living
- Investment Guide
- Market Trends
- Design & Architecture

### Tags
Add 3-10 relevant tags:
- Location-based: gurgaon, mumbai, delhi, bangalore
- Property type: penthouses, villas, apartments
- Features: luxury, sustainable, smart-home
- Topics: investment, market-analysis, trends

## Example: Complete Blog Post

```json
{
  "title": "Sustainable Luxury Homes: The Future of Real Estate in India",
  "slug": "sustainable-luxury-homes-india-2026",
  "excerpt": "Discover how eco-friendly design and sustainable practices are revolutionizing luxury real estate in India, combining premium living with environmental responsibility.",
  "content": "<h2>The Rise of Sustainable Luxury</h2><p>In recent years, sustainable architecture has moved from a niche concept to a mainstream requirement in India's luxury real estate market...</p><h2>Key Features of Sustainable Luxury Homes</h2><ul><li>Solar power integration</li><li>Rainwater harvesting systems</li><li>Green building materials</li><li>Energy-efficient appliances</li></ul><h2>Top Sustainable Luxury Projects in India</h2><p>Here are some of the most impressive sustainable luxury developments...</p><h2>Investment Perspective</h2><p>Sustainable homes not only benefit the environment but also offer excellent long-term value...</p><h2>Conclusion</h2><p>The future of luxury real estate in India is undoubtedly green...</p>",
  "author": {
    "name": "Anita Desai",
    "bio": "Sustainable Architecture Specialist with 15 years of experience"
  },
  "featuredImage": "https://cdn.example.com/blog/sustainable-home.jpg",
  "categoryId": "cat-uuid-4",
  "tags": ["sustainable", "eco-friendly", "luxury homes", "green architecture", "investment"],
  "publishedAt": "2026-01-15T09:00:00Z",
  "seo": {
    "metaTitle": "Sustainable Luxury Homes in India 2026 | Eco-Friendly Living",
    "metaDescription": "Explore how sustainable design is transforming luxury real estate in India. Eco-friendly homes with premium amenities and long-term value.",
    "keywords": ["sustainable luxury homes", "eco-friendly real estate", "green architecture india", "sustainable living", "luxury green homes"]
  }
}
```

## Troubleshooting

### Blog Post Not Appearing
1. Check if the post is published (not draft)
2. Verify the API response is correct
3. Trigger manual revalidation
4. Clear Next.js cache: `rm -rf .next`

### Images Not Loading
1. Verify image URL is accessible
2. Check Next.js image domains in `next.config.ts`
3. Ensure images are optimized (< 2MB)

### SEO Metadata Not Showing
1. Check meta title/description length
2. Verify OG image URL is valid
3. Test with [Open Graph Debugger](https://www.opengraph.xyz/)

### Slow Page Load
1. Optimize images (use WebP format)
2. Reduce content size
3. Check ISR revalidation time
4. Enable CDN for images

## Support

For technical issues:
- **Documentation**: See `BLOG_DOCUMENTATION.md`
- **API Spec**: See `CRM_API_SPECIFICATION.md`
- **Email**: support@opulnzabode.com

---

**Ready to start adding blogs?** Follow this guide and your content will be live in minutes!
