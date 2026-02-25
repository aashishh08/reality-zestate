import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/category-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryIntro } from "@/components/category/CategoryIntro";
import { CategoryFeatures } from "@/components/category/CategoryFeatures";
import { CategoryCityProjects } from "@/components/category/CategoryCityProjects";
import { CategoryContent } from "@/components/category/CategoryContent";
import { CategoryOffer } from "@/components/category/CategoryOffer";
import { LeadForm } from "@/components/category/LeadForm";

// Generate static params for all categories (ISR)
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    keywords: [category.title, "luxury real estate", "premium properties", "Superluxere"],
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
    },
  };
}

// ISR Configuration - Revalidate every 2 hours
export const revalidate = 7200;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <CategoryHero
        title={category.heroTitle}
        subtitle={category.heroSubtitle}
        backgroundImage={`/images/category-${slug}.jpg`}
      />

      {/* Introduction with Breadcrumbs */}
      <CategoryIntro
        text={category.introText}
        categoryTitle={category.title}
      />

      {/* City-wise Projects */}
      {category.citySections && category.citySections.length > 0 && (
        <CategoryCityProjects citySections={category.citySections} />
      )}

      {/* Features/USP */}
      {category.features && category.features.length > 0 && (
        <CategoryFeatures features={category.features} />
      )}

      {/* Content Sections */}
      {category.contentSections && category.contentSections.length > 0 && (
        <CategoryContent sections={category.contentSections} />
      )}

      {/* Special Offer */}
      {category.specialOffer && (
        <CategoryOffer offer={category.specialOffer} />
      )}

      {/* Lead Generation Form */}
      <LeadForm
        offerTitle={category.specialOffer?.title}
        offerValidTill={category.specialOffer?.validTill}
      />

      <Footer />
      <FloatingActions />
    </main>
  );
}
