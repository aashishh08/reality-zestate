"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types";
import { PropertyCard } from "@/components/ui/PropertyCard";

interface CategoryCityProjectsProps {
  citySections: {
    cityName: string;
    citySlug: string;
    projects: Project[];
  }[];
}

export function CategoryCityProjects({ citySections }: CategoryCityProjectsProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {citySections.map((citySection, sectionIndex) => (
          <div 
            key={citySection.citySlug} 
            id={citySection.citySlug}
            className="mb-24 last:mb-0 scroll-mt-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-3">
                Luxury Senior Living Projects in{" "}
                <span className="text-gold">{citySection.cityName}</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-gold to-gold-dark rounded-full" />
            </motion.div>

            {citySection.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {citySection.projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <PropertyCard 
                      project={project} 
                      index={index}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center py-12 bg-zinc-50 rounded-sm border border-zinc-200"
              >
                <p className="text-zinc-600 text-lg">
                  No projects available in {citySection.cityName} at the moment.
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  Check back soon for new luxury senior living developments.
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
