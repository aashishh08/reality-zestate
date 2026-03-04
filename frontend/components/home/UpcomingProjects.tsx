"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { PropertyItem } from "@/types/property-listing";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface UpcomingProjectsProps {
  properties: PropertyItem[];
}

// Inner component — uses useScroll (client only)
function UpcomingProjectsContent({ properties }: UpcomingProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  return (
    <section id="upcoming-projects" className="py-24 bg-transparent overflow-hidden">
      <div className="text-center mb-16 px-4 max-w-7xl mx-auto">
        <motion.h4
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm"
        >
          Future Living
        </motion.h4>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight"
        >
          Upcoming <span className="text-gold">Launches</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Register your interest early and be first in line for pre-launch pricing on the most anticipated luxury developments.
        </motion.p>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-auto pb-12 px-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="w-0 md:w-[calc((100vw-80rem)/2)] shrink-0" />

        {properties.slice(0, 6).map((property) => (
          <Link key={property.id} href={`/projects/${property.slug}`}>
            <div className="panel relative min-w-[300px] md:min-w-[400px] lg:min-w-[500px] h-[500px] shrink-0 snap-center rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={"/images/project-1.jpg"}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Tags ribbon */}
              {property.Tags && property.Tags.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {property.Tags.slice(0, 2).map(tag => (
                    <span
                      key={tag.slug}
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: `${tag.color || "#F59E0B"}22`,
                        color: tag.color || "#F59E0B",
                        border: `1px solid ${tag.color || "#F59E0B"}60`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

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
                {property.priceMin && (
                  <p className="text-gold text-sm font-semibold mb-4">
                    Starting ₹ {(property.priceMin / 10_000_000).toFixed(1)} Cr
                  </p>
                )}
                <button className="flex items-center gap-2 text-white font-medium border-b border-gold pb-1 hover:text-gold transition-colors">
                  Register Interest <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}

        <div className="w-6 md:w-[calc((100vw-80rem)/2)] shrink-0" />
      </div>

      {/* Scroll progress */}
      <div className="max-w-7xl mx-auto px-6 mt-2">
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

      {/* Mobile CTA */}
      <div className="mt-8 px-6 md:hidden">
        <Link
          href="/tag/upcoming"
          className="flex items-center justify-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group w-full"
        >
          View All Upcoming
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

// Main export — defers to client after hydration (useScroll requirement)
export function UpcomingProjects({ properties }: UpcomingProjectsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  if (!properties || properties.length === 0) return null;

  if (!isClient) {
    return (
      <section id="upcoming-projects" className="py-24 bg-transparent overflow-hidden">
        <div className="text-center mb-16 px-4 max-w-7xl mx-auto">
          <h4 className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm">
            Future Living
          </h4>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight">
            Upcoming <span className="text-gold">Launches</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Register your interest early and be first in line for pre-launch pricing on the most anticipated luxury developments.
          </p>
        </div>
      </section>
    );
  }

  return <UpcomingProjectsContent properties={properties} />;
}
