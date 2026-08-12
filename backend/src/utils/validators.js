import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const createPropertySchema = z.object({
  body: z.object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().min(1, 'Title is required'),
    propertyType: z.enum(['residential', 'commercial']),
    citySlug: z.string().min(1).optional(),
    localitySlug: z.string().min(1).optional(),
    developerSlug: z.string().min(1).optional(),
    status: z.string().optional(),
    priceMin: z.number().optional(),
    priceMax: z.number().optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    slug: z.string().optional(),
    title: z.string().optional(),
    propertyType: z.enum(['residential', 'commercial']).optional(),
    citySlug: z.string().min(1).optional().nullable(),
    localitySlug: z.string().min(1).optional().nullable(),
    developerSlug: z.string().min(1).optional().nullable(),
    status: z.string().optional(),
    priceMin: z.number().optional(),
    priceMax: z.number().optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().optional(),
    authorName: z.string().optional(),
    featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    authorName: z.string().optional(),
    featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Invalid phone number'),
    source: z.string().optional(),
    propertyId: z.string().uuid().optional().nullable(),
    layoutDownload: z.boolean().optional(),
  }),
});

export const updateLeadStatusSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'contacted', 'qualified', 'interested', 'converted', 'lost']),
  }),
});

export const listPropertiesSchema = z.object({
  query: z.object({
    propertyType: z.enum(['residential', 'commercial']).optional(),
    citySlug: z.string().optional(),
    localitySlug: z.string().optional(),
    developerSlug: z.string().optional(),
    categoryIds: z.union([z.string(), z.array(z.string())]).optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    isPublished: z.string().optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    limit: z.string().optional(),
    offset: z.string().optional(),
  }),
});

const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens');

export const createCitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    slug: slugSchema,
  }),
});

export const createLocalitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    slug: slugSchema,
    parentId: z.string().uuid('Parent city is required'),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    parentId: z.string().uuid().optional(),
    isFeatured: z.boolean().optional(),
    featuredOrder: z.number().int().min(0).max(999).nullable().optional(),
    seoTitle: z.string().max(90).optional().nullable(),
    metaDescription: z.string().max(320).optional().nullable(),
    heroImageUrl: z.string().max(2048).optional().nullable(),
  }),
});

export const updateDeveloperSchema = z.object({
  body: z.object({
    seoTitle: z.string().max(90).optional().nullable(),
    metaDescription: z.string().max(320).optional().nullable(),
    heroImageUrl: z.string().max(2048).optional().nullable(),
  }),
});
