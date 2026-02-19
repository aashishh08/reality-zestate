"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  children: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  children,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-${centered ? "center" : "start"} mb-12`}>
      {/* Gold accent line */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        transition={{ duration: 0.6 }}
        className="h-1 bg-gradient-to-r from-[#C9A961] to-[#D4AF7C] rounded-full mb-6"
      />
      
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-4xl font-serif text-[#2C2416] ${centered ? "text-center" : ""} ${className}`}
      >
        {children}
      </motion.h2>
    </div>
  );
}
