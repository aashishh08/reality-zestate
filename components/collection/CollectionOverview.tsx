"use client";

import { Project } from "@/types";
import { motion } from "framer-motion";

interface CollectionOverviewProps {
  collection: Project;
}

export function CollectionOverview({ collection }: CollectionOverviewProps) {
  return (
    <section id="collection-content" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg p-8 md:p-12 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Logo/Brand Section - Left */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-2">
                  {collection.title}
                </h2>
                <p className="text-gold text-sm tracking-widest uppercase">
                  {collection.type}
                </p>
              </div>
            </div>

            {/* Description - Right */}
            <div>
              <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                About the Collection
              </h3>
              <p className="text-zinc-600 leading-relaxed mb-4">
                {collection.description}
              </p>
              <p className="text-zinc-600 leading-relaxed">
                Each property in this exclusive collection has been carefully curated to offer 
                unparalleled luxury, breathtaking views, and world-class amenities. Discover your 
                perfect mountain retreat below.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
