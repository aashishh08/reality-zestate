"use client";

import { SplitSection } from "@/components/ui/SplitSection";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectAmenitiesProps {
  amenities: {
    name: string;
    icon: string;
    image?: string;
  }[];
}

export function ProjectAmenities({ amenities }: ProjectAmenitiesProps) {
  return (
    <section id="amenities" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionHeading>
            World-Class <span className="text-gold-dark">Amenities</span>
          </SectionHeading>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Experience a lifestyle of unparalleled luxury with our curated selection of premium amenities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${amenity.image || '/images/project-1.jpg'})` 
                }}
              />
              
              {/* Lighter Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:via-black/20 transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 text-4xl group-hover:bg-gold-dark group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-md">
                  {amenity.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2 tracking-wide drop-shadow-md">{amenity.name}</h3>
                <div className="w-8 h-0.5 bg-gold-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
