"use client";

import { motion } from "framer-motion";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Project } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectSimilarProps {
  projects: Project[];
}

export function ProjectSimilar({ projects }: ProjectSimilarProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-12 bg-[#F0EFEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionHeading
            label="You May Also Like"
            description="Explore other luxury properties that might interest you"
          >
            Similar Properties
          </SectionHeading>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard project={project} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
