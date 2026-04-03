"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  children,
  label,
  description,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 flex flex-col ${centered ? "items-center" : "items-start"}`}
    >
      {/* Optional label */}
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-[#C9A961]"
        >
          {label}
        </motion.p>
      )}

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-4xl md:text-5xl font-serif text-[#1A1A2E] leading-tight ${centered ? "text-center" : ""} ${className}`}
      >
        {children}
      </motion.h2>

      {/* Optional description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-4 max-w-2xl font-sans text-lg leading-relaxed text-gray-500 ${centered ? "text-center" : ""}`}
        >
          {description}
        </motion.p>
      )}

      {/* Gold accent line — bottom */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="h-[3px] bg-gradient-to-r from-[#C9A961] to-[#D4AF7C] rounded-full mt-6"
      />
    </div>
  );
}
