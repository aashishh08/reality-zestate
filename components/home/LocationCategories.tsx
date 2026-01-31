"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { locationCategories } from "@/lib/categories";
import { ArrowRight } from "lucide-react";

export function LocationCategories() {
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

        {/* Grid Layout - Masonry Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large Cards - First Row */}
          {locationCategories.slice(0, 2).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/category/${category.slug}`}>
                <div className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 tracking-wider">
                      {category.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base mb-6 max-w-md">
                      {category.subtitle}
                    </p>
                    <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 flex items-center gap-2 group-hover:gap-3">
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Smaller Cards - Second Row */}
          {locationCategories.slice(2).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <Link href={`/category/${category.slug}`}>
                <div className="group relative h-[250px] overflow-hidden rounded-sm cursor-pointer">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-opacity duration-300" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 tracking-wide">
                      {category.title}
                    </h3>
                    <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-5 py-1.5 rounded-full text-xs font-medium hover:bg-gold hover:text-black hover:border-gold transition-all duration-300">
                      Explore
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
