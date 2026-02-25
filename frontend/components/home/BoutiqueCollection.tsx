"use client";

import Image from "next/image";
import Link from "next/link";
import { Location } from "@/lib";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface BoutiqueCollectionProps {
  locations: Location[];
}

export function BoutiqueCollection({ locations }: BoutiqueCollectionProps) {
  // Get featured collections (first 2-4 items)
  const boutiques = locations.slice(0, 4);

  if (!boutiques || boutiques.length === 0) {
    return null;
  }

  return (
    <section id="boutique-projects" className="py-24 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
            Rare & Remarkable
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black">
            Boutique <span className="text-gold-dark">Collection</span>
          </h2>
        </div>

        {/* Full Bento Grid Layout for Boutique Collection */}
        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[900px]">
          {boutiques.map((boutique, index) => {
            // Define unique grid spans for each boutique item
            const bentoClasses = [
              "md:col-span-3 md:row-span-2", // Large Primary
              "md:col-span-3 md:row-span-1", // Horizontal Middle
              "md:col-span-1 md:row-span-1", // Small square
              "md:col-span-2 md:row-span-1", // Small-medium horizontal
            ];

            return (
              <motion.div
                key={boutique.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${bentoClasses[index] || "md:col-span-2"} group relative rounded-sm overflow-hidden bg-white shadow-2xl`}
              >
                <Link href={`/collection/${boutique.slug}`} className="block h-full w-full">
                  <div className="relative h-full w-full min-h-[400px] md:min-h-0">
                    <Image
                      src={`/images/project-${(index % 3) + 1}.jpg`}
                      alt={boutique.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />

                    {/* Artistic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-700" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="overflow-hidden">
                        <motion.span
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + (index * 0.1) }}
                          className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block"
                        >
                          Exclusive Collection
                        </motion.span>
                      </div>

                      <div className="overflow-hidden">
                        <motion.h3
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + (index * 0.1) }}
                          className={`${index === 0 ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'} font-serif font-medium text-white mb-4 leading-tight group-hover:text-gold transition-colors duration-500`}
                        >
                          {boutique.name}
                        </motion.h3>
                      </div>

                      <div className="w-12 h-[1px] bg-gold-dark/50 group-hover:w-full transition-all duration-1000 origin-left mb-6" />

                      <div className="flex justify-between items-center pr-2">
                        <p className="text-white/60 text-xs italic font-serif max-w-[200px] line-clamp-2">
                          "Defining the future of luxury living through rare architecture."
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
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
