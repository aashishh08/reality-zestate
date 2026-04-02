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

export function FeaturedCorridors({ corridors }: FeaturedCorridorsProps) {
  if (!corridors.length) return null;

  return (
    <section className="py-24 bg-transparent overflow-hidden">
      <div className="text-center mb-16 px-4 max-w-7xl mx-auto">
        <motion.h4
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm"
        >
          Location intelligence
        </motion.h4>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight"
        >
          India&apos;s best <span className="text-gold">corridors</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Micro-markets we watch closely — curated addresses where developer quality,
          infrastructure depth, and rental liquidity align for serious buyers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
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

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {corridors.map((c) => (
            <Link
              key={c.locationSlug}
              href={`/location/${c.locationSlug}`}
              className="block h-full min-h-[500px]"
            >
              <div className="panel relative h-full min-h-[500px] rounded-2xl overflow-hidden group cursor-pointer flex flex-col">
                <Image
                  src="/images/hero-bg.png"
                  alt={`${c.displayName} — luxury corridor`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.15]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none"
                  aria-hidden
                />

                <div className="absolute top-6 right-6 z-20 bg-gold/90 text-black text-xs font-bold px-3 py-1 rounded tracking-wide">
                  CORRIDOR
                </div>

                <div className="relative z-10 mt-auto p-8 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                    {c.displayName}
                  </h3>
                  <p className="font-serif text-base italic text-white/85 mb-3 leading-snug min-h-[3rem]">
                    {c.moodLine}
                  </p>
                  <p className="font-sans text-sm text-white/75 leading-relaxed line-clamp-3 mb-4 min-h-[4.5rem]">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-2 text-white/80 mb-4 min-h-[1.25rem]">
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
          ))}
        </div>
      </div>
    </section>
  );
}
