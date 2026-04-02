"use client";

/**
 * Developer Hero Component
 * Hero section for developer pages showing developer details
 * Matches the premium design of ProjectHero
 */

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Building2 } from 'lucide-react';

interface DeveloperHeroProps {
  developer: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    description?: string;
  };
  /** Hardcoded override — wins over API `description` and default blurb */
  tagline?: string;
  /** Hardcoded hero background — wins over `DEVELOPER_IMAGES[slug]` */
  heroImageSrc?: string;
}

// Default hero images for different developers
const DEVELOPER_IMAGES: Record<string, string> = {
  dlf: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  'godrej-properties': 'https://images.unsplash.com/photo-1486328803556-cb3e53108c30?w=1200&h=600&fit=crop',
  default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
};

export function DeveloperHero({ developer, tagline, heroImageSrc }: DeveloperHeroProps) {
  const heroImage =
    heroImageSrc || DEVELOPER_IMAGES[developer.slug.toLowerCase()] || DEVELOPER_IMAGES['default'];

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={developer.name}
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
          <span>Developers</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold font-semibold">{developer.name}</span>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl flex items-end gap-8"
        >
          {/* Developer Logo */}
          {developer.logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden sm:block shrink-0"
            >
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:border-gold/50 transition-colors">
                <Image
                  src={developer.logo}
                  alt={developer.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          )}

          {/* Text Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gold/20 backdrop-blur-sm rounded-full border border-gold/30">
                <Building2 className="w-8 h-8 text-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
                {developer.name}
              </h1>
            </div>

            <p className="text-lg text-white/80 font-light max-w-2xl">
              {tagline ||
                developer.description ||
                `Discover all premium projects and properties developed by ${developer.name}.
              Explore world-class amenities, strategic locations, and exceptional investment opportunities.`}
            </p>

            {/* CTA Button */}
            <button className="mt-8 bg-linear-to-r from-gold to-gold-dark text-black px-8 py-4 rounded-sm font-bold tracking-wide hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              View All Projects →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
