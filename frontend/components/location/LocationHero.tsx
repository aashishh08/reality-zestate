"use client";

/**
 * Location Hero Component
 * Hero section for location pages showing location details
 * Matches the premium design of ProjectHero
 */

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';

interface LocationHeroProps {
  location: {
    id: string;
    name: string;
    slug: string;
    type?: string;
    parent?: {
      name: string;
    };
  };
}

// Default hero images for different location types
const LOCATION_IMAGES: Record<string, string> = {
  'delhi': 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&h=600&fit=crop',
  'new-delhi': 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&h=600&fit=crop',
  'mumbai': 'https://images.unsplash.com/photo-1580573916550-e323be2ae537?w=1200&h=600&fit=crop',
  'bangalore': 'https://images.unsplash.com/photo-1596521222512-f1b99a8b2d0d?w=1200&h=600&fit=crop',
  'gurgaon': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  'noida': 'https://images.unsplash.com/photo-1486328803556-cb3e53108c30?w=1200&h=600&fit=crop',
  'default': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
};

export function LocationHero({ location }: LocationHeroProps) {
  const heroImage = LOCATION_IMAGES[location.slug.toLowerCase()] || LOCATION_IMAGES['default'];

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={location.name}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between pb-12 md:pb-16 px-6 md:px-12">
        {/* Breadcrumb — pt-[80px] clears the fixed nav (~68px) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 pt-[80px] text-sm text-white/80"
        >
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>Locations</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold font-semibold">{location.name}</span>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gold/20 backdrop-blur-sm rounded-full border border-gold/30">
              <MapPin className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              {location.name}
            </h1>
          </div>

          {/* Location Info */}
          {location.parent && (
            <p className="text-xl md:text-2xl text-white/90 font-light mb-4">
              in {location.parent.name}
            </p>
          )}

          <p className="text-lg text-white/80 font-light max-w-2xl">
            Discover premium residential and commercial properties in {location.name}. 
            Explore world-class amenities, strategic locations, and exceptional investment opportunities.
          </p>

          {/* CTA Button */}
          <button className="mt-8 bg-linear-to-r from-gold to-gold-dark text-black px-8 py-4 rounded-sm font-bold tracking-wide hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            Explore Properties →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
