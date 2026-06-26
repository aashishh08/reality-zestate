import type { Metadata, Viewport } from "next";
import { Great_Vibes, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { PublicGoogleAnalytics } from "@/components/analytics/PublicGoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} ${playfair.variable} ${montserrat.variable} font-sans antialiased overflow-x-clip min-h-[100dvh]`}
      >
        <OrganizationJsonLd />
        <SiteHeader />
        <LeadModalProvider>{children}</LeadModalProvider>
        <PublicGoogleAnalytics />
      </body>
    </html>
  );
}
