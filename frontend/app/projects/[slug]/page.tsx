import { notFound } from "next/navigation";
import { Metadata } from "next";

// Always fetch fresh data — admin updates must be visible immediately
export const dynamic = 'force-dynamic';
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/data";
import { getPropertyBySlug, getProperties } from "@/lib/api/properties";
import {
  transformBackendPropertyToProject,
  transformListingPropertyToProject,
} from "@/lib/property-transformer";
import type { Property, Project as ProjectType } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectAmenities } from "@/components/project/ProjectAmenities";
import { ProjectFloorPlans } from "@/components/project/ProjectFloorPlans";
import { ProjectLocation } from "@/components/project/ProjectLocation";
import { ProjectFAQ } from "@/components/project/ProjectFAQ";
import { ProjectMasterPlan } from "@/components/project/ProjectMasterPlan";
import { ProjectPaymentPlan } from "@/components/project/ProjectPaymentPlan";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectKeyTakeaways } from "@/components/project/ProjectKeyTakeaways";
import { ProjectBookingCTA } from "@/components/project/ProjectBookingCTA";
import { ProjectBookingBanner } from "@/components/project/ProjectBookingBanner";
import { ProjectWhyInvest } from "@/components/project/ProjectWhyInvest";
import { ProjectSimilar } from "@/components/project/ProjectSimilar";
import { ProjectSectionNavigation } from "@/components/project/ProjectSectionNavigation";
import { ProjectTeam } from "@/components/project/ProjectTeam";
import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";

/**
 * Fetch property data from backend or fallback to hardcoded data
 * @param slug - Property slug to fetch
 * @returns Property data transformed into Project format
 */
