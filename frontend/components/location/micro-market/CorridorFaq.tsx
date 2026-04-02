'use client';

import { useState } from 'react';
import type { CorridorFaqItem } from '@/types/location-micro-market';
import {
  corridorCard,
  corridorEyebrow,
  corridorGoldRule,
  corridorHeading,
  corridorLayout,
  corridorSectionY,
} from './corridor-section-styles';

export function CorridorFaq({ locationName, items }: { locationName: string; items: CorridorFaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq-section" className={`bg-background ${corridorSectionY}`}>
      <div className={corridorLayout}>
        <header className="mb-10">
          <p className={`${corridorEyebrow} mb-4`}>Questions</p>
          <div className={`${corridorGoldRule} mb-4`} />
          <h2 className={corridorHeading}>{locationName} — frequently asked</h2>
        </header>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {items.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={`${corridorCard} ${isOpen ? 'ring-1 ring-gold/30' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left md:p-6"
                >
                  <span className="font-serif text-base font-semibold leading-snug text-charcoal md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 text-xl font-light leading-none text-gold transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden border-t border-border transition-all duration-300"
                  style={{ maxHeight: isOpen ? 320 : 0 }}
                >
                  <div className="px-5 pb-5 pt-4 font-sans text-sm leading-relaxed text-zinc-600 md:px-6 md:pb-6 md:text-base">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
