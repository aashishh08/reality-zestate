/**
 * Structured content for location / micro-market corridor pages.
 * Built dynamically from listing data; later swappable for CMS payloads.
 */

export interface CorridorHeroStat {
  value: string;
  label: string;
  sub?: string;
}

export interface CorridorHeroProps {
  parentCityHref: string;
  parentCityName: string;
  corridorLabel: string;
  title: string;
  moodLine: string;
  stats: CorridorHeroStat[];
}

export interface CorridorCharacterProps {
  sectionLabel: string;
  title: string;
  paragraphs: string[];
  pullQuote: string;
  facts: { index: string; title: string; description: string }[];
}

export interface DeveloperPresenceItem {
  initials: string;
  name: string;
  /** Full path, e.g. `/developer/dlf` or `/contact` */
  href: string;
  projectsLine: string;
  countLabel: string;
}

export interface NriStripProps {
  sectionLabel: string;
  title: string;
  body: string;
  ctaLabel: string;
  facts: { value: string; label: string }[];
}

export interface CorridorFaqItem {
  question: string;
  answer: string;
}

export interface MicroMarketProjectsSectionHeader {
  eyebrow: string;
  title: string;
  viewAll?: { href: string; label: string };
  sectionClassName?: string;
}

export interface MicroMarketPageModel {
  hero: CorridorHeroProps;
  projectsSection: MicroMarketProjectsSectionHeader;
  character: CorridorCharacterProps;
  developers: { sectionSubtitle: string; items: DeveloperPresenceItem[] };
  nri: NriStripProps;
  faqs: CorridorFaqItem[];
}
