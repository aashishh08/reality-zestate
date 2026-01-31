export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Skeleton */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="hidden md:flex items-center space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-12 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post Skeleton */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-96 bg-gray-200 animate-pulse" />
              <div className="p-8 md:p-10">
                <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse mb-4" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-56 bg-gray-200 animate-pulse" />
              <div className="p-6">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
