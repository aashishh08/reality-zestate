"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectUSPProps {
  usp: string[];
  projectTitle: string;
}

export function ProjectUSP({ usp, projectTitle }: ProjectUSPProps) {
  return (
    <section id="usp" className="py-24 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionHeading>
            Why Choose <span className="text-gold-dark">{projectTitle}</span>?
          </SectionHeading>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Discover what makes this project truly exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {usp.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4 bg-white p-6 rounded-sm border border-black/5 shadow-sm hover:border-gold-dark transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-gold-dark" />
              </div>
              <p className="text-zinc-700 leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
