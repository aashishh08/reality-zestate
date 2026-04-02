import Link from 'next/link';
import type { CorridorHeroProps } from '@/types/location-micro-market';
import { corridorEyebrow, corridorLayout } from './corridor-section-styles';

export function CorridorEditorialHero({
  parentCityHref,
  parentCityName,
  corridorLabel,
  title,
  moodLine,
  stats,
}: CorridorHeroProps) {
  return (
    <div className="relative overflow-hidden bg-charcoal text-white">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-charcoal via-charcoal to-black/90" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[url('/images/hero-bg.png')] bg-cover bg-center grayscale" />

      <div className={`relative z-[1] py-14 md:py-20 ${corridorLayout}`}>
        <div className={`mb-4 flex items-center gap-2 font-sans ${corridorEyebrow}`}>
          <Link href={parentCityHref} className="text-gold transition-colors hover:text-gold-light">
            {parentCityName}
          </Link>
          <span className="text-white/40">›</span>
          <span className="text-white/80">{corridorLabel}</span>
        </div>

        <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-3 font-serif text-lg font-light italic text-gold-light md:text-xl">
          {moodLine}
        </p>

        <div className="mt-10 flex flex-col gap-6 border-t border-gold/20 pt-8 md:flex-row md:divide-x md:divide-gold/15 md:gap-0">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 border-b border-gold/10 pb-6 last:border-b-0 last:pb-0 md:border-b-0 md:px-8 md:pb-0 first:md:pl-0 last:md:pr-0"
            >
              <div className="font-serif text-3xl font-semibold leading-none text-gold-light md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                {s.label}
              </div>
              {s.sub && (
                <div className="mt-1 font-sans text-xs font-normal text-white/35">{s.sub}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
