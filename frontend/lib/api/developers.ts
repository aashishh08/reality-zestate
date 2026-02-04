/**
 * Developers API
 * Handles all developer-related API calls
 */

import { fetchFromAPI, buildQueryString } from '../api-client';

export interface DeveloperFilters {
  limit?: number;
  offset?: number;
}

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DevelopersResponse {
  data: Developer[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Get all developers
 */
export async function getDevelopers(
  filters?: DeveloperFilters,
  revalidate: number | false = 3600
): Promise<Developer[]> {
  const queryString = buildQueryString(filters);

  return fetchFromAPI<Developer[]>(
    `/developers${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );
}

/**
 * Get single developer by ID
 */
export async function getDeveloperById(
  id: string,
  revalidate: number | false = 3600
): Promise<Developer> {
  return fetchFromAPI<Developer>(
    `/developers/${id}`,
    {
      method: 'GET',
      next: {
        revalidate,
      },
    }
  );
}

/**
 * Get properties by developer
 */
export async function getDeveloperProperties(
  developerId: string,
  filters?: { limit?: number; offset?: number }
) {
  const queryString = buildQueryString(filters);

  return fetchFromAPI(
    `/developers/${developerId}/properties${queryString}`,
    {
      method: 'GET',
      next: {
        revalidate: 3600,
      },
    }
  );
}
