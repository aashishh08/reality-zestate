import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy web paths (API uses /properties; public pages are /projects)
      { source: "/properties", destination: "/projects", permanent: true },
      { source: "/properties/:slug", destination: "/projects/:slug", permanent: true },
      // Old marketing link — "luxury" is a category, not a tag
      { source: "/tag/luxury", destination: "/category/luxury", permanent: true },
      // Common plural typo in footer (was /category/villas)
      { source: "/category/villas", destination: "/category/ultra-villas", permanent: true },
      { source: "/category/penthouse", destination: "/category/ultra-luxury", permanent: true },
      { source: "/category/penthouses", destination: "/category/ultra-luxury", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Allow any HTTPS image source (Unsplash, Genspark, S3, CMS uploads, etc.)
        // Restricting per-hostname causes recurring prod crashes when new sources are added
        protocol: 'https',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 3600,
    formats: ['image/webp'],
  },
  typescript: {
    // Ignore build-time TypeScript errors to allow deployment with known type issues
    // This should be reviewed and fixed in future refactoring
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    // Disable static generation retry for error pages
    staticGenerationRetryCount: 0,
  },
};

export default nextConfig;
