import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { TrendingProjects } from "@/components/home/TrendingProjects";
import { LocationCategories } from "@/components/home/LocationCategories";
import { CityLocations } from "@/components/home/CityLocations";
import { fetchHomepageData } from "@/lib/api/homepage";
import { buildFeaturedCorridorCardsFromApi } from "@/lib/featured-corridors";
import { getSiteUrl } from "@/lib/site-url";
import { getDefaultOgImageEntry, getDefaultOgImageUrl } from "@/lib/seo";

const FloatingActions = dynamic(() =>
  import("@/components/layout/FloatingActions").then((m) => ({ default: m.FloatingActions })),
);
const UpcomingProjects = dynamic(() =>
  import("@/components/home/UpcomingProjects").then((m) => ({ default: m.UpcomingProjects })),
);
const BrowseByDeveloper = dynamic(() =>
  import("@/components/home/BrowseByDeveloper").then((m) => ({ default: m.BrowseByDeveloper })),
);
const BoutiqueCollection = dynamic(() =>
  import("@/components/home/BoutiqueCollection").then((m) => ({ default: m.BoutiqueCollection })),
);
const FeaturedCorridors = dynamic(() =>
  import("@/components/home/FeaturedCorridors").then((m) => ({ default: m.FeaturedCorridors })),
);
const ResourcesInsights = dynamic(() =>
  import("@/components/home/ResourcesInsights").then((m) => ({ default: m.ResourcesInsights })),
);
const SuperluxereExclusive = dynamic(() =>
  import("@/components/home/OpulnzExclusive").then((m) => ({ default: m.SuperluxereExclusive })),
);

// ISR: Revalidate every hour
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const base = getSiteUrl();
  const canonicalUrl = base;
  const title = "Super Luxury Real Estate Advisory India | SuperLuxeRE";
  const description =
    "SuperLuxeRE is India's specialist super luxury and ultra luxury real estate advisory. We help HNIs, UHNWIs, NRIs and family offices access curated off-market and pre-launch properties on Golf Course Road, Noida Expressway and Worli.";

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
      images: [getDefaultOgImageEntry()],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getDefaultOgImageUrl()],
    },
  };
}

async function getHomePageData() {
  try {
    const data = await fetchHomepageData(3600);
    const featuredCorridors = buildFeaturedCorridorCardsFromApi(data.featuredCorridors);

    return {
      trendingProperties: data.trending,
      upcomingProperties: data.upcoming,
      boutiqueProperties: data.boutique,
      locations: data.locations,
      featuredDevelopers: data.featuredDevelopers,
      developers: data.developers,
      categories: data.categories,
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
      featuredDevelopers: [],
      developers: [],
      categories: [],
      featuredCorridors: [],
    };
  }
}

export default async function Home() {
  const {
    trendingProperties,
    upcomingProperties,
    boutiqueProperties,
    locations,
    featuredDevelopers,
    developers,
    categories,
    featuredCorridors,
  } = await getHomePageData();

  return (
    <main className="min-h-screen relative selection:bg-gold selection:text-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
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
      <BrowseByDeveloper developers={featuredDevelopers} />


      <BoutiqueCollection properties={boutiqueProperties} />

      <ResourcesInsights />

      <SuperluxereExclusive developers={developers} />

      <Footer locations={locations} />
      <FloatingActions />
    </main>
  );
}
