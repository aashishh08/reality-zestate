/**
 * Pagination Component
 * Handles page navigation for property listings
 */

'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Whether there's a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there's a previous page
   */
  hasPreviousPage: boolean;

  /**
   * Maximum number of page buttons to show (excluding prev/next)
   * @default 5
   */
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  maxVisiblePages = 5,
}: PaginationProps) {
  // Calculate visible page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap">
      {/* Previous Button */}
      <motion.button
        whileHover={hasPreviousPage ? { scale: 1.05 } : {}}
        whileTap={hasPreviousPage ? { scale: 0.95 } : {}}
        onClick={handlePreviousPage}
        disabled={!hasPreviousPage}
        className={`
          p-2 rounded border transition-colors
          ${
            hasPreviousPage
              ? 'border-zinc-300 hover:border-gold hover:text-gold text-zinc-700'
              : 'border-zinc-200 text-zinc-400 cursor-not-allowed'
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {/* First page button (if not visible) */}
        {startPage > 1 && (
          <>
            <PageButton
              page={1}
              isActive={currentPage === 1}
              onClick={() => onPageChange(1)}
            />
            {startPage > 2 && (
              <span className="px-2 text-zinc-500">...</span>
            )}
          </>
        )}

        {/* Page number buttons */}
        {pageNumbers.map(page => (
          <PageButton
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          />
        ))}

        {/* Last page button (if not visible) */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-zinc-500">...</span>
            )}
            <PageButton
              page={totalPages}
              isActive={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            />
          </>
        )}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={hasNextPage ? { scale: 1.05 } : {}}
        whileTap={hasNextPage ? { scale: 0.95 } : {}}
        onClick={handleNextPage}
        disabled={!hasNextPage}
        className={`
          p-2 rounded border transition-colors
          ${
            hasNextPage
              ? 'border-zinc-300 hover:border-gold hover:text-gold text-zinc-700'
              : 'border-zinc-200 text-zinc-400 cursor-not-allowed'
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Page Info */}
      <div className="w-full text-center text-sm text-zinc-600 mt-4">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <motion.button
      whileHover={!isActive ? { scale: 1.05 } : {}}
      whileTap={!isActive ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        w-10 h-10 rounded font-medium transition-colors
        ${
          isActive
            ? 'bg-gold text-black'
            : 'border border-zinc-300 text-zinc-700 hover:border-gold hover:text-gold'
        }
      `}
    >
      {page}
    </motion.button>
  );
}
