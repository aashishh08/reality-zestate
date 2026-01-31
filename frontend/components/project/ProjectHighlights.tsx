"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, FileText, Home, IndianRupee } from "lucide-react";

interface ProjectHighlightsProps {
  highlights: {
    landArea?: string;
    possession?: string;
    rera?: string;
    configuration?: string;
    priceRange?: string;
  };
}

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  const items = [
    { icon: MapPin, label: "Land Area", value: highlights.landArea },
    { icon: Calendar, label: "Possession", value: highlights.possession },
    { icon: FileText, label: "RERA", value: highlights.rera },
    { icon: Home, label: "Configuration", value: highlights.configuration },
    { icon: IndianRupee, label: "Price Range", value: highlights.priceRange },
  ].filter(item => item.value);

  return (
    <section className="py-12 bg-transparent border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-sm border border-black/5 shadow-sm hover:border-gold transition-colors"
            >
              <item.icon className="w-6 h-6 text-gold-dark mb-3" />
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm md:text-base font-bold text-black">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
