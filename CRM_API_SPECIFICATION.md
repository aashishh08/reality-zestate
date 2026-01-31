# Blog CRM API Specification

This document outlines the API endpoints your CRM system should implement for blog management.

## Base URL
```
https://your-api-domain.com/api
```

## Authentication
All API requests should include authentication headers:
```
Authorization: Bearer {access_token}
```

---

## Endpoints

### 1. Get All Blog Posts

**Endpoint:** `GET /blogs`

**Query Parameters:**
- `category` (optional): Filter by category slug
- `tag` (optional): Filter by tag
- `search` (optional): Search in title and excerpt
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/blogs?category=luxury-living&page=1&pageSize=10
```

**Response (200 OK):**
```json
{
  "posts": [
    {
      "id": "uuid-string",
      "slug": "luxury-penthouses-gurgaon-2026",
      "title": "Top 10 Luxury Penthouses in Gurgaon for 2026",
      "excerpt": "Discover the most exclusive penthouses...",
      "content": "<p>Full HTML content here...</p>",
      "author": {
        "name": "Priya Sharma",
        "avatar": "https://cdn.example.com/authors/priya.jpg",
        "bio": "Luxury Real Estate Consultant"
      },
      "publishedAt": "2026-01-10T10:00:00Z",
      "updatedAt": "2026-01-11T15:30:00Z",
      "featuredImage": "https://cdn.example.com/blog/image.jpg",
      "category": {
        "id": "cat-uuid",
        "name": "Luxury Living",
        "slug": "luxury-living"
      },
      "tags": ["penthouses", "gurgaon", "luxury"],
      "readTime": 8,
      "seo": {
        "metaTitle": "Custom meta title",
        "metaDescription": "Custom meta description",
        "keywords": ["keyword1", "keyword2"],
        "ogImage": "https://cdn.example.com/og-image.jpg"
      }
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

---

### 2. Get Single Blog Post

**Endpoint:** `GET /blogs/{slug}`

**Path Parameters:**
- `slug`: URL-friendly slug of the blog post

**Example Request:**
```bash
GET /api/blogs/luxury-penthouses-gurgaon-2026
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "slug": "luxury-penthouses-gurgaon-2026",
  "title": "Top 10 Luxury Penthouses in Gurgaon for 2026",
  "excerpt": "Discover the most exclusive penthouses...",
  "content": "<p>Full HTML content here...</p>",
  "author": {
    "name": "Priya Sharma",
    "avatar": "https://cdn.example.com/authors/priya.jpg",
    "bio": "Luxury Real Estate Consultant"
  },
  "publishedAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-01-11T15:30:00Z",
  "featuredImage": "https://cdn.example.com/blog/image.jpg",
  "category": {
    "id": "cat-uuid",
    "name": "Luxury Living",
    "slug": "luxury-living"
  },
  "tags": ["penthouses", "gurgaon", "luxury"],
  "readTime": 8,
  "seo": {
    "metaTitle": "Custom meta title",
    "metaDescription": "Custom meta description",
    "keywords": ["keyword1", "keyword2"],
    "ogImage": "https://cdn.example.com/og-image.jpg"
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": "Blog post not found"
}
```

---

### 3. Get Blog Categories

**Endpoint:** `GET /blogs/categories`

**Example Request:**
```bash
GET /api/blogs/categories
```

**Response (200 OK):**
```json
[
  {
    "id": "cat-uuid-1",
    "name": "Luxury Living",
    "slug": "luxury-living",
    "description": "Insights into luxury real estate"
  },
  {
    "id": "cat-uuid-2",
    "name": "Investment Guide",
    "slug": "investment-guide",
    "description": "Expert advice on property investment"
  }
]
```

---

### 4. Create Blog Post

**Endpoint:** `POST /blogs`

**Authentication:** Required (Admin/Editor role)

**Request Body:**
```json
{
  "title": "Top 10 Luxury Penthouses in Gurgaon for 2026",
  "slug": "luxury-penthouses-gurgaon-2026",
  "excerpt": "Discover the most exclusive penthouses...",
  "content": "<p>Full HTML content here...</p>",
  "author": {
    "name": "Priya Sharma",
    "avatar": "https://cdn.example.com/authors/priya.jpg",
    "bio": "Luxury Real Estate Consultant"
  },
  "featuredImage": "https://cdn.example.com/blog/image.jpg",
  "categoryId": "cat-uuid",
  "tags": ["penthouses", "gurgaon", "luxury"],
  "publishedAt": "2026-01-10T10:00:00Z",
  "seo": {
    "metaTitle": "Custom meta title",
    "metaDescription": "Custom meta description",
    "keywords": ["keyword1", "keyword2"],
    "ogImage": "https://cdn.example.com/og-image.jpg"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "slug": "luxury-penthouses-gurgaon-2026",
  "title": "Top 10 Luxury Penthouses in Gurgaon for 2026",
  "excerpt": "Discover the most exclusive penthouses...",
  "content": "<p>Full HTML content here...</p>",
  "author": {
    "name": "Priya Sharma",
    "avatar": "https://cdn.example.com/authors/priya.jpg",
    "bio": "Luxury Real Estate Consultant"
  },
  "publishedAt": "2026-01-10T10:00:00Z",
  "updatedAt": "2026-01-10T10:00:00Z",
  "featuredImage": "https://cdn.example.com/blog/image.jpg",
  "category": {
    "id": "cat-uuid",
    "name": "Luxury Living",
    "slug": "luxury-living"
  },
  "tags": ["penthouses", "gurgaon", "luxury"],
  "readTime": 8,
  "seo": {
    "metaTitle": "Custom meta title",
    "metaDescription": "Custom meta description",
    "keywords": ["keyword1", "keyword2"],
    "ogImage": "https://cdn.example.com/og-image.jpg"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": {
    "title": "Title is required",
    "slug": "Slug must be unique"
  }
}
```

---

### 5. Update Blog Post

**Endpoint:** `PUT /blogs/{id}`

**Authentication:** Required (Admin/Editor role)

**Path Parameters:**
- `id`: UUID of the blog post

**Request Body:** Same as Create Blog Post

**Response (200 OK):** Same as Create Blog Post

**Response (404 Not Found):**
```json
{
  "error": "Blog post not found"
}
```

---

### 6. Delete Blog Post

**Endpoint:** `DELETE /blogs/{id}`

**Authentication:** Required (Admin role)

**Path Parameters:**
- `id`: UUID of the blog post

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Blog post not found"
}
```

---

### 7. Upload Image

**Endpoint:** `POST /blogs/upload-image`

**Authentication:** Required (Admin/Editor role)

**Content-Type:** `multipart/form-data`

**Request Body:**
- `image`: Image file (JPEG, PNG, WebP)
- `type`: "featured" | "content" | "author"

**Example Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/image.jpg" \
  -F "type=featured" \
  https://your-api-domain.com/api/blogs/upload-image
```

**Response (200 OK):**
```json
{
  "url": "https://cdn.example.com/blog/image-uuid.jpg",
  "width": 1920,
  "height": 1080,
  "size": 245678
}
```

---

### 8. Revalidate Cache (Webhook)

**Endpoint:** `POST /blogs/revalidate`

**Authentication:** Required (Webhook secret)

**Headers:**
```
X-Webhook-Secret: {your-webhook-secret}
```

**Request Body:**
```json
{
  "action": "create" | "update" | "delete",
  "slug": "luxury-penthouses-gurgaon-2026"
}
```

**Response (200 OK):**
```json
{
  "revalidated": true,
  "paths": [
    "/blogs",
    "/blogs/luxury-penthouses-gurgaon-2026"
  ]
}
```

---

## Data Validation Rules

### Blog Post
- `title`: Required, 10-200 characters
- `slug`: Required, unique, lowercase, alphanumeric with hyphens
- `excerpt`: Required, 50-300 characters
- `content`: Required, HTML content
- `featuredImage`: Required, valid URL
- `categoryId`: Required, must exist
- `tags`: Array of strings, 1-10 tags
- `publishedAt`: ISO 8601 date string

### SEO Fields
- `metaTitle`: Optional, max 60 characters
- `metaDescription`: Optional, max 160 characters
- `keywords`: Optional, array of strings, max 10 keywords
- `ogImage`: Optional, valid URL

### Author
- `name`: Required, 2-100 characters
- `avatar`: Optional, valid URL
- `bio`: Optional, max 200 characters

---

## Read Time Calculation

The `readTime` field should be automatically calculated based on content:
- Average reading speed: 200 words per minute
- Formula: `Math.ceil(wordCount / 200)`

---

## Image Requirements

### Featured Images
- Dimensions: 1200x630px (recommended)
- Format: JPEG, PNG, or WebP
- Max size: 2MB
- Aspect ratio: 1.91:1 (Open Graph standard)

### Author Avatars
- Dimensions: 200x200px (recommended)
- Format: JPEG, PNG, or WebP
- Max size: 500KB
- Aspect ratio: 1:1 (square)

### Content Images
- Max width: 1920px
- Format: JPEG, PNG, or WebP
- Max size: 3MB

---

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `DUPLICATE_SLUG`: Slug already exists
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute
- Upload endpoints: 20 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhooks

Configure webhooks to notify the Next.js app when content changes:

**Webhook URL:**
```
https://your-nextjs-app.com/api/revalidate
```

**Payload:**
```json
{
  "event": "blog.created" | "blog.updated" | "blog.deleted",
  "data": {
    "id": "uuid-string",
    "slug": "blog-slug"
  },
  "timestamp": "2026-01-10T10:00:00Z"
}
```

This triggers on-demand ISR revalidation for optimal performance.

---

## Testing

Use the following test credentials:
- **Admin User:** admin@example.com / admin123
- **Editor User:** editor@example.com / editor123

Test API at: `https://api-staging.example.com/api`

---

## Support

For API issues or questions:
- Email: api-support@example.com
- Documentation: https://docs.example.com/api
- Status Page: https://status.example.com
