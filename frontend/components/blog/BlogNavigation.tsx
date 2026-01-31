'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { BlogCategory } from '@/types/blog';

interface BlogNavigationProps {
  categories: BlogCategory[];
  currentCategory?: string;
  currentTag?: string;
}

export default function BlogNavigation({ categories, currentCategory, currentTag }: BlogNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blogs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/blogs" 
              className="text-2xl font-playfair font-bold text-gray-900 hover:text-amber-700 transition-colors"
            >
              Blog
            </Link>
            
            {/* Desktop Categories */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/blogs"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !currentCategory 
                    ? 'bg-amber-100 text-amber-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blogs?category=${category.slug}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentCategory === category.slug
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setIsSearchOpen(false);
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Filter"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Categories */}
        <div className="md:hidden pb-4 overflow-x-auto">
          <div className="flex space-x-2">
            <Link
              href="/blogs"
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                !currentCategory 
                  ? 'bg-amber-100 text-amber-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blogs?category=${category.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  currentCategory === category.slug
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-700 hover:bg-gray-100'
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
