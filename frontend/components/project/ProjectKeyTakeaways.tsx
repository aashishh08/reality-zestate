"use client";

import { motion } from "framer-motion";

interface ProjectKeyTakeawaysProps {
  takeaways: string[];
}

export function ProjectKeyTakeaways({ takeaways }: ProjectKeyTakeawaysProps) {
  return (
    <div className="bg-gradient-to-br from-[#2C2416] to-[#3D3021] rounded-2xl p-8 shadow-2xl h-full">
      <h3 className="text-2xl font-serif text-[#C9A961] mb-6 border-b border-[#C9A961]/30 pb-4">
        Key Takeaways
      </h3>
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
