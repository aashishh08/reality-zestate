const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectionPayload {
    type: string;
    title: string;
    order?: number;
    isVisible?: boolean;
    data: Record<string, unknown>;
}

export interface CreatePropertyFullPayload {
    // Core
    slug: string;
    title: string;
    propertyType: 'residential' | 'commercial';
    // Enum slugs (validated server-side against enums.js)
    citySlug?: string | null;
    localitySlug?: string | null;
    sublocality?: string | null;
    developerSlug?: string | null;
    status?: string;
    priceMin?: number | null;
    priceMax?: number | null;
    isPublished?: boolean;
    seoTitle?: string | null;
    h1Heading?: string | null;
    metaDescription?: string | null;
    // Relational
    tagSlugs?: string[];
    categorySlugs?: string[];
    // Sections
    sections?: SectionPayload[];
}

export interface AdminProperty {
    id: string;
    slug: string;
    title: string;
    propertyType: 'residential' | 'commercial';
    status: string;
    citySlug?: string | null;
    localitySlug?: string | null;
    sublocality?: string | null;
    developerSlug?: string | null;
    priceMin: number | null;
    priceMax: number | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    PropertySections?: { id: string; type: string }[];
}

export interface CreatePropertyFullResult {
    property: { id: string; slug: string; title: string; isPublished: boolean };
    sectionsCreated: number;
    sectionTypes: string[];
    tagsApplied: string[];
    categoriesApplied: string[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function authFetch<T>(
    path: string,
    token: string,
    options: RequestInit = {},
): Promise<{ success: boolean; data: T; message?: string; pagination?: { total: number; limit: number; offset: number } }> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
    return json;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** Create a new property together with all its sections, tags and categories. */
export async function createPropertyFull(
    payload: CreatePropertyFullPayload,
    token: string,
): Promise<{ success: boolean; data: CreatePropertyFullResult; message: string }> {
    return authFetch<CreatePropertyFullResult>('/properties/full', token, {
        method: 'POST',
        body: JSON.stringify(payload),
    }) as Promise<{ success: boolean; data: CreatePropertyFullResult; message: string }>;
}

/** List all properties for the admin panel (includes Developer, Location, section count). */
export async function listAdminProperties(
    token: string,
    filters: { isPublished?: boolean; propertyType?: string; limit?: number; offset?: number } = {},
): Promise<{ properties: AdminProperty[]; total: number }> {
    const params = new URLSearchParams();
    if (filters.isPublished !== undefined) params.set('isPublished', String(filters.isPublished));
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const qs = params.toString();
    const result = await authFetch<AdminProperty[]>(`/properties/admin${qs ? `?${qs}` : ''}`, token);
    return { properties: result.data, total: result.pagination?.total ?? result.data.length };
}

/** Delete a property by ID. */
export async function deleteAdminProperty(id: string, token: string): Promise<void> {
    await authFetch(`/properties/${id}`, token, { method: 'DELETE' });
}

/** Toggle published state. */
export async function togglePublishProperty(
    id: string,
    isPublished: boolean,
    token: string,
): Promise<void> {
    await authFetch(`/properties/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ isPublished }),
    });
}

/** Fetch a single property by ID with all sections, tags, and categories (for edit form). */
export async function fetchAdminPropertyById(
    id: string,
    token: string,
): Promise<{
    id: string; slug: string; title: string;
    propertyType: 'residential' | 'commercial';
    status: string; priceMin: number | null; priceMax: number | null;
    isPublished: boolean;
    citySlug?: string | null;
    localitySlug?: string | null;
    sublocality?: string | null;
    developerSlug?: string | null;
    seoTitle?: string | null;
    h1Heading?: string | null;
    metaDescription?: string | null;
    Tags?: { id: string; name: string; slug: string }[];
    Categories?: { id: string; name: string; slug: string }[];
    PropertySections?: { id: string; type: string; title: string; order: number; isVisible: boolean; data: Record<string, any> }[];
}> {
    const result = await authFetch<any>(`/properties/admin/${id}`, token);
    return result.data;
}

/** Atomic full property update: core fields + all sections + tags + categories. */
export async function updatePropertyFull(
    id: string,
    payload: CreatePropertyFullPayload,
    token: string,
): Promise<{ success: boolean; data: any; message: string }> {
    return authFetch<any>(`/properties/full/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(payload),
    }) as Promise<{ success: boolean; data: any; message: string }>;
}


// ─── Reference data (tags / categories) ──────────────────────────────────────

export interface RefTag { id: string; name: string; slug: string }
export interface RefCategory { id: string; name: string; slug: string }

// ─── Enum types (from GET /enums) ────────────────────────────────────────────
export interface EnumCity     { slug: string; label: string }
export interface EnumLocality { slug: string; label: string; city: string }
export interface EnumDeveloper{ slug: string; label: string }

export interface EnumsData {
    cities: EnumCity[];
    localities: EnumLocality[];
    developers: EnumDeveloper[];
}

async function publicFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load');
    return json;
}

/**
 * Fetch the enum lists (cities, localities, developers) from the backend.
 * Pass a citySlug to get only localities that belong to that city.
 */
export async function fetchEnums(citySlug?: string): Promise<EnumsData> {
    const qs = citySlug ? `?city=${encodeURIComponent(citySlug)}` : '';
    const json = await publicFetch<{ success: boolean; data: EnumsData }>(`/enums${qs}`);
    return (json as any).data;
}

export async function fetchTags(): Promise<RefTag[]> {
    const json = await publicFetch<{ data?: RefTag[] } | RefTag[]>('/tags?limit=200');
    if (Array.isArray(json)) return json;
    if ((json as any).data) return (json as any).data;
    return json as RefTag[];
}

export async function fetchCategories(): Promise<RefCategory[]> {
    const json = await publicFetch<{ data?: RefCategory[] } | RefCategory[]>('/categories?limit=200');
    if (Array.isArray(json)) return json;
    if ((json as any).data) return (json as any).data;
    return json as RefCategory[];
}
