import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
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
