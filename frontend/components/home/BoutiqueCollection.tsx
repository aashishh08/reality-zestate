"use client";

import Image from "next/image";
import { NewTabLink } from "@/components/ui/NewTabLink";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PropertyItem } from "@/types/property-listing";
import { listingCardImageUrl } from "@/lib/listing-card-image";

interface BoutiqueCollectionProps {
  /** From `fetchHomeSectionProperties('boutique')` — API uses `featured` tag */
  properties: PropertyItem[];
}

export function BoutiqueCollection({ properties }: BoutiqueCollectionProps) {
  if (!properties.length) return null;

  const display = properties.slice(0, 4);

  const bentoClasses = [
    "md:col-span-3 md:row-span-2",
    "md:col-span-3 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
  ];

  return (
    <section id="boutique-projects" className="py-24 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm"
          >
            Rare & Remarkable
          </motion.h4>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight"
          >
            Boutique <span className="text-gold">Collection</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Featured developments from our portfolio — updated from live listings tagged{" "}
            <span className="text-charcoal font-medium">Featured</span>.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[900px]">
          {display.map((property, index) => {
            const img = listingCardImageUrl(property);
            const tagLabel = property.Tags?.find((t) => t.slug?.toLowerCase() === "featured")?.name ?? "Featured";

            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${bentoClasses[index] || "md:col-span-2"} group relative rounded-sm overflow-hidden bg-white shadow-2xl`}
              >
                <NewTabLink href={`/projects/${property.slug}`} className="block h-full w-full">
                  <div className="relative h-full w-full min-h-[400px] md:min-h-0">
                    <Image
                      src={img}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-700" />

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block"
                      >
                        {tagLabel}
                      </motion.span>

                      <motion.h3
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`${
                          index === 0 ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
                        } font-serif font-medium text-white mb-4 leading-tight group-hover:text-gold transition-colors duration-500`}
                      >
                        {property.title}
                      </motion.h3>

                      <div className="w-12 h-[1px] bg-gold-dark/50 group-hover:w-full transition-all duration-1000 origin-left mb-6" />

                      <div className="flex justify-between items-center pr-2">
                        <p className="text-white/60 text-xs font-serif max-w-[220px] line-clamp-2">
                          {property.Location?.name ? `${property.Location.name}` : "India"}
                          {property.Developer?.name ? ` · ${property.Developer.name}` : ""}
                        </p>

                        <motion.div
                          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-500"
                          whileHover={{ rotate: 45 }}
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
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
