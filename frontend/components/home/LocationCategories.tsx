"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Location } from "@/lib";
import { ArrowRight } from "lucide-react";

interface LocationCategoriesProps {
  locations: Location[];
}

// Sample images for categories - in real app, these would come from database
const categoryImages: Record<string, string> = {
  "luxury-senior-living": "/images/category-senior-living.jpg",
  "villas-himalayas": "/images/category-himalayas.jpg",
};

const categoryDescriptions: Record<string, string> = {
  "luxury-senior-living": "Curated Retirement Homes for the Well-Heeled",
  "villas-himalayas": "Let the Himalayas be your playground",
};

export function LocationCategories({ locations }: LocationCategoriesProps) {
  // Get unique collection categories (filter for featured collections)
  // Filter for states or cities with type "state" or "city"
  const collections = locations
    .filter(l => l.type === "state" || l.type === "city")
    .slice(0, 4);

  // Fallback: if no collections found, show all locations
  const displayCollections = collections.length > 0 ? collections : locations.slice(0, 4);

  if (!displayCollections || displayCollections.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
            Explore by Category
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
            Curated <span className="text-gold-dark">Collections</span>
          </h2>
        </motion.div>

        {/* Bento Grid Layout - Uneven & Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-4 h-auto md:h-[700px]">
          {displayCollections.map((location, index) => {
            // Define grid positions for a balanced but uneven look
            const gridClasses = [
              "md:col-span-2 md:row-span-2", // Large primary box
              "md:col-span-2 md:row-span-1", // Wide horizontal box
              "md:col-span-1 md:row-span-1", // Small square box
              "md:col-span-1 md:row-span-1", // Small square box
            ];

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${gridClasses[index] || "md:col-span-1"} relative rounded-2xl overflow-hidden group shadow-xl`}
              >
                <Link href={`/location/${location.slug}`} className="block h-full w-full">
                  <div className="relative h-full w-full min-h-[300px] md:min-h-0">
                    <Image
                      src={categoryImages[location.slug] || `/images/category-${index % 2 === 0 ? 'delhi' : 'noida'}.jpg`}
                      alt={location.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Dynamic Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:via-black/40" />

                    {/* Content */}
                    <div className={`absolute inset-0 p-8 flex flex-col ${index === 0 ? 'justify-end md:justify-center md:items-center text-center' : 'justify-end'}`}>
                      {index === 0 && (
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="hidden md:block text-gold text-xs font-bold tracking-widest uppercase mb-4"
                        >
                          Featured Destination
                        </motion.span>
                      )}

                      <h3 className={`${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} font-serif font-bold text-white mb-2 leading-tight`}>
                        {location.name}
                      </h3>

                      <p className={`text-white/80 line-clamp-2 leading-relaxed ${index === 0 ? 'max-w-md mx-auto text-base' : 'max-w-xs text-sm'}`}>
                        {categoryDescriptions[location.slug] || `Explore exclusive premium residential and commercial spaces in ${location.name}.`}
                      </p>

                      <div className="mt-6 flex items-center gap-3 text-gold opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <span className="text-xs font-bold uppercase tracking-wider">Explore Collection</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
