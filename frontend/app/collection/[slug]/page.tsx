import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { LeadPopup } from "@/components/ui/LeadPopup";
import { CollectionHero } from "@/components/collection/CollectionHero";
import { CollectionOverview } from "@/components/collection/CollectionOverview";
import { CollectionProjects } from "@/components/collection/CollectionProjects";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = getProjectBySlug(params.slug);

  if (!collection || !collection.subProjects) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CollectionHero collection={collection} />
      <CollectionOverview collection={collection} />
      <CollectionProjects projects={collection.subProjects} />
      <Footer />
      <FloatingActions />
      <LeadPopup />
    </main>
  );
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const collection = getProjectBySlug(params.slug);

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${collection.title} | Opulnz Abode`,
    description: collection.description || `Luxury ${collection.type} in ${collection.location}`,
  };
}
