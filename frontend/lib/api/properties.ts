/**
 * Properties API
 * Handles all property-related API calls
 */

import { fetchFromAPI, buildQueryString } from '../api-client';

export interface PropertyFilters {
  propertyType?: string;
  locationId?: string;
  developerId?: string;
  categoryIds?: string[];
  priceMin?: number;
  priceMax?: number;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  propertyType: 'residential' | 'commercial';
  priceMin: number;
  priceMax: number;
  isPublished: boolean;
  status?: 'draft' | 'published' | 'archived';

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
    type: string;
    parentId?: string;
  };

  Categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  PropertySections?: Array<{
    id: string;
    type: string;
    title: string;
    order: number;
    isVisible: boolean;
    data: Record<string, any>;
  }>;

  Tags?: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  }>;

  createdAt?: string;
  updatedAt?: string;
}

export interface PropertiesResponse {
  data: Property[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Get all properties with optional filters
 * Used for ISR pages with revalidation
 */
export async function getProperties(
  filters?: PropertyFilters,
  revalidate: number | false = 3600
): Promise<PropertiesResponse> {
  const queryString = buildQueryString(filters);

  return fetchFromAPI<PropertiesResponse>(
    `/properties${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );
}

/**
 * Get property by slug
 * Used for SSR pages (always fresh)
 */
export async function getPropertyBySlug(slug: string): Promise<Property> {
  return fetchFromAPI<Property>(
    `/properties/${slug}`,
    {
      method: 'GET',
      cache: 'no-store', // SSR: no caching
    }
  );
}

/**
 * Get properties by developer
 */
export async function getPropertiesByDeveloper(
  developerId: string,
  filters?: Omit<PropertyFilters, 'developerId'>
): Promise<PropertiesResponse> {
  return getProperties({ ...filters, developerId });
}

/**
 * Get properties by location
 */
export async function getPropertiesByLocation(
  locationId: string,
  filters?: Omit<PropertyFilters, 'locationId'>
): Promise<PropertiesResponse> {
  return getProperties({ ...filters, locationId });
}

/**
 * Get properties by category
 */
export async function getPropertiesByCategory(
  categoryId: string,
  filters?: Omit<PropertyFilters, 'categoryIds'>
): Promise<PropertiesResponse> {
  return getProperties({
    ...filters,
    categoryIds: [categoryId],
  });
}

/**
 * Create property (admin only)
 */
export async function createProperty(
  data: Partial<Property>,
  token: string
): Promise<Property> {
  return fetchFromAPI<Property>(
    '/properties',
    {
      method: 'POST',
      body: data,
      token,
    }
  );
}

/**
 * Update property (admin only)
 */
export async function updateProperty(
  id: string,
  data: Partial<Property>,
  token: string
): Promise<Property> {
  return fetchFromAPI<Property>(
    `/properties/${id}`,
    {
      method: 'PUT',
      body: data,
      token,
    }
  );
}

/**
 * Delete property (admin only)
 */
export async function deleteProperty(
  id: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  return fetchFromAPI(
    `/properties/${id}`,
    {
      method: 'DELETE',
      token,
    }
  );
}
