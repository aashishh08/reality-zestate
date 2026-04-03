'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { BlogCategory } from '@/types/blog';

interface BlogNavigationProps {
  categories: BlogCategory[];
  currentCategory?: string;
  currentTag?: string;
}

export default function BlogNavigation({ categories, currentCategory }: BlogNavigationProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        if (!searchQuery) setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blogs?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const closeSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm" aria-label="Blog navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main bar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Left: Blog title + Desktop category pills */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Link
              href="/blogs"
              className="text-xl sm:text-2xl font-serif font-bold text-gray-900 hover:text-amber-700 transition-colors shrink-0"
            >
              Blog
            </Link>

            {/* Desktop Categories (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-1 flex-wrap">
              <Link
                href="/blogs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  !currentCategory
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blogs?category=${category.slug}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentCategory === category.slug
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search */}
          <div ref={searchContainerRef} className="flex items-center shrink-0">
            {/* Expandable search — desktop: w-56 inline; mobile: expands full-width overlay */}
            <div
              className={`flex items-center transition-all duration-300 ${
                isSearchOpen
                  ? 'w-[calc(100vw-2rem)] sm:w-72 absolute left-4 right-4 sm:relative sm:left-auto sm:right-auto'
                  : 'w-8'
              }`}
            >
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center w-full bg-white border border-amber-400 rounded-xl shadow-md overflow-hidden">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles…"
                    className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent min-w-0"
                    aria-label="Search blog articles"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-amber-600 hover:text-amber-800 transition-colors shrink-0"
                    aria-label="Submit search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile category scroll strip (hidden on md+) ──────────── */}
        <div className="md:hidden pb-3 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 w-max">
            <Link
              href="/blogs"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !currentCategory
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blogs?category=${category.slug}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  currentCategory === category.slug
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
