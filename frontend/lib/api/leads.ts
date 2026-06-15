/**
 * Leads API
 * Handles all lead-related API calls (CRM pipeline)
 */

import { fetchFromAPI, buildQueryString } from '../api-client';

export interface LeadFilters {
  limit?: number;
  offset?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source?: string;
  propertyId?: string;
  /** True when the lead came from Residences → Download Layout */
  layoutDownload?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadsResponse {
  data: Lead[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Create lead (public endpoint, no auth required)
 * Used for contact forms and property inquiries
 */
export async function createLead(data: {
  name: string;
  email: string;
  phone: string;
  source?: string;
  propertyId?: string;
  layoutDownload?: boolean;
}): Promise<Lead> {
  return fetchFromAPI<Lead>(
    '/leads',
    {
      method: 'POST',
      body: data,
    }
  );
}

/**
 * Get all leads (admin only)
 */
export async function getLeads(
  filters?: LeadFilters,
  token?: string
): Promise<LeadsResponse> {
  const queryString = buildQueryString(filters);

  return fetchFromAPI<LeadsResponse>(
    `/leads${queryString}`,
    {
      method: 'GET',
      token,
      next: {
        revalidate: false, // Always fresh for admin
      },
    }
  );
}

/**
 * Update lead status (admin only)
 */
export async function updateLeadStatus(
  id: string,
  status: Lead['status'],
  token: string
): Promise<Lead> {
  return fetchFromAPI<Lead>(
    `/leads/${id}/status`,
    {
      method: 'PUT',
      body: { status },
      token,
    }
  );
}

/**
 * Update lead (admin only)
 */
export async function updateLead(
  id: string,
  data: Partial<Lead>,
  token: string
): Promise<Lead> {
  return fetchFromAPI<Lead>(
    `/leads/${id}`,
    {
      method: 'PUT',
      body: data,
      token,
    }
  );
}
