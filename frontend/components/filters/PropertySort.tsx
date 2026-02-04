/**
 * Property Sort Component
 * Dropdown for sorting properties by different criteria
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PropertyFilters, SortOption } from '@/types/property-listing';

export interface PropertySortProps {
  sortOptions: SortOption[];
  currentSort: PropertyFilters['sortBy'];
  onSortChange: (sort: PropertyFilters['sortBy']) => void;
  compact?: boolean;
}

export function PropertySort({
  sortOptions,
  currentSort,
  onSortChange,
  compact = false,
}: PropertySortProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort By';

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 
          border border-zinc-300 rounded 
          hover:border-zinc-400 transition-colors
          bg-white text-left
          ${compact ? 'px-3 py-2 text-sm' : 'w-full sm:w-48 px-4 py-2.5'}
        `}
      >
        <span className="truncate">{currentLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-600 flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-zinc-300 rounded shadow-lg z-50"
            >
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-2.5 text-left transition-colors
                      ${
                        currentSort === option.value
                          ? 'bg-gold text-black font-medium'
                          : 'text-zinc-700 hover:bg-zinc-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
