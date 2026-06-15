"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Project } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectSimilarProps {
  projects: Project[];
}

export function ProjectSimilar({ projects }: ProjectSimilarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  if (!projects || projects.length === 0) return null;

  const items = projects.slice(0, 3);

  return (
    <section className="py-12 bg-[#F0EFEB] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="You May Also Like"
            description="Explore other luxury properties that might interest you"
          >
            Similar Properties
          </SectionHeading>
        </div>

        {/* Mobile — horizontal scroll (like Upcoming Launches) */}
        <div
          ref={containerRef}
          className="md:hidden flex gap-4 overflow-x-auto overscroll-x-contain pb-6 px-4 snap-x snap-mandatory no-scrollbar [-webkit-overflow-scrolling:touch]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="min-w-[240px] sm:min-w-[260px] w-[72vw] max-w-[280px] shrink-0 snap-center"
            >
              <PropertyCard
                project={project}
                index={index}
                imageSizes="280px"
              />
            </motion.div>
          ))}
          <div className="w-2 shrink-0" aria-hidden />
        </div>

        {/* Scroll progress — mobile */}
        {items.length > 1 && (
          <div className="md:hidden max-w-7xl mx-auto px-4 mt-1">
            <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                style={{ scaleX: scrollXProgress, transformOrigin: "0%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
              <span>SCROLL TO EXPLORE</span>
              <span>{items.length} PROPERTIES</span>
            </div>
          </div>
        )}

        {/* md+ — grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-6 lg:px-8">
          {items.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PropertyCard
                project={project}
                index={index}
                imageSizes="(max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
