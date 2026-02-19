import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/data";
import { getPropertyBySlug, getProperties } from "@/lib/api/properties";
import { transformBackendPropertyToProject } from "@/lib/property-transformer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectAmenities } from "@/components/project/ProjectAmenities";
import { ProjectFloorPlans } from "@/components/project/ProjectFloorPlans";
import { ProjectLocation } from "@/components/project/ProjectLocation";
import { ProjectUSP } from "@/components/project/ProjectUSP";
import { ProjectFAQ } from "@/components/project/ProjectFAQ";
import { ProjectMasterPlan } from "@/components/project/ProjectMasterPlan";
import { ProjectPaymentPlan } from "@/components/project/ProjectPaymentPlan";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectKeyTakeaways } from "@/components/project/ProjectKeyTakeaways";
import { ProjectBookingCTA } from "@/components/project/ProjectBookingCTA";
import { ProjectWhyInvest } from "@/components/project/ProjectWhyInvest";
import { ProjectSimilar } from "@/components/project/ProjectSimilar";
import ProjectNavigation from "@/components/project/ProjectNavigation";
import { ProjectTeam } from "@/components/project/ProjectTeam";
import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Fetch property data from backend or fallback to hardcoded data
 * @param slug - Property slug to fetch
 * @returns Property data transformed into Project format
 */
async function getPropertyData(slug: string) {
  try {
    console.log(`[ProjectPage] Attempting to fetch from backend: ${slug}`);
    const backendProperty = await getPropertyBySlug(slug);

    console.log(`[ProjectPage] ✅ Successfully fetched from backend: ${backendProperty.slug}`);
    return transformBackendPropertyToProject(backendProperty);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[ProjectPage] Backend fetch failed for '${slug}': ${errorMessage}`);
    console.log(`[ProjectPage] Attempting fallback to hardcoded data...`);

    // Fallback to hardcoded data
    const hardcodedProject = getProjectBySlug(slug);

    if (hardcodedProject) {
      console.log(`[ProjectPage] ✅ Found hardcoded data for: ${slug}`);
      return hardcodedProject;
    }

    console.error(`[ProjectPage] ❌ Property not found in backend or hardcoded data: ${slug}`);
    return null;
  }
}

/**
 * Generate static params for all projects (ISR)
 * Fetches from backend API and merges with hardcoded slugs
 */
export async function generateStaticParams() {
  try {
    console.log('[generateStaticParams] Fetching properties from backend API...');

    // Fetch published properties from backend
    const backendProperties = await getProperties({ isPublished: true }, false);
    const backendSlugs = backendProperties.map((p) => p.slug);

    console.log(`[generateStaticParams] Backend slugs (${backendSlugs.length}):`, backendSlugs);

    // Get hardcoded slugs as fallback
    const hardcodedSlugs = getAllProjectSlugs();
    console.log(`[generateStaticParams] Hardcoded slugs (${hardcodedSlugs.length}):`, hardcodedSlugs);

    // Combine and deduplicate
    const allSlugs = [...new Set([...backendSlugs, ...hardcodedSlugs])];

    console.log(`[generateStaticParams] ✅ Total unique slugs: ${allSlugs.length}`);

    return allSlugs.map((slug) => ({ slug }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[generateStaticParams] ❌ Backend API error: ${errorMessage}`);
    console.log('[generateStaticParams] Using hardcoded slugs only as fallback');

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
      title: "Project Not Found | Opulnz Abode",
      description: "The requested property could not be found.",
    };
  }

  const description = project.details?.overview.content[0]
    || project.description
    || `Luxury ${project.type} in ${project.location}. ${project.price}`;

  return {
    title: `${project.title} - ${project.location} | Opulnz Abode`,
    description,
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
      description: project.details?.subtitle || description,
      images: [project.details?.heroImage || project.image],
    },
  };
}

// ISR Configuration - Revalidate every hour
export const revalidate = 3600;

