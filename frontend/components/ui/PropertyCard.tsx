"use client";

import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, BedDouble, Bath, Square } from "lucide-react";

interface PropertyCardProps {
  project: Project;
  index: number;
}

export function PropertyCard({ project, index }: PropertyCardProps) {
  if (!project?.slug || !project?.title) {
    return null; // Don't render if essential fields are missing
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative w-full aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
      >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        {/* Gradient Overlay - Lighter Premium Feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      {/* Floating Category Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-white/90 backdrop-blur-md shadow-sm text-charcoal px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
          {project.category}
        </span>
      </div>

      {/* Price Tag - Top Right */}
      <div className="absolute top-6 right-6 z-10 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
         <span className="text-gold font-serif text-lg font-bold drop-shadow-md">
            {project.price}
         </span>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="text-2xl font-serif font-medium mb-2 leading-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-white/20 mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

        {/* Specs & CTA - Hidden initially or subtle */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <div className="flex items-center gap-4 text-sm text-white/80">
             <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> 4</span>
             <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> 4</span>
             <span className="flex items-center gap-1"><Square className="w-3 h-3" /> 3200 sqft</span>
          </div>
          
          <button className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black hover:bg-white transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}
