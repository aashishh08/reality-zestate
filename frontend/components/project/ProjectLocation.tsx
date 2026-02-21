"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Heart, ShoppingBag, MapPin, Plane, Map, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectLocationProps {
  location: {
    address?: string;
    mapImage?: string;
    nearby: {
      category: string;
      icon?: string;
      items: { name: string; distance?: string }[];
    }[];
    connectivity?: {
      place: string;
      icon?: string;
      time: string;
    }[];
  };
}

const categoryIcons = {
  education: BookOpen,
  healthcare: Heart,
  shopping: ShoppingBag,
  default: MapPin,
};

const categoryColors = {
  education: "#3B82F6",
  healthcare: "#EF4444",
  shopping: "#A855F7",
  default: "#C9A961",
};

const connectivityIcons = {
  airport: Plane,
  location: MapPin,
  building: Building2,
  default: MapPin,
};

export function ProjectLocation({ location }: ProjectLocationProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionHeading
            label="Prime Address"
            description="Strategically located on Golf Course Road, offering unmatched connectivity to business districts, airports, and lifestyle destinations"
          >
            Location Advantage
          </SectionHeading>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Map Image with Label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px]"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={location.mapImage || "/images/project-4.jpg"}
                alt="Location Map"
                fill
                className="object-cover"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Location Label */}
              <div className="absolute top-6 left-6 bg-white rounded-lg p-4 shadow-lg max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A961]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[#2C2416] text-base">
                      {location.address || "Golf Course Road"}
                    </p>
                    <p className="text-xs text-gray-600">Sector 54, Gurgaon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Nearby Categories */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {location.nearby.map((category, categoryIndex) => {
              const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || categoryIcons.default;
              const iconColor = categoryColors[category.icon as keyof typeof categoryColors] || categoryColors.default;
              
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${iconColor}15` }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#2C2416]">
                      {category.category}
                    </h3>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 pl-11">
                    {category.items.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: iconColor }} />
                        <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Connectivity / Travel Time Section */}
        {location.connectivity && location.connectivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 pt-20 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {location.connectivity.map((item, index) => {
                const IconComponent = connectivityIcons[item.icon as keyof typeof connectivityIcons] || connectivityIcons.default;
                
                return (
                  <motion.div
                    key={item.place}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#C9A961] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A961]/10 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-[#C9A961]" />
                      </div>
                      <div>
                        <p className="text-[#C9A961] font-bold text-sm">{item.time}</p>
                        <p className="text-gray-700 text-xs font-medium">{item.place}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