// Allow rendering pages for slugs not in generateStaticParams
export const dynamicParams = true;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPropertyData(slug);

  if (!project) {
    notFound();
  }

  const { details } = project;

  // Get similar projects (same category, excluding current project)
  const allProjects = projects;
  const similarProjects = allProjects
    .filter(p => p.id !== project.id)
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

      {/* Introduction Text Section */}
      {details?.introText && (
        <section className="py-12 bg-[#F5F0E8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10">
              <p className="text-[#2C2416] text-lg leading-relaxed text-center">
                {details.introText}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Key Takeaways Section - Before Why Invest */}
      {details?.keyTakeaways && (
        <section className="py-20 bg-[#F5F0E8]" id="key-takeaways">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading>Key Takeaways</SectionHeading>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Key Takeaways Box */}
              <div>
                <ProjectKeyTakeaways
                  takeaways={details.keyTakeaways}
                  highlights={details.highlights}
                />
              </div>

              {/* Right Side - Scrollable Text */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10">
                <h3 className="text-xl font-serif font-bold text-[#2C2416] mb-6">Project Details</h3>
                <div className="h-[400px] overflow-y-auto pr-4 scrollbar-custom">
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {details.keyTakeawaysDescription ? (
                      <p className="text-[15px]">{details.keyTakeawaysDescription}</p>
                    ) : (
                      <>
                        <p className="text-[15px]">
                          This ultra-luxury residential development represents a pinnacle of architectural excellence and contemporary living. Meticulously designed by renowned architects, every detail has been crafted to provide an unparalleled lifestyle experience.
                        </p>
                        <p className="text-[15px]">
                          The project features state-of-the-art amenities including a world-class spa, infinity pool, private cinema, fitness center with personal training facilities, and lush landscaped gardens designed by international experts.
                        </p>
                        <p className="text-[15px]">
                          Located in one of the most sought-after micro-markets, the property offers excellent connectivity to business districts, premium shopping destinations, fine dining establishments, and international schools.
                        </p>
                        <p className="text-[15px]">
                          Each residence is designed with open layouts, premium finishes, high ceilings, and panoramic views. Smart home integration and sustainable building practices ensure a modern, eco-conscious living environment.
                        </p>
                        <p className="text-[15px]">
                          Developed by a trusted builder with a proven track record of delivering luxury projects on time and with exceptional quality standards. Transparent communication and investor satisfaction are our core commitments.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Investment Analysis - Always show if details exist */}
      {details && (
        <ProjectWhyInvest
          reasons={details.whyInvest || []}
          videoUrl={details.videoUrl}
          detailedAnalysis={details.investmentAnalysis}
        />
      )}

      {/* Overview */}
      <div id="overview">
        {details?.overview && <ProjectOverview overview={details.overview} />}
      </div>

      {/* Gallery Section */}
      {details?.gallery && (
        <section className="py-20 bg-white" id="gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading centered={false}>Project Gallery</SectionHeading>
            <ProjectGallery
              images={details.gallery}
              videoUrl={details.videoUrl}
            />
          </div>
        </section>
      )}

      {/* Master Plan */}
      {details?.masterPlan && (
        <ProjectMasterPlan
          masterPlanImage={details.masterPlan}
          description={details.masterPlanDescription}
        />
      )}

      {/* Location Advantage */}
      {details?.location && <ProjectLocation location={details.location} />}

      {/* Contact Form #1 - First Appearance */}
      <ProjectBookingCTA projectTitle={project.title} />

      {/* Amenities */}
      {details?.amenities && details.amenities.length > 0 && (
        <ProjectAmenities amenities={details.amenities} />
      )}

      {/* Residences (Floor Plans) */}
      {details?.floorPlans && details.floorPlans.length > 0 && (
        <ProjectFloorPlans floorPlans={details.floorPlans} />
      )}

      {/* Payment Plans */}
      {details?.paymentPlans && details.paymentPlans.length > 0 && (
        <ProjectPaymentPlan paymentPlans={details.paymentPlans} />
      )}

      {/* Design & Construction Team */}
      {details?.team && <ProjectTeam team={details.team} />}

      {/* FAQs */}
      {details && details.faqs && details.faqs.length > 0 ? (
        <ProjectFAQ faqs={details.faqs} />
      ) : details ? (
        <ProjectFAQ faqs={[
          {
            question: "What is the project about?",
            answer: "This is a premium residential development featuring ultra-luxury apartments with world-class amenities and strategic location.",
            category: "General"
          },
          {
            question: "What are the available unit configurations?",
            answer: "We offer multiple configurations ranging from 2 BHK to 4+ BHK units, each designed with premium finishes and modern amenities.",
            category: "Units"
          },
          {
            question: "What are the payment options?",
            answer: "We provide flexible payment plans including construction-linked, down payment, and progressive payment options to suit your needs.",
            category: "Payment"
          },
          {
            question: "When is the possession timeline?",
            answer: "The project is planned for possession within the specified timeline. Contact our sales team for detailed information.",
            category: "Possession"
          }
        ]} />
      ) : null}

      {/* Similar Properties */}
      {similarProjects.length > 0 && (
        <ProjectSimilar projects={similarProjects} />
      )}

      {/* Contact Form #2 - Final */}
      <ProjectBookingCTA projectTitle={project.title} />

      <Footer />
      <FloatingActions />
    </main>
  );
}
