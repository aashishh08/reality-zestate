"use client";

import { motion } from "framer-motion";

interface ProjectKeyTakeawaysProps {
  takeaways: string[];
  highlights?: {
    landArea?: string;
    possession?: string;
    rera?: string;
    configuration?: string;
    priceRange?: string;
  };
}

export function ProjectKeyTakeaways({ takeaways, highlights }: ProjectKeyTakeawaysProps) {
  const metaItems = highlights ? [
    highlights.landArea && { label: "Land Area", value: highlights.landArea, icon: "📐" },
    highlights.possession && { label: "Possession", value: highlights.possession, icon: "🗓️" },
    highlights.rera && { label: "RERA", value: highlights.rera, icon: "✅" },
    highlights.configuration && { label: "Configuration", value: highlights.configuration, icon: "🏠" },
    highlights.priceRange && { label: "Price Range", value: highlights.priceRange, icon: "💰" },
  ].filter(Boolean) as { label: string; value: string; icon: string }[] : [];

  return (
    <div className="bg-gradient-to-br from-[#2C2416] to-[#3D3021] rounded-2xl p-8 shadow-2xl h-full">
      <h3 className="text-2xl font-serif text-[#C9A961] mb-6 border-b border-[#C9A961]/30 pb-4">
        Key Takeaways
      </h3>
      
      {/* Highlights Section */}
      {metaItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 pb-6 border-b border-white/10">
          {metaItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all text-center"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-[#C9A961] text-xs uppercase tracking-wider mb-1">
                {item.label}
              </div>
              <div className="text-white text-sm font-medium">{item.value}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Takeaways List */}
      <div className="grid grid-cols-2 gap-4">
        {takeaways.map((takeaway, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-[#C9A961] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{takeaway}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
