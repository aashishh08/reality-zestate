/**
 * Types for property listing, filtering, and pagination.
 * Keep this file as the single source of truth for all listing-related shapes.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-shapes
// ─────────────────────────────────────────────────────────────────────────────

export interface TagShape {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export interface CategoryShape {
  id: string;
  name: string;
  slug: string;
  propertyType?: 'residential' | 'commercial';
}

// ─────────────────────────────────────────────────────────────────────────────
// Filters passed to the API
// ─────────────────────────────────────────────────────────────────────────────

export interface PropertyFilters {
  propertyType?: 'residential' | 'commercial';
  /** Enum slug from enums.js — e.g. "gurgaon" */
  citySlug?: string;
  /** Enum slug from enums.js — e.g. "golf-course-road". Must belong to citySlug. */
  localitySlug?: string;
  /** Enum slug from enums.js — e.g. "dlf" */
  developerSlug?: string;
  /** Array of category UUIDs */
  categoryIds?: string[];
  /** Array of tag slugs — e.g. ['upcoming', 'featured'] */
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
  /** @deprecated use `sort` */
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// API response shape — matches what the backend always returns
// ─────────────────────────────────────────────────────────────────────────────

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  status?: string;
  propertyType: 'residential' | 'commercial';
  priceMin?: number | null;
  priceMax?: number | null;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  Developer?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  Location?: {
    id: string;
    name: string;
    slug: string;
  };
  /** Tags are always returned in listProperties responses after v2 */
  Tags?: TagShape[];
  /** Categories are returned when included */
  Categories?: CategoryShape[];
  /** Frontend-only convenience field added by data-fetching helpers */
  image?: string;
  /** First visible heroImage section’s `data.image`, when list API enriches rows */
  thumbnailUrl?: string | null;
  /** Typed facts (supplement JSONB sections) */
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqftMin?: number | null;
  areaSqftMax?: number | null;
  reraNumber?: string | null;
  possessionDate?: string | null;
  launchDate?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PropertyListResponse {
  data: PropertyItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Detailed entity shapes (for detail pages)
// ─────────────────────────────────────────────────────────────────────────────

export interface LocationDetail {
  id: string;
  name: string;
  slug: string;
  type: 'country' | 'state' | 'city' | 'locality' | 'sector';
  parentId?: string;
  parent?: { id: string; name: string; slug: string };
  propertiesCount?: number;
}

export interface DeveloperDetail {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  propertiesCount?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────────────────────

export interface FilterOptions {
  propertyTypes: Array<{ value: string; label: string; count: number }>;
  priceRange: { min: number; max: number };
  categories: Array<{ id: string; name: string; count: number }>;
  tags: Array<{ id: string; name: string; slug: string; count: number }>;
}

export interface SortOption {
  value: PropertyFilters['sort'];
  label: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
}
