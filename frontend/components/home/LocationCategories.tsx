"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/lib/api/categories";
import { ArrowRight } from "lucide-react";
import { CURATED_COLLECTION_SLUGS } from "@/lib/constants";

interface LocationCategoriesProps {
  categories: Category[];
}

const categoryDescriptions: Record<string, string> = {
  "golf-residences": "Fairway-front homes and golf-tied estates",
  "branded-residences": "Hotel-grade service and global design houses",
  "himalayan-living": "Altitude retreats with room to breathe",
  "senior-living": "Premium ageing-in-place with care clarity",
  "ultra-villas": "Land-rich compounds and bespoke villas",
  "off-market": "Discreet inventory — by introduction only",
};

const categoryCardImages: Record<string, string> = {
  "golf-residences": "/images/project-1.jpg",
  "branded-residences": "/images/project-2.jpg",
  "himalayan-living": "/images/project-3.jpg",
  "senior-living": "/images/category-senior-living.jpg",
  "ultra-villas": "/images/project-1.jpg",
  "off-market": "/images/project-2.jpg",
};

export function LocationCategories({ categories }: LocationCategoriesProps) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  const displayCollections = CURATED_COLLECTION_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is Category => Boolean(c),
  );

  if (!displayCollections.length) {
    return null;
  }

  const gridClasses = [
    "md:col-span-3 md:row-span-2",
    "md:col-span-3 md:row-span-1",
    "md:col-span-3 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-2 md:row-span-1",
  ];

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 px-4">
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm"
          >
            Explore by Category
          </motion.h4>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight"
          >
            Curated <span className="text-gold">Collections</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Discover exclusive properties by lifestyle—from golf-side compounds to Himalayan retreats and off-market access.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-4 h-auto md:h-[880px]">
          {displayCollections.map((cat, index) => {
            const desc =
              categoryDescriptions[cat.slug] ||
              `Explore luxury ${cat.name.toLowerCase()} listings on Superluxere — inventory updates from verified developers.`;
            const img = categoryCardImages[cat.slug] || "/images/hero-bg.png";

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`${gridClasses[index] || "md:col-span-2"} relative rounded-2xl overflow-hidden group shadow-xl`}
              >
                <Link href={`/category/${cat.slug}`} className="block h-full w-full">
                  <div className="relative h-full w-full min-h-[300px] md:min-h-0">
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:via-black/40" />

                    <div
                      className={`absolute inset-0 p-8 flex flex-col ${
                        index === 0
                          ? "justify-end md:justify-center md:items-center text-center"
                          : "justify-end"
                      }`}
                    >
                      {index === 0 && (
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="hidden md:block text-gold text-xs font-bold tracking-widest uppercase mb-4"
                        >
                          Signature Collections
                        </motion.span>
                      )}

                      <h3
                        className={`${
                          index === 0 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                        } font-serif font-bold text-white mb-2 leading-tight`}
                      >
                        {cat.name}
                      </h3>

                      <p
                        className={`text-white/80 line-clamp-2 leading-relaxed ${
                          index === 0 ? "max-w-md mx-auto text-base" : "max-w-xs text-sm"
                        }`}
                      >
                        {desc}
                      </p>

                      <div className="mt-6 flex items-center gap-3 text-gold opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <span className="text-xs font-bold uppercase tracking-wider">View properties</span>
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
