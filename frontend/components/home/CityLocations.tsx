"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Location } from "@/lib";
import { MapPin, ArrowRight } from "lucide-react";

interface CityLocationsProps {
  locations: Location[];
}

// Sample images for locations
const locationImages: Record<string, string> = {
  delhi: "/images/category-delhi.jpg",
  gurgaon: "/images/category-gurugram.jpg",
  noida: "/images/category-noida.jpg",
};

const locationSubtitles: Record<string, string> = {
  delhi: "Premium Properties in the Capital",
  gurgaon: "Luxury Living in Millennium City",
  noida: "Modern Residences in NCR",
};

export function CityLocations({ locations }: CityLocationsProps) {
  // Filter for city-level locations only
  const cities = locations.filter(l => l.type === "city").slice(0, 6);

  // If no cities found, use any locations as fallback
  const displayCities = cities.length > 0 ? cities : locations.slice(0, 6);

  if (!displayCities || displayCities.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-24 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 md:mb-16 px-2 md:px-4">
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gold font-medium tracking-[0.3em] mb-2 md:mb-4 uppercase text-[10px] sm:text-sm"
          >
            Find Your Dream Home
          </motion.h4>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-black mb-3 md:mb-6 leading-tight"
          >
            Browse by <span className="text-gold">Location</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-zinc-500 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed line-clamp-2 md:line-clamp-none"
          >
            Explore our exclusive properties across India's most prime locations,
            offering the best in luxury and connectivity.
          </motion.p>
        </div>

        {/* Grid Layout - Scalable for more locations */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 md:gap-8">
          {displayCities.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/location/${location.slug}`} className="block h-full">
                <div className="group relative h-[140px] md:h-[300px] overflow-hidden rounded-lg md:rounded-xl shadow-md md:shadow-lg cursor-pointer transform transition-all duration-300 md:hover:-translate-y-2 active:scale-[0.98] md:active:scale-100">
                  <Image
                    src={
                      locationImages[location.slug.toLowerCase()] || "/images/hero-bg.png"
                    }
                    alt={location.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent md:from-black/70 md:via-black/10" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-6">
                    <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-2 text-gold/90 text-[9px] md:text-sm font-medium tracking-wide uppercase min-w-0">
                      <MapPin className="w-2.5 h-2.5 md:w-4 md:h-4 shrink-0" />
                      <span className="truncate">{location.name}</span>
                    </div>
                    <h3 className="text-xs md:text-2xl font-serif font-bold text-white leading-tight line-clamp-2 md:line-clamp-none md:mb-2">
                      {location.name}
                    </h3>
                    <div className="hidden md:block h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                      <p className="text-white/80 text-sm mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {locationSubtitles[location.slug.toLowerCase()] || `Luxury properties in ${location.name}`}
                      </p>
                      <span className="inline-flex items-center gap-2 text-white text-sm font-medium border-b border-gold pb-1">
                        View Properties <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
