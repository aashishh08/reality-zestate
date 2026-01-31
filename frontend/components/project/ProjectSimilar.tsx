"use client";

import { motion } from "framer-motion";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Project } from "@/types";

interface ProjectSimilarProps {
  projects: Project[];
}

export function ProjectSimilar({ projects }: ProjectSimilarProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 bg-[#F0EFEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif text-[#2C2416] mb-4">
            Similar Properties
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore other luxury properties that might interest you
          </p>
        </motion.div>

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
