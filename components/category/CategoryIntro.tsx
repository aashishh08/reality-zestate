"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CategoryIntroProps {
  text: string;
  categoryTitle?: string;
}

export function CategoryIntro({ text, categoryTitle }: CategoryIntroProps) {
  return (
    <section className="py-16 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-zinc-600 mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium">
            {categoryTitle || "Category"}
          </span>
        </motion.nav>

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 uppercase tracking-wide">
            {categoryTitle || "Senior Living in India"}
          </h2>
          <p className="text-lg md:text-xl text-zinc-700 leading-relaxed">
            {text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
