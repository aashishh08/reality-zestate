import { Metadata } from "next";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { TrendingProjects } from "@/components/home/TrendingProjects";
import { LocationCategories } from "@/components/home/LocationCategories";
import { CityLocations } from "@/components/home/CityLocations";
import { UpcomingProjects } from "@/components/home/UpcomingProjects";
import { BrowseByDeveloper } from "@/components/home/BrowseByDeveloper";
import { BoutiqueCollection } from "@/components/home/BoutiqueCollection";
import { FeaturedCorridors } from "@/components/home/FeaturedCorridors";
import { SuperluxereExclusive } from "@/components/home/OpulnzExclusive";
import { LeadPopup } from "@/components/ui/LeadPopup";
import { getLocations, getDevelopers, getCategories } from "@/lib";
import { fetchHomeSectionProperties } from "@/lib/homepage-properties";
import { getFeaturedCorridorCards } from "@/lib/featured-corridors";
import { getSiteUrl } from "@/lib/site-url";
import { getDefaultOgImageUrl } from "@/lib/seo";

// ISR: Revalidate every hour
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const base = getSiteUrl();
  const canonicalUrl = base;
  const ogImage = getDefaultOgImageUrl();
  const title = "Luxury Real Estate & Premium Properties";
  const description =
    "Discover curated luxury real estate properties in India. Trending projects, upcoming launches, and boutique collections.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Superluxere",
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Superluxere" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

async function getHomePageData() {
  try {
    const [
      trendingProperties,
      upcomingProperties,
      boutiqueProperties,
      locationsRes,
      developersRes,
      categoriesRes,
    ] = await Promise.all([
      fetchHomeSectionProperties("trending", { limit: 8, revalidate: 3600 }),
      fetchHomeSectionProperties("upcoming", { limit: 8, revalidate: 3600 }),
      fetchHomeSectionProperties("boutique", { limit: 8, revalidate: 3600 }),
      getLocations({ limit: 20, offset: 0 }, 3600)
        .catch(e => { console.error('Locations fetch failed:', e.message); return { data: [] }; }),
      getDevelopers({ limit: 12, offset: 0 }, 3600)
        .catch(e => { console.error('Developers fetch failed:', e.message); return { data: [] }; }),
      getCategories({ limit: 120, offset: 0 }, 3600)
        .catch(e => { console.error('Categories fetch failed:', e.message); return { data: [] }; }),
    ]);

    const normalise = (res: any) =>
      Array.isArray(res) ? res : res?.data || [];

    const locations = normalise(locationsRes);

    const featuredCorridors = await getFeaturedCorridorCards(3600);

    return {
      trendingProperties,
      upcomingProperties,
      boutiqueProperties,
      locations,
      developers: normalise(developersRes),
      categories: normalise(categoriesRes),
      featuredCorridors,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[HomePage] Failed to fetch data:", error);
    }
    return {
      trendingProperties: [],
      upcomingProperties: [],
      boutiqueProperties: [],
      locations: [],
      developers: [],
      categories: [],
      featuredCorridors: [],
    };
  }
}

import { ResourcesInsights } from "@/components/home/ResourcesInsights";

export default async function Home() {
  const {
    trendingProperties,
    upcomingProperties,
    boutiqueProperties,
    locations,
    developers,
    categories,
    featuredCorridors,
  } = await getHomePageData();

  return (
    <main className="min-h-screen relative selection:bg-gold selection:text-white pb-[calc(3.25rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Premium Background Texture */}
      <div className="fixed inset-0 z-[-1] bg-[#F0EFEB]">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
      </div>

      <Hero />

      {/* 1. Trending — tag-filtered */}
      <TrendingProjects properties={trendingProperties} />

      {/* 2. Browse by Location — card grid */}
      <LocationCategories categories={categories} />
      <FeaturedCorridors corridors={featuredCorridors} />
      <CityLocations locations={locations} />

      {/* 3. Upcoming Launches — tag-filtered */}
      <UpcomingProjects properties={upcomingProperties} />

      {/* 4. Browse by Developer */}
      <BrowseByDeveloper developers={developers} />


      <BoutiqueCollection properties={boutiqueProperties} />

      <ResourcesInsights />

      <SuperluxereExclusive developers={developers} />

      <Footer locations={locations} />
      <FloatingActions />
      <LeadPopup />
    </main>
  );
}
