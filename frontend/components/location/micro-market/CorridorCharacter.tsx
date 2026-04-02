import type { CorridorCharacterProps } from '@/types/location-micro-market';
import {
  corridorBody,
  corridorCard,
  corridorEyebrow,
  corridorGoldRule,
  corridorHeading,
  corridorLayout,
  corridorSectionY,
} from './corridor-section-styles';

export function CorridorCharacter({
  sectionLabel,
  title,
  paragraphs,
  pullQuote,
  facts,
}: CorridorCharacterProps) {
  return (
    <section id="corridor-character" className={`bg-background ${corridorSectionY}`}>
      <div className={`grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16 ${corridorLayout}`}>
        <div>
          <p className={`${corridorEyebrow} mb-4`}>{sectionLabel}</p>
          <div className={`${corridorGoldRule} mb-4`} />
          <h2 className={corridorHeading}>{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className={`mt-6 ${corridorBody}`}>
              {p}
            </p>
          ))}
          <blockquote className="my-8 border-l-[3px] border-gold py-4 pl-6 font-serif text-xl font-light italic text-gold-dark md:text-2xl">
            {pullQuote}
          </blockquote>
        </div>
        <div className="flex flex-col gap-2">
          <p className={`${corridorEyebrow} mb-2`}>Corridor facts</p>
          {facts.map((f) => (
            <div key={f.index} className={`flex gap-4 p-6 ${corridorCard}`}>
              <div className="w-8 shrink-0 font-serif text-2xl font-semibold text-gold">{f.index}</div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">{f.title}</h3>
                <p className={`mt-2 text-sm md:text-base ${corridorBody}`}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
