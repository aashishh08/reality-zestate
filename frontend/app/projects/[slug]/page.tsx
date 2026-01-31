import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectHighlights } from "@/components/project/ProjectHighlights";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectAmenities } from "@/components/project/ProjectAmenities";
import { ProjectFloorPlans } from "@/components/project/ProjectFloorPlans";
import { ProjectLocation } from "@/components/project/ProjectLocation";
import { ProjectUSP } from "@/components/project/ProjectUSP";
import { ProjectFAQ } from "@/components/project/ProjectFAQ";
import { ProjectSpecifications } from "@/components/project/ProjectSpecifications";
import { ProjectPaymentPlan } from "@/components/project/ProjectPaymentPlan";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectMeta } from "@/components/project/ProjectMeta";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectKeyTakeaways } from "@/components/project/ProjectKeyTakeaways";
import { ProjectBookingCTA } from "@/components/project/ProjectBookingCTA";
import { ProjectWhyInvest } from "@/components/project/ProjectWhyInvest";
import { ProjectSimilar } from "@/components/project/ProjectSimilar";
import ProjectNavigation from "@/components/project/ProjectNavigation";
import { projects } from "@/lib/data";

// Generate static params for all projects (ISR)
export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} - ${project.location} | Opulnz Abode`,
    description: project.details?.overview.content[0] || `Luxury ${project.type} in ${project.location}. ${project.price}`,
    keywords: [
      project.title,
      project.location,
      project.type,
      "luxury real estate",
      "premium properties",
      "Opulnz Abode"
    ],
    openGraph: {
      title: project.title,
      description: project.details?.subtitle || project.description || "",
      images: [project.details?.heroImage || project.image],
    },
  };
}

// ISR Configuration - Revalidate every hour
export const revalidate = 3600;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { details } = project;

  // Get similar projects (same category, excluding current project)
  const similarProjects = projects
    .filter(p => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen relative selection:bg-gold selection:text-white pt-[80px]">
      {/* Premium Background Texture */}
      <div className="fixed inset-0 z-[-1] bg-[#F0EFEB]">
         <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
      </div>

      <Header />
      
      <Breadcrumbs 
        items={[
          { label: "Projects", href: "/projects" }, 
          { label: project.title, href: "#" }
        ]} 
      />
      
      {/* Hero Section */}
      {details && <ProjectHero project={project} />}
      
      {/* Meta Information Bar */}
      {details?.highlights && <ProjectMeta highlights={details.highlights} />}
      
      {/* Gallery + Key Takeaways Section */}
      {details?.gallery && details?.keyTakeaways && (
        <section className="py-20 bg-white" id="gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left: Gallery */}
              <div>
                <h2 className="text-3xl font-serif text-[#2C2416] mb-6">Project Gallery</h2>
                <ProjectGallery images={details.gallery} />
              </div>
              
              {/* Right: Key Takeaways */}
              <div>
                <ProjectKeyTakeaways takeaways={details.keyTakeaways} />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Overview */}
      <div id="overview">
        {details?.overview && <ProjectOverview overview={details.overview} />}
        
        {/* Booking CTA Section - Under Overview */}
        <ProjectBookingCTA projectTitle={project.title} />
      </div>
      
      {/* Navigation Bar */}
      <ProjectNavigation />
      {details?.whyInvest && (
        <ProjectWhyInvest 
          reasons={details.whyInvest} 
          videoUrl={details.videoUrl} 
        />
      )}
      
      {/* Amenities */}
      {details?.amenities && details.amenities.length > 0 && (
        <ProjectAmenities amenities={details.amenities} />
      )}
      
      {/* Floor Plans */}
      {details?.floorPlans && details.floorPlans.length > 0 && (
        <ProjectFloorPlans floorPlans={details.floorPlans} />
      )}
      
      {/* Location */}
      {details?.location && <ProjectLocation location={details.location} />}

      {/* Specifications */}
      {details?.specifications && details.specifications.length > 0 && (
        <ProjectSpecifications specifications={details.specifications} />
      )}

      {/* Payment Plans */}
      {details?.paymentPlans && details.paymentPlans.length > 0 && (
        <ProjectPaymentPlan paymentPlans={details.paymentPlans} />
      )}
      
      {/* USP */}
      {details?.usp && details.usp.length > 0 && (
        <ProjectUSP usp={details.usp} projectTitle={project.title} />
      )}
      
      {/* FAQs */}
      {details?.faqs && details.faqs.length > 0 && (
        <ProjectFAQ faqs={details.faqs} />
      )}
      
      {/* Similar Properties */}
      {similarProjects.length > 0 && (
        <ProjectSimilar projects={similarProjects} />
      )}
      
      <Footer />
      <FloatingActions />
    </main>
  );
}
