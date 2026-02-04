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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {boutiques.map((boutique, index) => (
            <Link
              key={boutique.id}
              href={`/collection/${boutique.slug}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-sm mb-6">
                  <Image
                    src={"/images/project-1.jpg"}
                    alt={boutique.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-serif font-medium text-black mb-2 group-hover:text-gold-dark transition-colors">
                      {boutique.name}
                    </h3>
                    <p className="text-zinc-600 text-sm mb-4">
                      Curated luxury experiences
                    </p>
                  </div>
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ rotate: 45 }}
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
