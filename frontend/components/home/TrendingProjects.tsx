"use client";

import Link from "next/link";
import { Property } from "@/types";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { MoveRight } from "lucide-react";

interface TrendingProjectsProps {
  properties: Property[];
}

export function TrendingProjects({ properties }: TrendingProjectsProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

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

          <Link
            href="/projects"
            className="hidden md:flex items-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group"
          >
            View All Projects
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.slice(0, 4).map((property, index) => {
            // Ensure property has all required fields
            if (!property?.slug || !property?.title) {
              return null;
            }
            
            return (
              <PropertyCard 
                key={property.id} 
                project={{
                  ...property,
                  location: property.Location?.name || "India",
                  price: property.priceMin ? `₹ ${Math.floor(property.priceMin / 10000000)}Cr` : "Price on Request",
                  image: "/images/project-1.jpg", // Use placeholder since backend doesn't have image
                  category: "Trending" as const,
                }}
                index={index}
              />
            );
          })}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/projects"
            className="flex items-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group w-full justify-center"
          >
            View All Projects
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
