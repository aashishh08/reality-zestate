import Link from 'next/link';
import type { DeveloperPresenceItem } from '@/types/location-micro-market';
import {
  corridorBody,
  corridorCard,
  corridorEyebrow,
  corridorGoldRule,
  corridorHeading,
  corridorLayout,
  corridorSectionY,
} from './corridor-section-styles';

interface Props {
  locationTitle: string;
  sectionSubtitle: string;
  items: DeveloperPresenceItem[];
}

export function CorridorDevelopersPresence({ locationTitle, sectionSubtitle, items }: Props) {
  return (
    <section id="developers-on-corridor" className={`bg-cream ${corridorSectionY}`}>
      <div className={corridorLayout}>
        <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className={`${corridorEyebrow} mb-4`}>Who builds here</p>
            <div className={`${corridorGoldRule} mb-4`} />
            <h2 className={corridorHeading}>Developers on {locationTitle}</h2>
            <p className={`mt-4 max-w-2xl ${corridorBody}`}>{sectionSubtitle}</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((d) => (
            <Link key={d.href + d.name} href={d.href} className={`block p-4 sm:p-7 ${corridorCard} hover:shadow-md`}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center bg-charcoal font-serif text-sm font-semibold text-gold">
                {d.initials}
              </div>
              <div className="font-serif text-lg font-semibold text-black">{d.name}</div>
              <p className={`mb-3 mt-2 text-sm ${corridorBody}`}>{d.projectsLine}</p>
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-gold-dark">
                {d.countLabel}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
