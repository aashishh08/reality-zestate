import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { TrendingProjects } from "@/components/home/TrendingProjects";
import { LocationCategories } from "@/components/home/LocationCategories";
import { CityLocations } from "@/components/home/CityLocations";
import { UpcomingProjects } from "@/components/home/UpcomingProjects";
import { BoutiqueCollection } from "@/components/home/BoutiqueCollection";
import { OpulnzExclusive } from "@/components/home/OpulnzExclusive";
import { LeadPopup } from "@/components/ui/LeadPopup";
import { getProperties, getLocations, getDevelopers } from "@/lib";

// ISR: Revalidate every hour
export const revalidate = 3600;

async function getHomePageData() {
  try {
    console.log('[HomePage] Starting data fetch...');
    console.log('[HomePage] API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL);
    
    const [properties, locations, developers] = await Promise.all([
      getProperties({ limit: 12, offset: 0 }, 3600),
      getLocations({ limit: 20, offset: 0 }, 3600),
      getDevelopers({ limit: 6, offset: 0 }, 3600),
    ]);

    console.log('[HomePage] Data fetched successfully');
    console.log('[HomePage] Properties:', properties?.length);
    console.log('[HomePage] Locations:', locations?.length);
    console.log('[HomePage] Developers:', developers?.length);

    return {
      properties: properties || [],
      locations: locations || [],
      developers: developers || [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[HomePage] Failed to fetch homepage data:", errorMessage);
    console.error("[HomePage] Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("[HomePage] Full error stack:", error);
    
    // Return empty arrays so homepage still renders
    return {
      properties: [],
      locations: [],
      developers: [],
    };
  }
}

export default async function Home() {
  const { properties, locations, developers } = await getHomePageData();

  return (
    <main className="min-h-screen relative selection:bg-gold selection:text-white">
      {/* Premium Background Texture */}
      <div className="fixed inset-0 z-[-1] bg-[#F0EFEB]">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
      </div>

      <Header />
      <Hero />

      <TrendingProjects properties={properties} />
      <LocationCategories locations={locations} />
      <CityLocations locations={locations} />
      <UpcomingProjects properties={properties} />
      <BoutiqueCollection locations={locations} />
      <OpulnzExclusive developers={developers} />

      <Footer />
      <FloatingActions />
      <LeadPopup />
    </main>
  );
}
