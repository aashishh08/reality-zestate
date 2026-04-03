/**
 * Categories API
 * Handles all category-related API calls (hierarchical)
 */

import { fetchFromAPI, buildQueryString } from '../api-client';

export interface CategoryFilters {
  propertyType?: 'residential' | 'commercial';
  parentId?: string;
  limit?: number;
  offset?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  propertyType: 'residential' | 'commercial';
  parentId?: string;
  parent?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  data: Category[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Get all categories with optional filters
 */
export async function getCategories(
  filters?: CategoryFilters,
  revalidate: number | false = 3600
): Promise<CategoriesResponse> {
  const queryString = buildQueryString(filters);

  const raw = await fetchFromAPI<Category[] | CategoriesResponse>(
    `/categories${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );

  // Backend returns `{ success, data: Category[] }` without pagination; `normalizeResponse`
  // unwraps to a bare array. Callers expect `{ data, pagination }` (e.g. category pages).
  const data = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return {
    data,
    pagination: {
      limit: filters?.limit ?? data.length,
      offset: filters?.offset ?? 0,
      total: data.length,
    },
  };
}

/**
 * Get single category by ID
 */
export async function getCategoryById(
  id: string,
  revalidate: number | false = 3600
): Promise<Category> {
  return fetchFromAPI<Category>(
    `/categories/${id}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );
}

/**
 * Get properties in a category
 */
export async function getCategoryProperties(
  categoryId: string,
  filters?: { limit?: number; offset?: number }
) {
  const queryString = buildQueryString(filters);

  return fetchFromAPI(
    `/categories/${categoryId}/properties${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate: 3600,
      },
    }
  );
}

/**
 * Get residential categories
 */
export async function getResidentialCategories(
  filters?: Omit<CategoryFilters, 'propertyType'>
): Promise<CategoriesResponse> {
  return getCategories({
    ...filters,
    propertyType: 'residential',
  });
}

/**
 * Get commercial categories
 */
export async function getCommercialCategories(
  filters?: Omit<CategoryFilters, 'propertyType'>
): Promise<CategoriesResponse> {
  return getCategories({
    ...filters,
    propertyType: 'commercial',
  });
}

/**
 * Get subcategories under a parent category
 */
export async function getSubcategories(
  parentId: string,
  filters?: Omit<CategoryFilters, 'parentId'>
): Promise<CategoriesResponse> {
  return getCategories({
    ...filters,
    parentId,
  });
}
