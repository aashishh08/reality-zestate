/**
 * Property Filters Component
 * Provides UI for filtering by property type, price range, etc.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { PropertyFilters } from '@/types/property-listing';

export interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFilterChange: (filters: Partial<PropertyFilters>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
];

const PRICE_RANGES = [
  { value: [0, 50], label: 'Under ₹50L' },
  { value: [50, 100], label: '₹50L - ₹1Cr' },
  { value: [100, 250], label: '₹1Cr - ₹2.5Cr' },
  { value: [250, 500], label: '₹2.5Cr - ₹5Cr' },
  { value: [500, Infinity], label: 'Above ₹5Cr' },
];

export function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: PropertyFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    propertyType: true,
    priceRange: true,
    location: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePropertyTypeChange = (type: string) => {
    if (filters.propertyType === type) {
      onFilterChange({ propertyType: undefined });
    } else {
      onFilterChange({ propertyType: type as 'residential' | 'commercial' });
    }
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    onFilterChange({
      priceMin: range[0] * 10000000, // Convert to actual value (₹50L = 5Cr)
      priceMax: range[1] === Infinity ? undefined : range[1] * 10000000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gold hover:text-gold-dark transition-colors font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* Property Type Filter */}
      <FilterSection
        title="Property Type"
        isExpanded={expandedSections.propertyType}
        onToggle={() => toggleSection('propertyType')}
      >
        <div className="space-y-3">
          {PROPERTY_TYPES.map(type => (
            <label key={type.value} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.propertyType === type.value}
                onChange={() => handlePropertyTypeChange(type.value)}
                className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
              />
              <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.priceRange}
        onToggle={() => toggleSection('priceRange')}
      >
        <div className="space-y-3">
          {PRICE_RANGES.map((range, index) => (
            <label key={index} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceMin === range.value[0] * 10000000 &&
                  (range.value[1] === Infinity
                    ? filters.priceMax === undefined
                    : filters.priceMax === range.value[1] * 10000000)
                }
                onChange={() => handlePriceRangeChange(range.value as [number, number])}
                className="w-5 h-5 rounded-full border-gray-300 text-gold focus:ring-gold cursor-pointer"
              />
              <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Additional filters can be added here */}
      {/* - Location
          - Amenities
          - Status (Ready to Move, Under Construction, etc.)
          - Bedrooms/Configuration
      */}
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-zinc-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-2 hover:text-gold transition-colors group"
      >
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-zinc-600 group-hover:text-gold transition-colors" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pt-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
