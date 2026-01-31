import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

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
    default: "Opulnz Abode - Luxury Real Estate & Premium Properties",
    template: "%s | Opulnz Abode"
  },
  description: "Discover curated luxury real estate properties in India. Trending projects, upcoming launches, and boutique collections. Your gateway to premium living.",
  keywords: ["luxury real estate", "premium properties", "luxury apartments", "penthouses", "villas", "Gurgaon", "Delhi", "Mumbai", "Bangalore"],
  authors: [{ name: "Opulnz Abode" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://opulnzabode.com",
    siteName: "Opulnz Abode",
    title: "Opulnz Abode - Luxury Real Estate & Premium Properties",
    description: "Discover curated luxury real estate properties in India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
