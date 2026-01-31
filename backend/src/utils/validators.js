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
    developerId: z.string().uuid('Invalid developer ID'),
    locationId: z.string().uuid('Invalid location ID'),
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
    developerId: z.string().uuid().optional(),
    locationId: z.string().uuid().optional(),
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
    isPublished: z.boolean().optional(),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
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
    locationId: z.string().optional(),
    developerId: z.string().optional(),
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
