import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-serif font-bold text-gold mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
          Project Not Found
        </h2>
        <p className="text-zinc-400 text-lg mb-10">
          The property you're looking for doesn't exist or has been moved. 
          Explore our curated collection of luxury properties instead.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-gold text-black px-8 py-4 rounded-sm font-bold hover:bg-white transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
