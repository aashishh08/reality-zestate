"use client";

import Image from "next/image";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { details } = project;
  
  if (!details) return null;

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={details.heroImage}
          alt={project.title}
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light mb-6">
              {details.subtitle}
            </p>
            <p className="text-lg text-white/70 mb-8">
              📍 {project.location}
            </p>
            
            <button className="bg-gradient-to-r from-gold to-gold-dark text-white px-8 py-4 rounded-sm font-bold tracking-wide hover:shadow-lg transition-all duration-300 flex items-center gap-3 group transform hover:-translate-y-1">
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Brochure
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
