/**
 * Location column sets for Sequelize queries.
 * Use BASE for joins/listings — works before featured-column migration runs.
 * Use ADMIN when reading/writing isFeatured / featuredOrder (admin + homepage featured).
 */

export const LOCATION_SEO_ATTRIBUTES = ['seoTitle', 'metaDescription', 'heroImageUrl'];

export const LOCATION_BASE_ATTRIBUTES = [
  'id',
  'name',
  'slug',
  'type',
  'parentId',
  ...LOCATION_SEO_ATTRIBUTES,
  'createdAt',
  'updatedAt',
];

export const LOCATION_PARENT_ATTRIBUTES = ['id', 'name', 'slug', 'type'];

export const LOCATION_ADMIN_ATTRIBUTES = [
  ...LOCATION_BASE_ATTRIBUTES,
  'isFeatured',
  'featuredOrder',
];
