"use client";

import { SplitSection } from "@/components/ui/SplitSection";
import { MapPin, Navigation } from "lucide-react";

interface ProjectLocationProps {
  location: {
    mapImage?: string;
    nearby: {
      category: string;
      items: { name: string; distance: string }[];
    }[];
  };
}

export function ProjectLocation({ location }: ProjectLocationProps) {
  return (
    <SplitSection
      title="Location & Connectivity"
      subtitle="Strategically located with seamless connectivity to all major landmarks, ensuring you are never far from what matters."
      image={location.mapImage || "/images/project-4.jpg"} // Using a project image as fallback if map missing
      imageAlt="Location Map"
      reversed={false}
      className="bg-transparent"
      content={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {location.nearby.map((category) => (
            <div key={category.category}>
               <h3 className="text-lg font-serif font-bold text-black mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gold-dark" />
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm border-b border-zinc-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-600 font-medium">{item.name}</span>
                    <span className="text-gold-dark font-bold text-xs bg-gold/5 px-2 py-1 rounded-full">{item.distance}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      }
    />
  );
}
