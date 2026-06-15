/**
 * Reusable Property Listing Template
 * Used for Location pages, Developer pages, Category pages, etc.
 *
 * Layout: sticky horizontal filter bar (status pills)
 * followed by a full-width 3-column property grid.
 * No sidebar — matches the reference design.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PropertyCard } from './ui/PropertyCard';
import { Pagination } from './ui/Pagination';
import { PropertyListResponse, PropertyFilters } from '@/types/property-listing';
import { Project } from '@/types';
import { fetchAllTags } from '@/lib/api/properties-listing';
import {
  STATUS_TAG_SLUGS,
  STATUS_TAG_DEFAULT_LABELS,
  type StatusTagSlug,
} from '@/lib/status-tags';
import {
  corridorEyebrow,
  corridorGoldRule,
  corridorHeading,
} from '@/components/location/micro-market/corridor-section-styles';
import { listingCardImageUrl } from '@/lib/listing-card-image';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PropertyListingTemplateProps {
  initialData: PropertyListResponse;
  onFetchProperties: (filters: PropertyFilters) => Promise<PropertyListResponse>;
  title: string;
  subtitle?: string;
  heroComponent?: React.ReactNode;
  /** Pre-locked filters (city page locks citySlug, developer page locks developerSlug, etc.) */
  contextFilters?: Partial<PropertyFilters>;
  itemsPerPage?: number;
  loadingSkeletonCount?: number;
  noResultsMessage?: string;
  /** Optional corridor-style block above the grid (inside the projects section). */
  projectsSection?: {
    eyebrow: string;
    title: string;
    viewAll?: { href: string; label: string };
    sectionClassName?: string;
  };
  /**
   * When true, show city + category dropdowns (e.g. /projects index).
   * Uses enum cities + category ids with `fetchProperties` / server actions.
   */
  showCityCategoryFilters?: boolean;
  cityOptions?: Array<{ slug: string; label: string }>;
  categoryOptions?: Array<{ id: string; slug: string; name: string }>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PropertyListingTemplate({
  initialData,
  onFetchProperties,
  heroComponent,
  contextFilters = {},
  itemsPerPage = 12,
  loadingSkeletonCount = 12,
  noResultsMessage = 'No properties found',
  projectsSection,
  showCityCategoryFilters = false,
  cityOptions = [],
  categoryOptions = [],
}: PropertyListingTemplateProps) {

  const [data, setData]       = useState<PropertyListResponse>(initialData);
  const [filters, setFilters] = useState<PropertyFilters>({
    ...contextFilters,
    limit: itemsPerPage,
    offset: 0,
  });
  /** Total count with no status-tag filter — "All (n)" must not use tag-filtered pagination.total */
  const [allTabTotal, setAllTabTotal] = useState(() => initialData.pagination?.total ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  /** Skip fetch on mount only — SSR already provided `initialData`. */
  const skipFetchUntilFilterChange = useRef(true);

  /** Four fixed pills (slugs); labels prefer DB names from admin when present. */
  const [statusPills, setStatusPills] = useState<
    { slug: StatusTagSlug; name: string }[]
  >(() =>
    STATUS_TAG_SLUGS.map((slug) => ({
      slug,
      name: STATUS_TAG_DEFAULT_LABELS[slug],
    })),
  );

  useEffect(() => {
    fetchAllTags()
      .then((tags) => {
        setStatusPills(
          STATUS_TAG_SLUGS.map((slug) => {
            const t = tags.find((x) => x.slug === slug);
            return {
              slug,
              name: t?.name?.trim() || STATUS_TAG_DEFAULT_LABELS[slug],
            };
          }),
        );
      })
      .catch(() => {});
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await onFetchProperties(filters);
      setData(result);
      if (!filters.tags?.length) {
        setAllTabTotal(result.pagination?.total ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [filters, onFetchProperties]);

  useEffect(() => {
    if (skipFetchUntilFilterChange.current) {
      skipFetchUntilFilterChange.current = false;
      return;
    }
    void fetchProperties();
  }, [filters, fetchProperties]);

  // ── Pagination ───────────────────────────────────────────────────────────────
  const pg = data?.pagination ?? { limit: 12, offset: 0, total: 0 };
  const pagination = {
    currentPage:     Math.floor((pg.offset ?? 0) / (pg.limit ?? 12)) + 1,
    totalPages:      Math.ceil((pg.total ?? 0) / (pg.limit ?? 12)),
    hasNextPage:     (pg.offset ?? 0) + (pg.limit ?? 12) < (pg.total ?? 0),
    hasPreviousPage: (pg.offset ?? 0) > 0,
    totalItems:      pg.total ?? 0,
  };

  // ── Derived active states ────────────────────────────────────────────────────
  const activeTagSlug = filters.tags?.length === 1 ? filters.tags[0] : 'all';

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleTagPill = (slug: string) => {
    setFilters(prev => ({
      ...prev,
      tags:   slug === 'all' ? undefined : [slug],
      offset: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, offset: (page - 1) * (pg.limit ?? 12) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      ...contextFilters,
      limit: itemsPerPage,
      offset: 0,
      tags: undefined,
      citySlug: contextFilters.citySlug,
      localitySlug: contextFilters.localitySlug,
      categoryIds: contextFilters.categoryIds,
      developerSlug: contextFilters.developerSlug,
      propertyType: contextFilters.propertyType,
    });
  };

  const hasActiveFilters = !!(
    filters.tags?.length ||
    (showCityCategoryFilters && filters.citySlug) ||
    (showCityCategoryFilters && (filters.categoryIds?.length ?? 0) > 0)
  );

  const handleCitySelect = (slug: string) => {
    if (!showCityCategoryFilters) return;
    setFilters((prev) => ({
      ...prev,
      citySlug: slug || undefined,
      localitySlug: undefined,
      offset: 0,
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    if (!showCityCategoryFilters) return;
    setFilters((prev) => ({
      ...prev,
      categoryIds: categoryId ? [categoryId] : undefined,
      offset: 0,
    }));
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      {heroComponent ? <>{heroComponent}</> : null}

      {/* ── Sticky Filter Bar ──────────────────────────────────────────────── */}
      <div className="sticky top-16 lg:top-20 z-40 bg-white border-b border-border shadow-[0_2px_20px_rgba(44,44,44,0.05)]">
        <div className="mx-auto flex max-w-[1400px] flex-col px-4 sm:px-6 md:px-12">
          <div className="flex min-h-[52px] items-center justify-between gap-3 py-0 sm:min-h-[56px] sm:gap-4">
            {/* Left — status pills */}
            <div className="flex min-w-0 flex-1 items-center gap-[3px] overflow-x-auto py-2 no-scrollbar">
              {/* All */}
              <button
                onClick={() => handleTagPill('all')}
                className={`flex-shrink-0 text-[11px] font-medium tracking-[0.1em] uppercase px-[18px] py-2 border transition-all duration-200 whitespace-nowrap ${
                  activeTagSlug === 'all'
                    ? 'bg-charcoal text-gold border-charcoal'
                    : 'bg-transparent text-muted-foreground border-border hover:border-gold hover:text-charcoal'
                }`}
              >
                All ({allTabTotal})
              </button>

              {/* Status tag pills — slugs match admin / `tags` table (see status-tags.ts) */}
              {statusPills.map((tag) => (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => handleTagPill(tag.slug)}
                  className={`flex-shrink-0 text-[11px] font-medium tracking-[0.1em] uppercase px-[18px] py-2 border transition-all duration-200 whitespace-nowrap ${
                    activeTagSlug === tag.slug
                      ? 'bg-charcoal text-gold border-charcoal'
                      : 'bg-transparent text-muted-foreground border-border hover:border-gold hover:text-charcoal'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            {/* Right — count + clear */}
            <div className="flex flex-shrink-0 items-center gap-2 py-2">
              <span className="hidden text-[11px] tracking-wide whitespace-nowrap text-muted-foreground/60 md:block">
                Showing {data.data.length} of {pagination.totalItems}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-1 text-[11px] tracking-wide whitespace-nowrap text-gold transition-colors hover:text-gold-dark"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {showCityCategoryFilters &&
            (cityOptions.length > 0 || categoryOptions.length > 0) && (
              <div className="flex flex-wrap items-center gap-3 border-t border-border py-3">
                {cityOptions.length > 0 && (
                  <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="hidden font-medium uppercase tracking-wide sm:inline">
                      City
                    </span>
                    <select
                      value={filters.citySlug ?? ''}
                      onChange={(e) => handleCitySelect(e.target.value)}
                      className="max-w-[200px] rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                      aria-label="Filter by city"
                    >
                      <option value="">All cities</option>
                      {cityOptions.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {categoryOptions.length > 0 && (
                  <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="hidden font-medium uppercase tracking-wide sm:inline">
                      Category
                    </span>
                    <select
                      value={filters.categoryIds?.[0] ?? ''}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="max-w-[220px] rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                      aria-label="Filter by category"
                    >
                      <option value="">All categories</option>
                      {categoryOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}
        </div>
      </div>

      {/* ── Projects Section ───────────────────────────────────────────────── */}
      <section
        id={projectsSection ? 'projects-section' : undefined}
        className={`w-full py-12 ${projectsSection?.sectionClassName ?? ''}`.trim()}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
        {projectsSection && (
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end">
            <div>
              <p className={`${corridorEyebrow} mb-3`}>{projectsSection.eyebrow}</p>
              <div className={`${corridorGoldRule} mb-4`} />
              <h2 className={corridorHeading}>{projectsSection.title}</h2>
            </div>
            {projectsSection.viewAll && (
              <Link
                href={projectsSection.viewAll.href}
                className="shrink-0 border-b border-gold pb-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark transition-colors hover:text-gold"
              >
                {projectsSection.viewAll.label}
              </Link>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200">
            <p className="text-red-900 text-sm font-medium">{error}</p>
            <button
              onClick={fetchProperties}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeletons — match card structure */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
            {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
              <div key={i} className="bg-white">
                <div className="h-[220px] bg-sand animate-pulse" />
                <div className="px-5 pt-4 pb-5 space-y-3">
                  <div className="h-2.5 bg-sand animate-pulse rounded w-1/4" />
                  <div className="h-5 bg-sand animate-pulse rounded w-3/4" />
                  <div className="h-2.5 bg-sand animate-pulse rounded w-1/2" />
                  <div className="h-10 bg-sand animate-pulse rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && data.data.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-base mb-4">{noResultsMessage}</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-[11px] font-medium tracking-[0.12em] uppercase text-gold hover:text-gold-dark transition-colors border border-gold px-6 py-2.5"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Property grid — 2px gap between cards (bg-border shows through) */}
        {!loading && data.data.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border">
            {data.data.map((property, index) => {
              const projectData: Project = {
                id:           property.id,
                slug:         property.slug,
                title:        property.title,
                propertyType: property.propertyType,
                priceMin:     property.priceMin ?? undefined,
                priceMax:     property.priceMax ?? undefined,
                isPublished:  true,
                image:        listingCardImageUrl(property),
                location:     property.Location?.name ?? '',
                price:        undefined,
                category:     'Trending' as const,
                Developer:    property.Developer,
                Location:     property.Location
                  ? { ...property.Location, type: 'city' as const }
                  : undefined,
                Tags:       property.Tags,
                Categories: property.Categories,
              };
              return (
                <PropertyCard
                  key={property.id}
                  project={projectData}
                  index={index}
                  imageSizes="(max-width: 1024px) 50vw, 33vw"
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && data.data.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
            />
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
