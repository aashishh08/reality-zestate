'use client';

import type { NriStripProps } from '@/types/location-micro-market';
import { useLeadModal } from '@/lib/contexts/LeadModalContext';
import { corridorEyebrow, corridorGoldRule, corridorLayout, corridorSectionY } from './corridor-section-styles';

export function CorridorNriStrip({ sectionLabel, title, body, ctaLabel, facts }: NriStripProps) {
  const { openModal } = useLeadModal();

  return (
    <section id="nri-strip" className={`bg-charcoal text-white ${corridorSectionY}`}>
      <div className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${corridorLayout}`}>
        <div>
          <p className={`${corridorEyebrow} mb-4 text-gold`}>{sectionLabel}</p>
          <div className={`${corridorGoldRule} mb-4`} />
          <h2 className="font-serif text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-zinc-400 md:text-lg">
            {body}
          </p>
          <button
            type="button"
            onClick={() => openModal('nri-strip-corridor')}
            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-black transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {facts.map((f) => (
            <div key={f.label} className="border border-gold/20 bg-white/5 p-5">
              <div className="font-serif text-2xl font-semibold text-gold md:text-3xl">{f.value}</div>
              <div className="mt-2 font-sans text-xs text-zinc-400">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
