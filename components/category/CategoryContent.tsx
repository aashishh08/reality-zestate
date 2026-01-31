"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CategoryContentProps {
  sections: {
    title: string;
    content: string;
    image?: string;
  }[];
}

// Default background images for each section
const defaultImages: Record<string, string> = {
  "Health Assistance": "/images/health-assistance.jpg",
  "Specialised Therapies": "/images/specialized-therapies.jpg",
  "Emotional Wellness": "/images/emotional-wellness.jpg",
  "Luxury Living": "/images/luxury-living.jpg",
};

export function CategoryContent({ sections }: CategoryContentProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            What We <span className="text-gold">Offer</span>
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Comprehensive care and luxury amenities designed for your comfort and well-being.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative h-[400px] md:h-[450px] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={section.image || defaultImages[section.title] || "/images/project-1.jpg"}
                  alt={section.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 group-hover:via-black/70 transition-all duration-500" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 group-hover:text-gold transition-colors duration-300">
                    {section.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed text-base md:text-lg line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    {section.content}
                  </p>
                </motion.div>

                {/* Decorative Line */}
                <div className="mt-6 w-16 h-1 bg-gold group-hover:w-24 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
