"use client";

import { motion } from "framer-motion";
import { Project } from "@/types";
import { PropertyCard } from "@/components/ui/PropertyCard";

interface CategoryPropertyGridProps {
  categoryTitle: string;
  projects: Project[];
}

export function CategoryPropertyGrid({ categoryTitle, projects }: CategoryPropertyGridProps) {
  return (
    <section className="py-20 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-3">
            Featured projects —{" "}
            <span className="text-gold">{categoryTitle}</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-gold to-gold-dark rounded-full mx-auto md:mx-0" />
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <PropertyCard project={project} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-600 py-12 text-lg">
            No published listings in this collection yet. Check back soon or contact us for priority access.
          </p>
        )}
      </div>
    </section>
  );
}
