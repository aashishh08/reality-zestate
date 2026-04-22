import Link from 'next/link';
import { NewTabLink } from '@/components/ui/NewTabLink';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-serif font-bold text-gray-200">404</h1>
          <div className="relative -mt-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Blog Post Not Found
            </h2>
          </div>
        </div>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The article you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NewTabLink
            href="/blogs"
            className="px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            View All Articles
          </NewTabLink>
          <Link
            href="/"
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
