"use client";

import Image from "next/image";
import { Project } from "@/types";
import { LeadForm } from "@/components/category/LeadForm";
import { ChevronDown } from "lucide-react";

interface CollectionHeroProps {
  collection: Project;
}

export function CollectionHero({ collection }: CollectionHeroProps) {
  const scrollToContent = () => {
    const contentSection = document.getElementById("collection-content");
    contentSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Lead Form - Positioned on the left */}
      <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 z-20 hidden lg:block">
        <LeadForm />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight max-w-5xl">
          {collection.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide mb-4">
          {collection.type}
        </p>
        <p className="text-lg md:text-xl text-white/80 font-light tracking-wider uppercase">
          {collection.location}
        </p>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group"
        aria-label="Scroll to content"
      >
        <span className="text-sm tracking-widest uppercase">Explore</span>
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2 group-hover:border-white transition-colors">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </button>
    </section>
  );
}
