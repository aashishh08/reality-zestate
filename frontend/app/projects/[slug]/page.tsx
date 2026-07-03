import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getSiteUrl } from "@/lib/site-url";
import { getDefaultOgImageUrl } from "@/lib/seo";
import { ROBOTS_NOINDEX_NOFOLLOW } from "@/lib/seo/listing-metadata";
import { getPropertyBySlug, getProperties } from "@/lib/api/properties";
import {
  transformBackendPropertyToProject,
  transformListingPropertyToProject,
} from "@/lib/property-transformer";
import type { Property, Project as ProjectType } from "@/types";
import { Footer } from "@/components/layout/Footer";
import { ProjectHero } from "@/components/project/ProjectHero";
import { MAX_FAQS, ProjectFAQ } from "@/components/project/ProjectFAQ";
import { ProjectFaqJsonLd } from "@/components/project/ProjectFaqJsonLd";
import { ProjectDetailJsonLd } from "@/components/project/ProjectDetailJsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";
import { ProjectViewTracker } from "@/components/analytics/ProjectViewTracker";
import { ProjectLeadPageContext } from "@/components/project/ProjectLeadPageContext";

const ProjectOverview = dynamic(() =>
  import("@/components/project/ProjectOverview").then((m) => ({ default: m.ProjectOverview })),
);
const ProjectAmenities = dynamic(() =>
  import("@/components/project/ProjectAmenities").then((m) => ({ default: m.ProjectAmenities })),
);
const ProjectLocation = dynamic(() =>
  import("@/components/project/ProjectLocation").then((m) => ({ default: m.ProjectLocation })),
);
const ProjectMasterPlan = dynamic(() =>
  import("@/components/project/ProjectMasterPlan").then((m) => ({ default: m.ProjectMasterPlan })),
);
const ProjectPaymentPlan = dynamic(() =>
  import("@/components/project/ProjectPaymentPlan").then((m) => ({ default: m.ProjectPaymentPlan })),
);
const ProjectKeyTakeaways = dynamic(() =>
  import("@/components/project/ProjectKeyTakeaways").then((m) => ({ default: m.ProjectKeyTakeaways })),
);
const ProjectBookingCTA = dynamic(() =>
  import("@/components/project/ProjectBookingCTA").then((m) => ({ default: m.ProjectBookingCTA })),
);
const ProjectBookingBanner = dynamic(() =>
  import("@/components/project/ProjectBookingBanner").then((m) => ({ default: m.ProjectBookingBanner })),
);
const ProjectWhyInvest = dynamic(() =>
  import("@/components/project/ProjectWhyInvest").then((m) => ({ default: m.ProjectWhyInvest })),
);
const ProjectSectionNavigation = dynamic(() =>
  import("@/components/project/ProjectSectionNavigation").then((m) => ({ default: m.ProjectSectionNavigation })),
);
const ProjectTeam = dynamic(() =>
  import("@/components/project/ProjectTeam").then((m) => ({ default: m.ProjectTeam })),
);
const FloatingActions = dynamic(() =>
  import("@/components/layout/FloatingActions").then((m) => ({ default: m.FloatingActions })),
);

const ProjectGallery = dynamic(() =>
  import("@/components/project/ProjectGallery").then((m) => ({ default: m.ProjectGallery })),
);
const ProjectFloorPlans = dynamic(() =>
  import("@/components/project/ProjectFloorPlans").then((m) => ({ default: m.ProjectFloorPlans })),
);
const ProjectSimilar = dynamic(() =>
  import("@/components/project/ProjectSimilar").then((m) => ({ default: m.ProjectSimilar })),
);

export const revalidate = 300;

