"use client";

import { motion } from "framer-motion";

interface ProjectMetaProps {
  highlights: {
    landArea?: string;
    possession?: string;
    rera?: string;
    configuration?: string;
    priceRange?: string;
  };
}

export function ProjectMeta({ highlights }: ProjectMetaProps) {
  const metaItems = [
    highlights.landArea && { label: "Land Area", value: highlights.landArea, icon: "📐" },
    highlights.possession && { label: "Possession", value: highlights.possession, icon: "🗓️" },
    highlights.rera && { label: "RERA", value: highlights.rera, icon: "✅" },
    highlights.configuration && { label: "Configuration", value: highlights.configuration, icon: "🏠" },
    highlights.priceRange && { label: "Price Range", value: highlights.priceRange, icon: "💰" },
  ].filter(Boolean) as { label: string; value: string; icon: string }[];

  if (metaItems.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-[#2C2416] to-[#3D3021] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {metaItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-[#C9A961] text-xs uppercase tracking-wider mb-1 font-light">
                {item.label}
              </div>
              <div className="text-white text-sm font-medium">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
