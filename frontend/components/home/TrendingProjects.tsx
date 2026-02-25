"use client";

import Link from "next/link";
import { PropertyItem } from "@/types/property-listing";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { MoveRight, TrendingUp } from "lucide-react";

interface TrendingProjectsProps {
  properties: PropertyItem[];
}

export function TrendingProjects({ properties }: TrendingProjectsProps) {
  if (!properties || properties.length === 0) return null;

  const display = properties.slice(0, 4);

  return (
    <section id="trending-projects" className="py-24 px-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h4 className="text-gold font-medium tracking-[0.2em] uppercase text-sm">
                Trending Now
              </h4>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
              Trending <span className="text-gold-dark">Projects</span>
            </h2>
            <p className="mt-4 text-zinc-500 text-base">
              High-interest properties our clients are actively enquiring about this week.
            </p>
          </div>

          <Link
            href="/tag/trending"
            className="hidden md:flex items-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group"
          >
            View All Trending
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {display.map((property, index) => {
            if (!property?.slug || !property?.title) return null;

            // Extract the first tag's colour for the badge (if available)
            const firstTag = property.Tags?.[0];

            return (
              <PropertyCard
                key={property.id}
                project={{
                  id: property.id,
                  slug: property.slug,
                  title: property.title,
                  propertyType: property.propertyType,
                  priceMin: property.priceMin,
                  priceMax: property.priceMax,
                  isPublished: property.isPublished,
                  Developer: property.Developer,
                  Location: property.Location
                    ? { ...property.Location, type: "city" }
                    : undefined,
                  Tags: property.Tags,
                  location: property.Location?.name || "India",
                  price: property.priceMin
                    ? `₹ ${(property.priceMin / 10_000_000).toFixed(1)}Cr`
                    : "Price on Request",
                  image: "/images/project-1.jpg",
                  category: (firstTag?.name || "Trending") as string,
                  tagColor: firstTag?.color,
                }}
                index={index}
              />
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/tag/trending"
            className="flex items-center gap-3 px-6 py-3 border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black transition-all group w-full justify-center"
          >
            View All Trending
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
