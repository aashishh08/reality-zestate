/**
 * Types for property listing, filtering, and pagination
 */

export interface PropertyFilters {
  propertyType?: 'residential' | 'commercial';
  locationId?: string;
  developerId?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  limit?: number;
  offset?: number;
}

export interface PropertyListResponse {
  data: Array<{
    id: string;
    slug: string;
    title: string;
    propertyType: 'residential' | 'commercial';
    priceMin: number;
    priceMax: number;
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
    image?: string;
    createdAt?: string;
  }>;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface LocationDetail {
  id: string;
  name: string;
  slug: string;
  type: 'country' | 'state' | 'city' | 'locality' | 'sector';
  parentId?: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
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

export interface FilterOptions {
  propertyTypes: Array<{ value: string; label: string; count: number }>;
  priceRange: { min: number; max: number };
  categories: Array<{ id: string; name: string; count: number }>;
}

export interface SortOption {
  value: PropertyFilters['sortBy'];
  label: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
}
