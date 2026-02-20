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
    const [propertiesRes, locationsRes, developersRes] = await Promise.all([
      getProperties({ limit: 12, offset: 0 }, 3600),
      getLocations({ limit: 20, offset: 0 }, 3600),
      getDevelopers({ limit: 6, offset: 0 }, 3600),
    ]);

    return {
      properties: Array.isArray(propertiesRes) ? propertiesRes : propertiesRes?.data || [],
      locations: locationsRes?.data || locationsRes || [],
      developers: Array.isArray(developersRes) ? developersRes : developersRes?.data || [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.error("[HomePage] Failed to fetch data:", errorMessage);
    }
    
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
