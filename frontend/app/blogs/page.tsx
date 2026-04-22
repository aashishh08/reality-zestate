import { Metadata } from 'next';
import { getBlogs } from '@/lib/api/blogs';
import { LeadPopup } from '@/components/ui/LeadPopup';
import BlogNavigation from '@/components/blog/BlogNavigation';
import BlogCard from '@/components/blog/BlogCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewTabLink } from '@/components/ui/NewTabLink';

type SearchParamsShape = {
  category?: string;
  tag?: string;
  search?: string;
  page?: string;
};

interface BlogPageProps {
  searchParams: Promise<SearchParamsShape> | SearchParamsShape;
}

const OG_FALLBACK_IMAGE = 'https://superluxere.com/images/luxury-living.jpg';

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(searchParams);
  const search = resolvedParams?.search;

  let title = 'Blog - Luxury Real Estate Insights & Guides';
  let description = 'Explore expert insights, market trends, and guides on luxury real estate in India. Stay updated with the latest in premium properties and investment opportunities.';

  if (search) {
    title = `Search Results for "${search}" - Blog`;
    description = `Find articles related to "${search}" on luxury real estate, property investment, and market insights.`;
  }

  return {
    title,
    description,
    keywords: ['luxury real estate blog', 'real estate insights India', 'property investment guide', 'luxury properties Gurgaon', 'real estate market trends'],
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://superluxere.com/blogs',
      locale: 'en_IN',
      siteName: 'Superluxere',
      images: [{ url: OG_FALLBACK_IMAGE, width: 1200, height: 630, alt: 'Superluxere Luxury Real Estate Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_FALLBACK_IMAGE],
    },
    alternates: {
      canonical: 'https://superluxere.com/blogs',
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Next.js 15+: searchParams is a Promise; await it before use
  const resolvedParams: SearchParamsShape = await Promise.resolve(searchParams);
  const searchParamsObj: SearchParamsShape = {
    ...(resolvedParams?.category ? { category: String(resolvedParams.category) } : {}),
    ...(resolvedParams?.tag ? { tag: String(resolvedParams.tag) } : {}),
    ...(resolvedParams?.search ? { search: String(resolvedParams.search) } : {}),
    ...(resolvedParams?.page ? { page: String(resolvedParams.page) } : {}),
  };

  const page = parseInt(searchParamsObj.page || '1');
  const pageSize = 9;

  const blogResponse = await getBlogs(
    {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      search: searchParamsObj.search,
    },
    60
  ).catch(() => ({ data: [], pagination: { total: 0, limit: pageSize, offset: 0 } }));

  const posts = blogResponse.data || [];
  const total = blogResponse.pagination?.total || 0;
  const totalPages = Math.ceil(total / pageSize);
  const hasPosts = posts.length > 0;

  // Categories are not available from new API yet, using empty array
  const categories: any[] = [];

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Blog sub-navigation + rest of page (offset for fixed header) */}
      <div className="pt-16 lg:pt-20">
        <BlogNavigation
          categories={categories}
          currentCategory={searchParamsObj.category}
          currentTag={searchParamsObj.tag}
        />

      {/* Hero Section */}
      <section className="bg-linear-to-r from-amber-50 to-orange-50 py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {searchParamsObj.search
              ? `Search Results for "${searchParamsObj.search}"`
              : searchParamsObj.category
                ? categories.find(c => c.slug === searchParamsObj.category)?.name || 'Blog'
                : 'Luxury Real Estate Insights'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {searchParamsObj.search
              ? `Found ${total} article${total !== 1 ? 's' : ''} matching your search`
              : 'Expert insights, market trends, and guides to help you navigate the world of luxury real estate'}
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {hasPosts ? (
          <>
            {/* Featured Post (first post on first page) */}
            {page === 1 && !searchParamsObj.category && !searchParamsObj.tag && !searchParamsObj.search && (
              <div className="mb-8 sm:mb-12 lg:mb-16">
                <BlogCard post={posts[0]} featured priority />
              </div>
            )}

            {/* Regular Posts Grid: 1 col mobile → 2 col sm → 3 col lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {posts.slice(page === 1 && !searchParamsObj.category && !searchParamsObj.tag && !searchParamsObj.search ? 1 : 0).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 sm:mt-16 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                {page > 1 && (
                  <NewTabLink
                    href={`/blogs?${new URLSearchParams({ ...searchParamsObj, page: (page - 1).toString() }).toString()}`}
                    className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </NewTabLink>
                )}

                {/* Show fewer page buttons on mobile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    // On mobile: only show current ± 1
                    const isMobileVisible = Math.abs(pageNum - page) <= 1;

                    return (
                      <NewTabLink
                        key={pageNum}
                        href={`/blogs?${new URLSearchParams({ ...searchParamsObj, page: pageNum.toString() }).toString()}`}
                        className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium transition-colors text-sm ${
                          !isMobileVisible ? 'hidden sm:flex' : ''
                        } ${
                          page === pageNum
                            ? 'bg-amber-500 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </NewTabLink>
                    );
                  })}
                </div>

                {page < totalPages && (
                  <NewTabLink
                    href={`/blogs?${new URLSearchParams({ ...searchParamsObj, page: (page + 1).toString() }).toString()}`}
                    className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </NewTabLink>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">No articles found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <NewTabLink
              href="/blogs"
              className="inline-block px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              View All Articles
            </NewTabLink>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-linear-to-r from-amber-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-amber-100 mb-8">
            Get the latest insights on luxury real estate delivered to your inbox
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-amber-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      </div>

      {/* ItemList JSON-LD — helps Google and AI tools understand this is a structured content collection */}
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Luxury Real Estate Insights — Superluxere Blog',
              description: 'Expert articles on luxury real estate trends, investment guides, and market analysis in India.',
              url: 'https://superluxere.com/blogs',
              numberOfItems: posts.length,
              itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: (page - 1) * pageSize + index + 1,
                url: `https://superluxere.com/blogs/${post.slug}`,
                name: post.title,
              })),
            }),
          }}
        />
      )}

      <LeadPopup />
    </main>
  );
}

// searchParams makes this page dynamically rendered.
// export const revalidate conflicts with searchParams in Next.js 15 (DYNAMIC_SERVER_USAGE).
// Individual fetches retain their own revalidation windows (3600s nav, 60s blogs).
export const dynamic = 'force-dynamic';
