/**
 * Property Listing API Functions
 * Helper functions for fetching properties with filters
 */

import { fetchFromAPI, buildQueryString } from '../api-client';
import { PropertyListResponse, PropertyFilters } from '@/types/property-listing';

/**
 * Fetch properties for a location
 */
export async function fetchLocationProperties(
  locationId: string,
  filters?: Omit<PropertyFilters, 'locationId'>
): Promise<PropertyListResponse> {
  const queryParams = buildQueryString({
    locationId,
    ...filters,
  });

  const response = await fetchFromAPI<any>(`/properties${queryParams}`);
  
  // DEBUG: Log what we received from backend
  console.log('[DEBUG] Raw backend response:', JSON.stringify({
    isArray: Array.isArray(response),
    hasData: !!response?.data,
    hasPagination: !!response?.pagination,
    responseKeys: Array.isArray(response) ? 'is array' : Object.keys(response || {}),
  }, null, 2));
  
  // Ensure response has the correct structure
  const result: PropertyListResponse = {
    data: Array.isArray(response) ? response : (response?.data || []),
    pagination: response?.pagination || {
      limit: filters?.limit || 12,
      offset: filters?.offset || 0,
      total: Array.isArray(response) ? response.length : (response?.pagination?.total || 0),
    },
  };
  
  console.log('[DEBUG] Returning normalized response:', {
    dataLength: result.data.length,
    pagination: result.pagination,
  });
  
  return result;
}

/**
 * Fetch properties for a developer
 */
export async function fetchDeveloperProperties(
  developerId: string,
  filters?: Omit<PropertyFilters, 'developerId'>
): Promise<PropertyListResponse> {
  const queryParams = buildQueryString({
    developerId,
    ...filters,
  });

  const response = await fetchFromAPI<any>(`/properties${queryParams}`);
  
  // Ensure response has the correct structure
  return {
    data: Array.isArray(response) ? response : (response?.data || []),
    pagination: response?.pagination || {
      limit: filters?.limit || 12,
      offset: filters?.offset || 0,
      total: Array.isArray(response) ? response.length : (response?.pagination?.total || 0),
    },
  };
}

/**
 * Fetch properties for a category
 */
export async function fetchCategoryProperties(
  categoryId: string,
  filters?: Omit<PropertyFilters, 'categoryId'>
): Promise<PropertyListResponse> {
  const queryParams = buildQueryString({
    categoryId,
    ...filters,
  });

  return fetchFromAPI<PropertyListResponse>(`/properties${queryParams}`);
}

/**
 * Generic fetch properties function
 * Can be used for any combination of filters
 */
export async function fetchProperties(
  filters: PropertyFilters
): Promise<PropertyListResponse> {
  const queryParams = buildQueryString(filters);
  
  const response = await fetchFromAPI<any>(`/properties${queryParams}`);
  
  // Ensure response has the correct structure
  return {
    data: Array.isArray(response) ? response : (response?.data || []),
    pagination: response?.pagination || {
      limit: filters.limit || 12,
      offset: filters.offset || 0,
      total: Array.isArray(response) ? response.length : (response?.pagination?.total || 0),
    },
  };
}

/**
 * Fetch location details
 */
export async function fetchLocationDetail(slug: string) {
  return fetchFromAPI(`/locations?slug=${slug}`);
}

/**
 * Fetch developer details
 */
export async function fetchDeveloperDetail(slug: string) {
  return fetchFromAPI(`/developers?slug=${slug}`);
}

/**
 * Fetch category details
 */
export async function fetchCategoryDetail(slug: string) {
  return fetchFromAPI(`/categories?slug=${slug}`);
}

/**
 * Get location by slug for generateStaticParams
 */
export async function getLocationBySlug(slug: string) {
  try {
    const response = await fetchFromAPI(`/locations?slug=${slug}`);
    
    console.log(`[DEBUG] getLocationBySlug(${slug}):`, {
      responseType: typeof response,
      isArray: Array.isArray(response),
      arrayLength: Array.isArray(response) ? response.length : 'N/A',
    });
    
    // The API client already extracts data.data, so response is already the inner data
    
    if (Array.isArray(response)) {
      // Search for the location with matching slug
      const location = response.find((loc: any) => loc.slug === slug);
      if (location) {
        console.log(`[DEBUG] Found matching location with slug: ${slug}`, location);
        return location;
      }
      
      // If no exact match and array has items, warn but return first
      if (response.length > 0) {
        console.warn(`[WARN] No location with slug "${slug}" found in array. Backend may not be filtering correctly.`);
        console.log(`[DEBUG] Available slugs:`, response.map((l: any) => l.slug));
        // Don't return first item - return null instead so page shows 404
        // This helps identify backend filtering issues
        return null;
      }
    } else if (response && typeof response === 'object') {
      // If it's a direct object
      if (response.slug === slug) {
        console.log(`[DEBUG] Returning direct object with matching slug: ${slug}`);
        return response;
      }
      
      // If slug doesn't match, it's an error
      if (response.name) {
        console.warn(`[WARN] Got object with slug "${response.slug}" but expected "${slug}"`);
        return null;
      }
    }
    
    console.warn(`No location found for slug: ${slug}`);
    return null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

/**
 * Get developer by slug for generateStaticParams
 */
export async function getDeveloperBySlug(slug: string) {
  try {
    const response = await fetchFromAPI(`/developers?slug=${slug}`);
    
    console.log(`[DEBUG] getDeveloperBySlug(${slug}):`, {
      responseType: typeof response,
      isArray: Array.isArray(response),
      arrayLength: Array.isArray(response) ? response.length : 'N/A',
    });
    
    // The API client already extracts data.data
    
    if (Array.isArray(response)) {
      // Search for the developer with matching slug
      const developer = response.find((dev: any) => dev.slug === slug);
      if (developer) {
        console.log(`[DEBUG] Found matching developer with slug: ${slug}`, developer);
        return developer;
      }
      
      // If no exact match and array has items, warn
      if (response.length > 0) {
        console.warn(`[WARN] No developer with slug "${slug}" found in array. Backend may not be filtering correctly.`);
        console.log(`[DEBUG] Available slugs:`, response.map((d: any) => d.slug));
        return null;
      }
    } else if (response && typeof response === 'object') {
      // If it's a direct object
      if (response.slug === slug) {
        console.log(`[DEBUG] Returning direct object with matching slug: ${slug}`);
        return response;
      }
      
      // If slug doesn't match, it's an error
      if (response.name) {
        console.warn(`[WARN] Got object with slug "${response.slug}" but expected "${slug}"`);
        return null;
      }
    }
    
    console.warn(`No developer found for slug: ${slug}`);
    return null;
  } catch (error) {
    console.error('Error fetching developer:', error);
    return null;
  }
}

/**
 * Get all location slugs for generateStaticParams
 */
export async function getAllLocationSlugs() {
  try {
    const response = await fetchFromAPI('/locations?type=city&limit=100');
    if (Array.isArray(response.data)) {
      return response.data.map((loc: any) => loc.slug).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error fetching location slugs:', error);
    return [];
  }
}

/**
 * Get all developer slugs for generateStaticParams
 */
export async function getAllDeveloperSlugs() {
  try {
    const response = await fetchFromAPI('/developers?limit=100');
    if (Array.isArray(response.data)) {
      return response.data.map((dev: any) => dev.slug).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error fetching developer slugs:', error);
    return [];
  }
}