async function getPropertyData(slug: string) {
  try {
    const backendProperty = await getPropertyBySlug(slug, false);
    return transformBackendPropertyToProject(backendProperty);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[ProjectPage] Backend fetch failed for '${slug}': ${errorMessage}`);
    }

    // Fallback to hardcoded data
    const hardcodedProject = getProjectBySlug(slug);

    if (hardcodedProject) {
      return hardcodedProject;
    }

    return null;
  }
}

/**
 * Generate static params for all projects (ISR)
 * Fetches from backend API and merges with hardcoded slugs
 */
export async function generateStaticParams() {
  try {
    // Fetch published properties from backend
    const backendProperties = await getProperties({ isPublished: true }, false);
    const backendSlugs = (backendProperties?.data ?? []).map((p) => p.slug);

    // Get hardcoded slugs as fallback
    const hardcodedSlugs = getAllProjectSlugs();

    // Combine and deduplicate
    const allSlugs = [...new Set([...backendSlugs, ...hardcodedSlugs])];

    return allSlugs.map((slug) => ({ slug }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.error(`[generateStaticParams] Backend API error: ${errorMessage}`);
    }

    // Fallback to hardcoded slugs if backend is unavailable
    const slugs = getAllProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPropertyData(slug);

  if (!project) {
    return {
      title: "Project Not Found | Superluxere",
      description: "The requested property could not be found.",
    };
  }

  const description = project.metaDescription
    || project.details?.overview?.content?.[0]
    || project.description
    || `Luxury ${project.type} in ${project.location}. ${project.price}`;

  return {
    title: `${project.seoTitle || project.title} - ${project.location} | Superluxere`,
    description,
    keywords: [
      project.title,
      project.location || "luxury property",
      project.type || "residential",
      "luxury real estate",
      "premium properties",
      "Superluxere"
    ],
    openGraph: {
      title: project.title,
      description: project.details?.subtitle || description,
      images: [project.details?.heroImage || project.image || "/images/project-1.jpg"],
    },
  };
}

// Allow rendering pages for slugs not in generateStaticParams
export const dynamicParams = true;

/** Prefer other published CMS properties; fall back to static seed data. */
async function getSimilarProjects(
  currentSlug: string,
  currentId: string | undefined,
): Promise<ProjectType[]> {
  try {
    const res = await getProperties({ isPublished: true, limit: 32 }, false);
    const rows = (res?.data ?? []) as Property[];
    const others = rows
      .filter((p) => p.slug !== currentSlug && (!currentId || p.id !== currentId))
      .slice(0, 3)
      .map((p) => transformListingPropertyToProject(p));
    if (others.length > 0) return others;
  } catch {
    /* use static fallback */
  }
  return projects.filter((p) => !currentId || p.id !== currentId).slice(0, 3);
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPropertyData(slug);

  if (!project) {
    notFound();
  }

  const { details } = project;

  const similarProjects = await getSimilarProjects(slug, project.id);

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

      {/* Introduction Text Section */}
      {details?.introText && (
        <section className="py-8 bg-[#F5F0E8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10 text-center">
              <HtmlRenderer html={details.introText} fontSize="text-lg" className="text-[#2C2416]" />
            </div>
          </div>
        </section>
      )}

      {/* Key Takeaways Section */}
      {details?.keyTakeaways && (
        <section className="py-12 bg-[#F5F0E8]" id="key-takeaways">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Highlights">{details.sectionHeadings?.keyTakeaways || 'Key Takeaways'}</SectionHeading>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Left Side - Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[320px]">
                <img
                  src={details.gallery?.[0] || details.heroImage || "/images/project-1.jpg"}
                  alt="Project Details"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Right Side - Key Takeaways Cards */}
              <div className="flex flex-col">
                <ProjectKeyTakeaways data={details.keyTakeaways} heading={details.sectionHeadings?.keyTakeaways} />
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Investment — component returns null when CMS section has no content */}
      {details && (
        <ErrorBoundary sectionName="Why Invest">
          <ProjectWhyInvest
            reasons={details.whyInvest ?? []}
            videoUrl={details.videoUrl}
            detailedAnalysis={details.investmentAnalysis}
            projectTitle={project.title}
            propertyId={project.id}
            propertySlug={slug}
            heading={details.sectionHeadings?.whyInvest}
            whyInvestStats={details.whyInvestStats}
          />
        </ErrorBoundary>
      )}

      {/* Section Navigation */}
      <ErrorBoundary sectionName="Section Navigation">
        <ProjectSectionNavigation />
      </ErrorBoundary>

      {/* Overview */}
      <div id="overview">
        {details?.overview && (
          <ErrorBoundary sectionName="Overview">
            <ProjectOverview
              overview={details.overview}
              featureImage={details.gallery?.[0] || details.heroImage}
            />
          </ErrorBoundary>
        )}
      </div>

      {/* Gallery Section */}
      {details?.gallery && (
        <section className="py-12 bg-white" id="gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading centered={false} label="Visual Tour">{details.sectionHeadings?.gallery || 'Project Gallery'}</SectionHeading>
            <ErrorBoundary sectionName="Gallery">
              <ProjectGallery
                images={details.gallery}
                videoUrl={details.videoUrl}
              />
            </ErrorBoundary>
          </div>
        </section>
      )}

      {/* Master Plan */}
      {(details?.masterPlan || details?.masterPlanDescription) && (
        <section id="masterplan" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorBoundary sectionName="Master Plan">
              <ProjectMasterPlan
                masterPlanImage={details.masterPlan}
                description={details.masterPlanDescription}
                heading={details.sectionHeadings?.masterPlan}
              />
            </ErrorBoundary>
          </div>
        </section>
      )}

      {/* Location Advantage */}
      <section id="location">
        {details?.location && (
          <ErrorBoundary sectionName="Location">
            <ProjectLocation location={details.location} heading={details.sectionHeadings?.location} />
          </ErrorBoundary>
        )}
      </section>

      {/* Book a Private Tour Banner */}
      <ProjectBookingBanner
        projectTitle={project.title}
        propertyId={project.id}
        propertySlug={slug}
      />

      {/* Amenities */}
      {details?.amenities && details.amenities.length > 0 && (
        <section id="amenities">
          <ErrorBoundary sectionName="Amenities">
            <ProjectAmenities amenities={details.amenities} amenitiesStats={details.amenitiesStats} heading={details.sectionHeadings?.amenities} />
          </ErrorBoundary>
        </section>
      )}

      {/* Residences (Floor Plans) */}
      {details?.floorPlans && details.floorPlans.length > 0 && (
        <section id="floorplans">
          <ErrorBoundary sectionName="Floor Plans">
            <ProjectFloorPlans floorPlans={details.floorPlans} descriptionSections={details.floorPlanDescriptionSections} heading={details.sectionHeadings?.floorPlans} />
          </ErrorBoundary>
        </section>
      )}

      {/* Payment Plans */}
      {details?.paymentPlans && details.paymentPlans.length > 0 && (
        <section id="paymentplans">
          <ErrorBoundary sectionName="Payment Plans">
            <ProjectPaymentPlan paymentPlans={details.paymentPlans} heading={details.sectionHeadings?.paymentPlans} />
          </ErrorBoundary>
        </section>
      )}

      {/* Design & Construction Team */}
      {details?.team && (
        <section id="team">
          <ErrorBoundary sectionName="Team">
            <ProjectTeam team={details.team} heading={details.sectionHeadings?.team} />
          </ErrorBoundary>
        </section>
      )}

      {/* FAQs */}
      <section id="faqs">
        {details?.faqs && details.faqs.length > 0 && (
          <ProjectFAQ faqs={details.faqs} heading={details.sectionHeadings?.faqs} />
        )}
      </section>

      {/* Similar Properties */}
      {similarProjects.length > 0 && (
        <section id="similar">
          <ProjectSimilar projects={similarProjects} />
        </section>
      )}

      {/* Contact Form #2 - Final */}
      <ProjectBookingCTA
        projectTitle={project.title}
        propertyId={project.id}
        propertySlug={slug}
      />

      <Footer />
      <FloatingActions />
    </main>
  );
}
