import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

/**
 * Must be a static literal (Next.js / Turbopack parses route config at build time).
 * Request freshness is still controlled by `serverFetchNoCache()` in `fetchFromAPI` (cache / no-store).
 */
export const dynamic = "auto";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Superluxere - Luxury Real Estate & Premium Properties",
    template: "%s | Superluxere"
  },
  description: "Discover curated luxury real estate properties in India. Trending projects, upcoming launches, and boutique collections. Your gateway to premium living.",
  keywords: ["luxury real estate", "premium properties", "luxury apartments", "penthouses", "villas", "Gurgaon", "Delhi", "Mumbai", "Bangalore"],
  authors: [{ name: "Superluxere" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://superluxere.com",
    siteName: "Superluxere",
    title: "Superluxere - Luxury Real Estate & Premium Properties",
    description: "Discover curated luxury real estate properties in India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F0EFEB",
};

import { LeadModalProvider } from "@/lib/contexts/LeadModalContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <LeadModalProvider>
          {children}
        </LeadModalProvider>
      </body>
    </html>
  );
}
