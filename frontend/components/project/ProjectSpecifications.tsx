"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectSpecificationsProps {
  specifications: {
    category: string;
    items: string[];
  }[];
}

export function ProjectSpecifications({ specifications }: ProjectSpecificationsProps) {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionHeading>
            Premium <span className="text-gold-dark">Specifications</span>
          </SectionHeading>
          <p className="text-zinc-600 max-w-2xl mx-auto">
             Meticulously crafted details that define luxury living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {specifications.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-serif font-bold text-black mb-6 flex items-center gap-3 border-b border-black/5 pb-3">
                <Layers className="w-5 h-5 text-gold-dark" />
                {spec.category}
              </h3>
              <ul className="space-y-4">
                {spec.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dark mt-2 shrink-0" />
                    <span className="text-zinc-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