/** Published property from API — deduped per request for metadata + page. */
const getPropertyData = cache(async (slug: string) => {
  try {
    const backendProperty = await getPropertyBySlug(slug, 300);
    return transformBackendPropertyToProject(backendProperty);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[ProjectPage] Backend fetch failed for '${slug}': ${errorMessage}`);
    }
    return null;
  }
});

/** Pre-render paths from published API properties only. */
export async function generateStaticParams() {
  try {
    const backendProperties = await getProperties({ isPublished: true, limit: 500 }, 300);
    const slugs = (backendProperties?.data ?? []).map((p) => p.slug);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.error(`[generateStaticParams] Backend API error: ${errorMessage}`);
    }
    return [];
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPropertyData(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested property could not be found.",
      robots: ROBOTS_NOINDEX_NOFOLLOW,
    };
  }

  const description =
    project.metaDescription ||
    project.details?.overview?.content?.[0] ||
    project.description ||
    `Luxury ${project.type} in ${project.location}. ${project.price}`;

  const ogImage =
    project.details?.heroImage?.trim() || project.image?.trim() || undefined;

  const titleSegment = `${project.seoTitle || project.title} - ${project.location}`
    .replace(/\s*\|\s*Superluxere\s*$/i, "")
    .trim();

  const base = getSiteUrl();
  const canonicalUrl = `${base}/projects/${slug}`;
  const ogDescription = project.details?.subtitle || description;
  const fallbackImage = getDefaultOgImageUrl();
  const effectiveImage = ogImage || fallbackImage;
  const ogImageEntry = [
    { url: effectiveImage, width: 1200, height: 630, alt: project.title },
  ];

  return {
    title: titleSegment,
    description,
    keywords: [
      project.title,
      project.location || "luxury property",
      project.type || "residential",
      "luxury real estate",
      "premium properties",
      "Superluxere",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: project.title,
      description: ogDescription,
      type: "website",
      url: canonicalUrl,
      siteName: "Superluxere",
      locale: "en_IN",
      images: ogImageEntry,
      ...(project.createdAt ? { publishedTime: project.createdAt } : {}),
      ...(project.updatedAt || project.createdAt
        ? { modifiedTime: project.updatedAt || project.createdAt }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: ogDescription,
      images: [effectiveImage],
    },
  };
}

// Allow rendering pages for slugs not in generateStaticParams
export const dynamicParams = true;

/** Other published properties from API only (no static fallback). */
async function getSimilarProjects(
  currentSlug: string,
  currentId: string | undefined,
): Promise<ProjectType[]> {
  try {
    const res = await getProperties({ isPublished: true, limit: 8 }, 3600);
    const rows = (res?.data ?? []) as Property[];
    return rows
      .filter((p) => p.slug !== currentSlug && (!currentId || p.id !== currentId))
      .slice(0, 3)
      .map((p) => transformListingPropertyToProject(p));
  } catch {
    return [];
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPropertyData(slug);

  if (!project) {
    notFound();
  }

  const { details } = project;

  const similarProjects = await getSimilarProjects(slug, project.id);
  const relatedLinks = [
    { href: "/projects", label: "All Projects" },
    ...(project.Location?.slug
      ? [
          {
            href: `/location/${project.Location.slug}`,
            label: `Projects in ${project.Location.name}`,
          },
        ]
      : []),
    ...(project.Developer?.slug
      ? [
          {
            href: `/developer/${project.Developer.slug}`,
            label: `${project.Developer.name} Projects`,
          },
        ]
      : []),
    ...(project.Categories && project.Categories.length > 0
      ? [
          {
            href: `/category/${project.Categories[0].slug}`,
            label: `${project.Categories[0].name} Collection`,
          },
        ]
      : []),
    { href: "/blogs", label: "Market Insights & Guides" },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-gold selection:text-white pt-16 lg:pt-20 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <ProjectViewTracker
        projectSlug={slug}
        locationSlug={project.Location?.slug}
        developerSlug={project.Developer?.slug}
      />
      <ProjectLeadPageContext
        propertyId={project.id}
        propertySlug={slug}
        propertyTitle={project.title}
      />
      {/* JSON-LD — BreadcrumbList + RealEstateListing */}
      <ProjectDetailJsonLd project={project} slug={slug} />

      {/* Premium Background Texture */}
      <div className="fixed inset-0 z-[-1] bg-[#F0EFEB]">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-[0.03] grayscale" />
      </div>

      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: project.title, href: "#" },
        ]}
      />

      {/* Hero Section */}
      {details && <ProjectHero project={project} />}

      {/* Introduction Text Section */}
      {details?.introText && (
        <section className="py-8 bg-[#F5F0E8] overflow-x-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C9A961]/10 text-center min-w-0 overflow-hidden">
              <HtmlRenderer
                html={details.introText}
                fontSize="text-lg"
                className="text-[#2C2416]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Key Takeaways Section */}
      {details?.keyTakeaways && (
        <section className="py-8 sm:py-10 md:py-12 bg-[#F5F0E8] overflow-x-hidden" id="key-takeaways">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
            <SectionHeading label="Highlights">
              {details.sectionHeadings?.keyTakeaways || "Key Takeaways"}
            </SectionHeading>

            {(() => {
              const ktImage = details.gallery?.[0]?.trim() || details.heroImage?.trim();
              return (
                <div
                  className={
                    ktImage
                      ? "grid md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 items-stretch min-w-0"
                      : "grid grid-cols-1 gap-6 sm:gap-7 md:gap-8 min-w-0"
                  }
                >
                  {ktImage ? (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[320px]">
                      <Image
                        src={ktImage}
                        alt="Project Details"
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  ) : null}

                  <div className="flex flex-col min-w-0 max-w-full">
                    <ProjectKeyTakeaways
                      data={details.keyTakeaways}
                      heading={details.sectionHeadings?.keyTakeaways}
                    />
                  </div>
                </div>
              );
            })()}
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
            introDescription={details.whyInvestIntro}
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
        <section className="py-8 sm:py-10 md:py-12 bg-white" id="gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading centered={false} label="Visual Tour">
              {details.sectionHeadings?.gallery || "Project Gallery"}
            </SectionHeading>
            <ErrorBoundary sectionName="Gallery">
              <ProjectGallery images={details.gallery} videoUrl={details.videoUrl} />
            </ErrorBoundary>
          </div>
        </section>
      )}

      {/* Master Plan */}
      {(details?.masterPlan || details?.masterPlanDescription) && (
        <section id="masterplan" className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorBoundary sectionName="Master Plan">
              <ProjectMasterPlan
                masterPlanImage={details.masterPlan}
                description={details.masterPlanDescription}
                sectionDescription={details.masterPlanIntro}
                heading={details.sectionHeadings?.masterPlan}
              />
            </ErrorBoundary>
          </div>
        </section>
      )}

      {/* Location Advantage — CMS section and/or display-only sublocality from property record */}
      <section id="location">
        {(details?.location || project.sublocality?.trim()) && (
          <ErrorBoundary sectionName="Location">
            <ProjectLocation
              location={details?.location ?? { nearby: [], connectivity: [] }}
              sublocality={project.sublocality}
              heading={details?.sectionHeadings?.location}
              description={details.locationIntro}
            />
          </ErrorBoundary>
        )}
      </section>

      {/* Book a Private Tour Banner */}
      <ProjectBookingBanner
        projectTitle={project.title}
        projectImage={project.details?.heroImage?.trim() || project.image?.trim()}
        propertyId={project.id}
        propertySlug={slug}
      />

      {/* Amenities */}
      {details?.amenities && details.amenities.length > 0 && (
        <section id="amenities">
          <ErrorBoundary sectionName="Amenities">
            <ProjectAmenities
              amenities={details.amenities}
              amenitiesStats={details.amenitiesStats}
              heading={details.sectionHeadings?.amenities}
              description={details.amenitiesIntro}
            />
          </ErrorBoundary>
        </section>
      )}

      {/* Residences (Floor Plans) */}
      {details?.floorPlans && details.floorPlans.length > 0 && (
        <section id="floorplans">
          <ErrorBoundary sectionName="Floor Plans">
            <ProjectFloorPlans
              floorPlans={details.floorPlans}
              descriptionSections={details.floorPlanDescriptionSections}
              floorPlanPanelQuote={details.floorPlanPanelQuote}
              heading={details.sectionHeadings?.floorPlans}
              description={details.floorPlansIntro}
              propertyId={project.id}
              propertySlug={slug}
              projectTitle={project.title}
            />
          </ErrorBoundary>
        </section>
      )}

      {/* Payment Plans */}
      {details?.paymentPlans && details.paymentPlans.length > 0 && (
        <section id="paymentplans">
          <ErrorBoundary sectionName="Payment Plans">
            <ProjectPaymentPlan
              paymentPlans={details.paymentPlans}
              heading={details.sectionHeadings?.paymentPlans}
              description={details.paymentPlansIntro}
            />
          </ErrorBoundary>
        </section>
      )}

      {/* Design & Construction Team */}
      {details?.team && (
        <section id="team">
          <ErrorBoundary sectionName="Team">
            <ProjectTeam
              team={details.team}
              heading={details.sectionHeadings?.team}
              description={details.teamIntro}
            />
          </ErrorBoundary>
        </section>
      )}

      {/* FAQs — SSR markup + FAQPage JSON-LD for SEO */}
      <section id="faqs">
        {details?.faqs && details.faqs.length > 0 && (
          <>
            <ProjectFaqJsonLd faqs={details.faqs.slice(0, MAX_FAQS)} />
            <ProjectFAQ
              faqs={details.faqs}
              heading={details.sectionHeadings?.faqs}
              description={details.faqsIntro}
            />
          </>
        )}
      </section>

      {/* Similar Properties */}
      {similarProjects.length > 0 && (
        <section id="similar">
          <ProjectSimilar projects={similarProjects} />
        </section>
      )}

      {/* Contextual internal links strengthen topical/entity connections for SEO */}
      <section className="py-8 sm:py-9 md:py-10 bg-[#F5F0E8] border-t border-[#C9A961]/10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          <SectionHeading label="Discover More">Explore This Market Further</SectionHeading>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 min-w-0">
            {relatedLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-full border border-[#C9A961]/30 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#2C2416] hover:border-[#C9A961] hover:text-gold transition-colors break-words max-w-full"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

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
