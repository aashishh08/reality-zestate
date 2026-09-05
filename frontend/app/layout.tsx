import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { getDefaultOgImageEntry, getDefaultOgImageUrl } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Super Luxury Real Estate Advisory India | SuperLuxeRE",
  },
  description: "SuperLuxeRE is India's specialist super luxury and ultra luxury real estate advisory. We help HNIs, UHNWIs, NRIs and family offices access curated off-market and pre-launch properties on Golf Course Road, Noida Expressway and Worli.",
  keywords: ["luxury real estate", "premium properties", "luxury apartments", "penthouses", "villas", "Gurgaon", "Delhi", "Mumbai", "Bangalore"],
  authors: [{ name: "Superluxere" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getSiteUrl(),
    siteName: "Superluxere",
    title: "Super Luxury Real Estate Advisory India | SuperLuxeRE",
    description: "SuperLuxeRE is India's specialist super luxury and ultra luxury real estate advisory. We help HNIs, UHNWIs, NRIs and family offices access curated off-market and pre-launch properties on Golf Course Road, Noida Expressway and Worli.",
    images: [getDefaultOgImageEntry()],
  },
  twitter: {
    card: "summary_large_image",
    title: "Super Luxury Real Estate Advisory India | SuperLuxeRE",
    description: "SuperLuxeRE is India's specialist super luxury and ultra luxury real estate advisory. We help HNIs, UHNWIs, NRIs and family offices access curated off-market and pre-launch properties on Golf Course Road, Noida Expressway and Worli.",
    images: [getDefaultOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/blogs/feed.xml', title: 'Superluxere Blog RSS' }],
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F0EFEB",
};

import { LeadModalProvider } from "@/lib/contexts/LeadModalContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/WebSiteJsonLd";
import { PublicGoogleAnalytics } from "@/components/analytics/PublicGoogleAnalytics";
import { LazyLeadPopup } from "@/components/ui/LazyLeadPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased overflow-x-clip min-h-[100dvh]`}
      >
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LeadModalProvider>
          <SiteHeader />
          {children}
          <LazyLeadPopup />
        </LeadModalProvider>
        <PublicGoogleAnalytics />
      </body>
    </html>
  );
}
