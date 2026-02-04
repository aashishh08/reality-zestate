"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Property } from "@/types";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

interface UpcomingProjectsProps {
  properties: Property[];
}

// Client-only component that uses useScroll
function UpcomingProjectsContent({ properties }: UpcomingProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // This hook only runs in this component which is client-only
  const { scrollXProgress } = useScroll({
    container: containerRef,
  });


  return (
    <section id="upcoming-projects" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
          Future Living
        </h4>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
          Upcoming <span className="text-gold-dark">Launches</span>
        </h2>
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-auto pb-12 px-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="w-0 md:w-[calc((100vw-80rem)/2)] shrink-0" /> {/* Left Spacer for large screens */}

        {properties.slice(0, 6).map((property) => (
          <Link
            key={property.id}
            href={`/projects/${property.slug}`}
          >
            <div className="panel relative min-w-[300px] md:min-w-[400px] lg:min-w-[500px] h-[500px] shrink-0 snap-center rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={property.image || "/images/project-1.jpg"}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-gold/90 text-black text-xs font-bold px-3 py-1 rounded inline-block mb-3">
                  COMING SOON
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 text-white/80 mb-4">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>{property.Location?.name || "India"}</span>
                </div>
                <p className="text-white/60 mb-6 line-clamp-2">
                  Experience the epitome of luxury with our upcoming masterpiece in {property.Location?.name || "India"}.
                </p>

                <button className="flex items-center gap-2 text-white font-medium border-b border-gold pb-1 hover:text-gold transition-colors">
                  Register Interest <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}

        <div className="w-6 md:w-[calc((100vw-80rem)/2)] shrink-0" /> {/* Right Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold"
            style={{ scaleX: scrollXProgress, transformOrigin: "0%" }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
          <span>SCROLL TO EXPLORE</span>
          <span>{properties.length} PROJECTS</span>
        </div>
      </div>
    </section>
  );
}

// Main export - handles client-side rendering
export function UpcomingProjects({ properties }: UpcomingProjectsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!properties || properties.length === 0) {
    return null;
  }

  // Don't render component with useScroll until client hydration is complete
  if (!isClient) {
    return (
      <section id="upcoming-projects" className="py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
            Future Living
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
            Upcoming <span className="text-gold-dark">Launches</span>
          </h2>
        </div>
      </section>
    );
  }

  // Only render the content component on client
  return <UpcomingProjectsContent properties={properties} />;
}
