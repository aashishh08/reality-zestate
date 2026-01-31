"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Project } from "@/types";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { projects } from "@/lib/data";

export function UpcomingProjects() {
  const upcomingProjects = projects.filter((p) => p.category === "Upcoming");
  const containerRef = useRef<HTMLDivElement>(null);

  // Horizontal Scroll Setup
  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  return (
    <section id="upcoming-projects" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
          Future Living
        </h4>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
          Upcoming <span className="text-gold-dark">Launches</span>
        </h2>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="flex gap-8 overflow-x-auto pb-12 px-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="w-0 md:w-[calc((100vw-80rem)/2)] shrink-0" /> {/* Left Spacer for large screens */}
        
        {upcomingProjects.map((project, index) => (
          <div 
            key={project.id} 
            className="panel relative min-w-[300px] md:min-w-[400px] lg:min-w-[500px] h-[500px] shrink-0 snap-center rounded-2xl overflow-hidden group cursor-pointer"
          >
             <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
             
             <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="bg-gold/90 text-black text-xs font-bold px-3 py-1 rounded inline-block mb-3">
                  COMING SOON
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-white/80 mb-4">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>{project.location}</span>
                </div>
                <p className="text-white/60 mb-6 line-clamp-2">
                  Experience the epitome of luxury with our upcoming masterpiece in {project.location.split(',')[0]}.
                </p>
                
                <button className="flex items-center gap-2 text-white font-medium border-b border-gold pb-1 hover:text-gold transition-colors">
                  Register Interest <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        ))}
        
        <div className="w-6 md:w-[calc((100vw-80rem)/2)] shrink-0" /> {/* Right Spacer */}
      </div>
      
      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gold"
            style={{ scaleX: scrollXProgress, transformOrigin: "0%" }}
          />
        </div>
         <div className="flex justify-between text-xs text-zinc-400 mt-2 font-medium">
            <span>SCROLL TO EXPLORE</span>
            <span>{upcomingProjects.length} PROJECTS</span>
         </div>
      </div>
    </section>
  );
}
