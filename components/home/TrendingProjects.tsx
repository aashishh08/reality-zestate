"use client";

import { projects } from "@/lib/data";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { MoveRight } from "lucide-react";

export function TrendingProjects() {
  const trendingProjects = projects.filter((p) => p.category === "Trending");

  return (
    <section id="trending-projects" className="py-24 px-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
             <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
              Discover Excellence
             </h4>
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
              Trending <span className="text-gold-dark">Projects</span>
            </h2>
          </div>
          
          <button className="hidden md:flex items-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group">
            View All Projects
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProjects.map((project, index) => (
            <PropertyCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
           <button className="flex items-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group w-full justify-center">
            View All Projects
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
