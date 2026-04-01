/**
 * Property Filters Component
 * Provides UI for filtering by property type, price range, city, locality,
 * developer, and tags — driven by the backend enums.js definitions.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { PropertyFilters } from '@/types/property-listing';
import type { EnumCity, EnumLocality, EnumDeveloper } from '@/lib/api/properties-listing';
import type { Tag } from '@/lib/api/properties-listing';

export interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFilterChange: (filters: Partial<PropertyFilters>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  /** Context-locked filters (e.g. citySlug on a city page — hide that section) */
  contextFilters?: Partial<PropertyFilters>;
  /** Enum data fetched by PropertyListingTemplate */
  enumCities?: EnumCity[];
  enumLocalities?: EnumLocality[];
  enumDevelopers?: EnumDeveloper[];
  availableTags?: Tag[];
}

const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
];

const PRICE_RANGES = [
  { value: [0, 50], label: 'Under ₹50L' },
  { value: [50, 100], label: '₹50L – ₹1Cr' },
  { value: [100, 250], label: '₹1Cr – ₹2.5Cr' },
  { value: [250, 500], label: '₹2.5Cr – ₹5Cr' },
  { value: [500, Infinity], label: 'Above ₹5Cr' },
];

export function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  contextFilters = {},
  enumCities = [],
  enumLocalities = [],
  enumDevelopers = [],
  availableTags = [],
}: PropertyFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    propertyType: true,
    priceRange: true,
    city: true,
    locality: true,
    developer: true,
    tags: true,
  });

  const toggleSection = (section: string) =>
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const handlePropertyTypeChange = (type: string) =>
    onFilterChange({ propertyType: filters.propertyType === type ? undefined : type as 'residential' | 'commercial' });

  const handlePriceRangeChange = (range: [number, number]) =>
    onFilterChange({
      priceMin: range[0] * 10000000,
      priceMax: range[1] === Infinity ? undefined : range[1] * 10000000,
    });

  const handleCityChange = (slug: string) => {
    if (filters.citySlug === slug) {
      onFilterChange({ citySlug: undefined, localitySlug: undefined });
    } else {
      onFilterChange({ citySlug: slug, localitySlug: undefined });
    }
  };

  const handleLocalityChange = (slug: string) =>
    onFilterChange({ localitySlug: filters.localitySlug === slug ? undefined : slug });

  const handleDeveloperChange = (slug: string) =>
    onFilterChange({ developerSlug: filters.developerSlug === slug ? undefined : slug });

  const handleTagToggle = (slug: string) => {
    const current = filters.tags ?? [];
    onFilterChange({
      tags: current.includes(slug) ? current.filter(t => t !== slug) : [...current, slug],
    });
  };

  // Localities relevant to the currently-selected city (or context city)
  const activeCitySlug = filters.citySlug || contextFilters.citySlug;
  const filteredLocalities = activeCitySlug
    ? enumLocalities.filter(l => l.city === activeCitySlug)
    : enumLocalities;

  // Hide sections that are locked by context
  const showCity = !contextFilters.citySlug && enumCities.length > 0;
  const showLocality = !contextFilters.localitySlug && filteredLocalities.length > 0;
  const showDeveloper = !contextFilters.developerSlug && enumDevelopers.length > 0;
  const showTags = availableTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Filters</h2>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-gold hover:text-gold-dark transition-colors font-medium">
            Reset
          </button>
        )}
      </div>

      {/* Property Type */}
      <FilterSection title="Property Type" isExpanded={expandedSections.propertyType} onToggle={() => toggleSection('propertyType')}>
        <div className="space-y-3">
          {PROPERTY_TYPES.map(type => (
            <label key={type.value} className="flex items-center cursor-pointer group">
              <input type="checkbox" checked={filters.propertyType === type.value}
                onChange={() => handlePropertyTypeChange(type.value)}
                className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer" />
              <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">{type.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Tags */}
      {showTags && (
        <FilterSection title="Tags" isExpanded={expandedSections.tags} onToggle={() => toggleSection('tags')}>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const active = (filters.tags ?? []).includes(tag.slug);
              return (
                <button key={tag.slug} type="button" onClick={() => handleTagToggle(tag.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                    active ? 'bg-gold text-white border-gold' : 'bg-white text-zinc-600 border-zinc-300 hover:border-gold hover:text-gold'
                  }`}>
                  {tag.name}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* City */}
      {showCity && (
        <FilterSection title="City" isExpanded={expandedSections.city} onToggle={() => toggleSection('city')}>
          <div className="space-y-3">
            {enumCities.map(city => (
              <label key={city.slug} className="flex items-center cursor-pointer group">
                <input type="radio" name="citySlug" checked={filters.citySlug === city.slug}
                  onChange={() => handleCityChange(city.slug)}
                  className="w-4 h-4 border-gray-300 text-gold focus:ring-gold cursor-pointer" />
                <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">{city.label}</span>
              </label>
            ))}
            {filters.citySlug && (
              <button onClick={() => onFilterChange({ citySlug: undefined, localitySlug: undefined })}
                className="text-xs text-zinc-400 hover:text-red-400 transition mt-1">
                Clear city
              </button>
            )}
          </div>
        </FilterSection>
      )}

      {/* Locality (shown only when a city is selected/locked) */}
      {showLocality && (
        <FilterSection title="Locality" isExpanded={expandedSections.locality} onToggle={() => toggleSection('locality')}>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {filteredLocalities.map(loc => (
              <label key={loc.slug} className="flex items-center cursor-pointer group">
                <input type="radio" name="localitySlug" checked={filters.localitySlug === loc.slug}
                  onChange={() => handleLocalityChange(loc.slug)}
                  className="w-4 h-4 border-gray-300 text-gold focus:ring-gold cursor-pointer" />
                <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">{loc.label}</span>
              </label>
            ))}
            {filters.localitySlug && (
              <button onClick={() => onFilterChange({ localitySlug: undefined })}
                className="text-xs text-zinc-400 hover:text-red-400 transition mt-1">
                Clear locality
              </button>
            )}
          </div>
        </FilterSection>
      )}

      {/* Developer */}
      {showDeveloper && (
        <FilterSection title="Developer" isExpanded={expandedSections.developer} onToggle={() => toggleSection('developer')}>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {enumDevelopers.map(dev => (
              <label key={dev.slug} className="flex items-center cursor-pointer group">
                <input type="radio" name="developerSlug" checked={filters.developerSlug === dev.slug}
                  onChange={() => handleDeveloperChange(dev.slug)}
                  className="w-4 h-4 border-gray-300 text-gold focus:ring-gold cursor-pointer" />
                <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">{dev.label}</span>
              </label>
            ))}
            {filters.developerSlug && (
              <button onClick={() => onFilterChange({ developerSlug: undefined })}
                className="text-xs text-zinc-400 hover:text-red-400 transition mt-1">
                Clear developer
              </button>
            )}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range" isExpanded={expandedSections.priceRange} onToggle={() => toggleSection('priceRange')}>
        <div className="space-y-3">
          {PRICE_RANGES.map((range, index) => (
            <label key={index} className="flex items-center cursor-pointer group">
              <input type="radio" name="priceRange"
                checked={
                  filters.priceMin === range.value[0] * 10000000 &&
                  (range.value[1] === Infinity ? filters.priceMax === undefined : filters.priceMax === range.value[1] * 10000000)
                }
                onChange={() => handlePriceRangeChange(range.value as [number, number])}
                className="w-5 h-5 rounded-full border-gray-300 text-gold focus:ring-gold cursor-pointer" />
              <span className="ml-3 text-sm text-zinc-700 group-hover:text-black transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
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
      <button onClick={onToggle}
        className="w-full flex justify-between items-center py-2 hover:text-gold transition-colors group">
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-zinc-600 group-hover:text-gold transition-colors" />
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: isExpanded ? 'auto' : 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
        <div className="pt-4">{children}</div>
      </motion.div>
    </div>
  );
}
