"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import type { FeaturedCorridorCard } from '@/lib/featured-corridors';

interface FeaturedCorridorsProps {
  corridors: FeaturedCorridorCard[];
}

function cityLabelFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Group corridors into columns of up to 2 cards (desktop layout). */
function corridorColumns(items: FeaturedCorridorCard[]): FeaturedCorridorCard[][] {
  const columns: FeaturedCorridorCard[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    columns.push(items.slice(i, i + 2));
  }
  return columns;
}

/** Mobile card — matches Browse by Location (`CityLocations`). */
function CorridorMobileCard({ corridor: c, index }: { corridor: FeaturedCorridorCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/location/${c.locationSlug}`} className="block h-full">
        <div className="group relative h-[140px] overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 active:scale-[0.98]">
          <Image
            src="/images/hero-bg.png"
            alt={`${c.displayName} — luxury corridor`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="absolute top-2 right-2 z-10 bg-gold/90 text-black text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide">
            CORRIDOR
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <div className="flex items-center gap-1 mb-0.5 text-gold/90 text-[9px] font-medium tracking-wide uppercase min-w-0">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{cityLabelFromSlug(c.citySlug)}</span>
            </div>
            <h3 className="text-xs font-serif font-bold text-white leading-tight line-clamp-2">
              {c.displayName}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/** Desktop card — taller, editorial detail. */
function CorridorDesktopCard({ corridor: c }: { corridor: FeaturedCorridorCard }) {
  return (
    <Link
      href={`/location/${c.locationSlug}`}
      className="block h-full min-h-[220px] lg:min-h-[260px]"
    >
      <div className="panel relative h-full min-h-[inherit] rounded-2xl overflow-hidden group cursor-pointer flex flex-col">
        <Image
          src="/images/hero-bg.png"
          alt={`${c.displayName} — luxury corridor`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.15]"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none"
          aria-hidden
        />

        <div className="absolute top-6 right-6 z-20 bg-gold/90 text-black text-xs font-bold px-3 py-1 rounded tracking-wide">
          CORRIDOR
        </div>

        <div className="relative z-10 mt-auto p-6 lg:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2 leading-tight">
            {c.displayName}
          </h3>
          <p className="font-serif text-base italic text-white/85 mb-3 leading-snug line-clamp-2">
            {c.moodLine}
          </p>
          <p className="font-sans text-sm text-white/75 leading-relaxed line-clamp-3 mb-4">
            {c.description}
          </p>
          <div className="flex items-center gap-2 text-white/80 mb-4">
            <MapPin className="w-4 h-4 shrink-0 text-gold" />
            <span className="text-sm">{cityLabelFromSlug(c.citySlug)}</span>
          </div>
          <p className="text-gold text-sm font-semibold mb-4">
            <span className="tabular-nums">{c.activeProjects}</span>
            {' '}active project{c.activeProjects === 1 ? '' : 's'}
          </p>
          <span className="inline-flex items-center gap-2 text-white font-medium border-b border-gold pb-1 group-hover:text-gold transition-colors">
            View corridor
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCorridors({ corridors }: FeaturedCorridorsProps) {
  if (!corridors.length) return null;

  const columns = corridorColumns(corridors);

  return (
    <section className="py-6 md:py-24 bg-transparent overflow-hidden">
      <div className="text-center mb-6 md:mb-16 px-2 md:px-4 max-w-7xl mx-auto">
        <motion.h4
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gold font-medium tracking-[0.3em] mb-2 md:mb-4 uppercase text-[10px] sm:text-sm"
        >
          Location intelligence
        </motion.h4>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-black mb-3 md:mb-6 leading-tight"
        >
          India&apos;s best <span className="text-gold">corridors</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-zinc-500 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed line-clamp-2 md:line-clamp-none"
        >
          Micro-markets we watch closely — curated addresses where developer quality,
          infrastructure depth, and rental liquidity align for serious buyers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="mt-4 md:mt-8 hidden md:flex justify-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-black font-medium border-b border-gold pb-1 hover:text-gold transition-colors text-sm tracking-wide uppercase"
          >
            Corridor reports
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile — same 2-col grid as Browse by Location */}
        <div className="grid grid-cols-2 gap-2 sm:gap-6 md:hidden">
          {corridors.map((c, index) => (
            <CorridorMobileCard key={c.locationSlug} corridor={c} index={index} />
          ))}
        </div>

        {/* md+ — 2 columns, 2 stacked cards each */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6 lg:gap-8 min-h-0">
              {column.map((c) => (
                <CorridorDesktopCard key={c.locationSlug} corridor={c} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
