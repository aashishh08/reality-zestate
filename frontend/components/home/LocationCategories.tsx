"use client";

import { NewTabLink } from "@/components/ui/NewTabLink";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/lib/api/categories";
import { ArrowRight, LayoutGrid } from "lucide-react";
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

/** Curated collection card art — neutral / category-specific only (no stock project photos). */
const categoryCardImages: Record<string, string> = {
  "senior-living": "/images/category-senior-living.jpg",
};
const DEFAULT_COLLECTION_CARD_IMAGE = "/images/hero-bg.png";

function collectionDescription(cat: Category): string {
  return (
    categoryDescriptions[cat.slug] ||
    `Explore luxury ${cat.name.toLowerCase()} listings on Superluxere — inventory updates from verified developers.`
  );
}

function collectionImage(cat: Category): string {
  return categoryCardImages[cat.slug] || DEFAULT_COLLECTION_CARD_IMAGE;
}

/** Mobile card — matches Browse by Location (`CityLocations`). */
function CollectionMobileCard({ category: cat, index }: { category: Category; index: number }) {
  const desc = collectionDescription(cat);
  const img = collectionImage(cat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <NewTabLink href={`/category/${cat.slug}`} className="block h-full">
        <div className="group relative h-[300px] overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
          <Image
            src={img}
            alt={cat.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2 text-gold/90 text-xs font-medium tracking-wide uppercase">
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Collection</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mb-1 leading-tight line-clamp-2">
              {cat.name}
            </h3>
            <div className="h-auto sm:h-0 sm:group-hover:h-auto overflow-hidden transition-all duration-300">
              <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 sm:transition-transform sm:duration-300">
                {desc}
              </p>
              <span className="inline-flex items-center gap-1.5 text-white text-xs sm:text-sm font-medium border-b border-gold pb-1">
                View properties <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </NewTabLink>
    </motion.div>
  );
}

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

        {/* Mobile — same 2-col grid as Browse by Location */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:hidden">
          {displayCollections.map((cat, index) => (
            <CollectionMobileCard key={cat.id} category={cat} index={index} />
          ))}
        </div>

        {/* md+ — bento layout */}
        <div className="hidden md:grid md:grid-cols-6 md:grid-rows-3 gap-4 h-auto md:h-[880px]">
          {displayCollections.map((cat, index) => {
            const desc = collectionDescription(cat);
            const img = collectionImage(cat);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`${gridClasses[index] || "md:col-span-2"} relative rounded-2xl overflow-hidden group shadow-xl`}
              >
                <NewTabLink href={`/category/${cat.slug}`} className="block h-full w-full">
                  <div className="relative h-full w-full min-h-0">
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
                          className="text-gold text-xs font-bold tracking-widest uppercase mb-4"
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
                </NewTabLink>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
