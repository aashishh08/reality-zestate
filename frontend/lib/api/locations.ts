/**
 * Locations API
 * Handles all location-related API calls (hierarchical)
 */

import { fetchFromAPI, buildQueryString } from '../api-client';

export interface LocationFilters {
  parentId?: string;
  type?: 'country' | 'state' | 'city' | 'locality' | 'sector';
  limit?: number;
  offset?: number;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: 'country' | 'state' | 'city' | 'locality' | 'sector';
  parentId?: string;
  /** Present on `type=locality` list responses (parent city for filters and corridor cards). */
  parent?: Pick<Location, 'id' | 'name' | 'slug' | 'type'>;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationsResponse {
  data: Location[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Get all locations with optional filters
 */
export async function getLocations(
  filters?: LocationFilters,
  revalidate: number | false = 3600
): Promise<LocationsResponse> {
  const queryString = buildQueryString(filters);

  return fetchFromAPI<LocationsResponse>(
    `/locations${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );
}

/**
 * Get single location by ID
 */
export async function getLocationById(
  id: string,
  revalidate: number | false = 3600
): Promise<Location> {
  return fetchFromAPI<Location>(
    `/locations/${id}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );
}

/**
 * Get properties in a location
 */
export async function getLocationProperties(
  locationId: string,
  filters?: { limit?: number; offset?: number }
) {
  const queryString = buildQueryString(filters);

  return fetchFromAPI(
    `/locations/${locationId}/properties${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate: 3600,
      },
    }
  );
}

/**
 * Get cities (locations with type: city)
 */
export async function getCities(
  filters?: Omit<LocationFilters, 'type'>
): Promise<LocationsResponse> {
  return getLocations({ ...filters, type: 'city' });
}

/**
 * Get localities under a city
 */
export async function getLocalitiesByCity(
  cityId: string,
  filters?: Omit<LocationFilters, 'parentId' | 'type'>
): Promise<LocationsResponse> {
  return getLocations({
    ...filters,
    parentId: cityId,
    type: 'locality',
  });
}
