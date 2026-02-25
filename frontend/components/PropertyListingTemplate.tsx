/**
 * Reusable Property Listing Template
 * Used for Location pages, Developer pages, Category pages, etc.
 * Handles filtering, sorting, pagination, and property display
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { PropertyCard } from './ui/PropertyCard';
import { PropertyFilters as PropertyFiltersComponent } from './filters/PropertyFilters';
import { PropertySort } from './filters/PropertySort';
import { Pagination } from './ui/Pagination';
import { PropertyListResponse, PropertyFilters, SortOption } from '@/types/property-listing';
import { Project } from '@/types';

export interface PropertyListingTemplateProps {
  /**
   * Initial properties and pagination data
   */
  initialData: PropertyListResponse;

  /**
   * Function to fetch properties with filters
   * Should return PropertyListResponse
   */
  onFetchProperties: (filters: PropertyFilters) => Promise<PropertyListResponse>;

  /**
   * Page title (e.g., "Properties in Delhi")
   */
  title: string;

  /**
   * Page subtitle (e.g., "Discover amazing properties")
   */
  subtitle?: string;

  /**
   * Hero section component
   */
  heroComponent?: React.ReactNode;

  /**
   * Available sort options
   */
  sortOptions?: SortOption[];

  /**
   * Show/hide filter sidebar
   * @default true
   */
  showFilters?: boolean;

  /**
   * Pre-applied filters (context-aware)
   * For example, location pages should have locationId pre-applied
   */
  contextFilters?: Partial<PropertyFilters>;

  /**
   * Items per page
   * @default 12
   */
  itemsPerPage?: number;

  /**
   * Loading skeleton count
   * @default 12
   */
  loadingSkeletonCount?: number;

  /**
   * No results message
   * @default "No properties found"
   */
  noResultsMessage?: string;
}

export function PropertyListingTemplate({
  initialData,
  onFetchProperties,
  title,
  subtitle,
  heroComponent,
  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
  ],
  showFilters = true,
  contextFilters = {},
  itemsPerPage = 12,
  loadingSkeletonCount = 12,
  noResultsMessage = 'No properties found',
}: PropertyListingTemplateProps) {
  // State management
  const [data, setData] = useState<PropertyListResponse>(initialData);
  const [filters, setFilters] = useState<PropertyFilters>({
    ...contextFilters,
    limit: itemsPerPage,
    offset: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch properties when filters change
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await onFetchProperties(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, onFetchProperties]);

  // Fetch when filters change
  useEffect(() => {
    // Don't fetch on initial render since we have initialData
    if (JSON.stringify(filters) !== JSON.stringify({ ...contextFilters, limit: itemsPerPage, offset: 0 })) {
      fetchProperties();
    }
  }, [filters, fetchProperties, contextFilters, itemsPerPage]);

  // Calculate pagination state with safety checks
  const paginationData = data?.pagination || { limit: 12, offset: 0, total: 0 };

  const pagination = {
    currentPage: Math.floor((paginationData.offset || 0) / (paginationData.limit || 12)) + 1,
    totalPages: Math.ceil((paginationData.total || 0) / (paginationData.limit || 12)),
    hasNextPage: (paginationData.offset || 0) + (paginationData.limit || 12) < (paginationData.total || 0),
    hasPreviousPage: (paginationData.offset || 0) > 0,
    totalItems: paginationData.total || 0,
  };

  // Handlers
  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset to first page when filters change
    }));
  };

  const handleSortChange = (sortBy: PropertyFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      offset: 0, // Reset to first page when sorting changes
    }));
  };

  const handlePageChange = (page: number) => {
    const limit = data?.pagination?.limit || 12;
    const offset = (page - 1) * limit;
    setFilters(prev => ({
      ...prev,
      offset,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      ...contextFilters,
      limit: itemsPerPage,
      offset: 0,
    });
  };

  // Check if filters are applied (excluding context filters)
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'limit' || key === 'offset' || key === 'sortBy') return false;
    const contextValue = contextFilters[key as keyof PropertyFilters];
    return value !== undefined && value !== contextValue;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {heroComponent && <>{heroComponent}</>}

      {/* Page Title */}
      <section className="border-b border-zinc-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-black mb-2">{title}</h1>
          {subtitle && <p className="text-zinc-600">{subtitle}</p>}
          <p className="text-sm text-zinc-500 mt-4">
            Showing {data.data.length} of {pagination.totalItems} properties
          </p>
        </div>
      </section>

      {/* Filters and Listings */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop) */}
          {showFilters && (
            <div className="hidden lg:block">
              <PropertyFiltersComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter & Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:hidden">
              {showFilters && (
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="ml-2 px-2 py-0.5 bg-gold text-black text-xs rounded">
                      Active
                    </span>
                  )}
                </button>
              )}

              <PropertySort
                sortOptions={sortOptions}
                currentSort={filters.sortBy || 'newest'}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Desktop Sort & Filter Bar */}
            <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-700">Sort by:</span>
                <PropertySort
                  sortOptions={sortOptions}
                  currentSort={filters.sortBy || 'newest'}
                  onSortChange={handleSortChange}
                  compact
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-900 text-sm font-medium">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Try again
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
                  <div key={i} className="bg-zinc-200 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && data.data.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="inline-block p-12 bg-zinc-50 rounded-lg">
                  <p className="text-zinc-600 text-lg mb-4">{noResultsMessage}</p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-gold hover:text-gold-dark font-medium transition-colors"
                    >
                      Try clearing filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Property Grid */}
            <AnimatePresence>
              {!loading && data.data.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.data.map((property, index) => {
                    // Convert API property to Project type for PropertyCard
                    const projectData: Project = {
                      id: property.id,
                      slug: property.slug,
                      title: property.title,
                      propertyType: property.propertyType,
                      priceMin: property.priceMin ?? undefined,
                      priceMax: property.priceMax ?? undefined,
                      isPublished: true,
                      image: property.image || '/images/placeholder.jpg',
                      location: property.Location?.name || 'Unknown',
                      price: property.priceMin && property.priceMax
                        ? `₹${property.priceMin.toLocaleString('en-IN')} - ₹${property.priceMax.toLocaleString('en-IN')}`
                        : 'Price on Request',
                      category: 'Trending' as const,
                      Developer: property.Developer,
                      Location: property.Location ? { ...property.Location, type: 'city' } : undefined,
                      Categories: (property as any).Categories,
                      Tags: (property as any).Tags,
                    };

                    return (
                      <PropertyCard
                        key={property.id}
                        project={projectData}
                        index={index}
                      />
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

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
        </div>
      </section>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              onClick={e => e.stopPropagation()}
              className="fixed left-0 top-0 h-full w-80 bg-white overflow-y-auto z-50"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-zinc-100 rounded transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <PropertyFiltersComponent
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters);
                    setShowMobileFilters(false);
                  }}
                  onClearFilters={handleClearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
