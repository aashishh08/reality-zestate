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

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-gold selection:text-white">
      {/* Premium Background Texture */}
      <div className="fixed inset-0 z-[-1] bg-[#F0EFEB]">
         <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
      </div>

      <Header />
      <Hero />
      
      <TrendingProjects />
      <LocationCategories />
      <CityLocations />
      <UpcomingProjects />
      <BoutiqueCollection />
      <OpulnzExclusive />
      
      <Footer />
      <FloatingActions />
      <LeadPopup />
    </main>
  );
}
