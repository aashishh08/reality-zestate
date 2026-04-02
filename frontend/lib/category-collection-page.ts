import type { CategoryData } from '@/lib/category-data';
import type { PropertyListResponse } from '@/types/property-listing';
import type {
  CorridorCharacterProps,
  CorridorFaqItem,
  CorridorHeroProps,
  DeveloperPresenceItem,
  MicroMarketPageModel,
  MicroMarketProjectsSectionHeader,
  NriStripProps,
} from '@/types/location-micro-market';

function formatCurrencyCompact(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function categoryFaqs(collectionName: string): CorridorFaqItem[] {
  return [
    {
      question: `What belongs in the ${collectionName} collection?`,
      answer: `Projects listed here share the ${collectionName} positioning on Superluxere — verified developer inventory tagged into this category. Compare specs and pricing on the cards, then route deeper questions through concierge.`,
    },
    {
      question: 'How do taxes and charges vary across these projects?',
      answer:
        'Stamp duty, GST, registration, PLC, and club charges depend on state and circle rates. Treat headline prices as indicative until your legal and tax advisors confirm on the specific unit.',
    },
    {
      question: 'Which developers are represented in this collection?',
      answer:
        'The “Who builds here” section reflects developers tied to current listings. Follow each card through to the brand page for a fuller portfolio view.',
    },
    {
      question: 'Is this collection relevant for NRI buyers?',
      answer:
        'Many categories attract cross-border capital for lifestyle or diversification. Use the NRI strip for indicative yields and FX-ready consultation lanes — your scenario may need bespoke structuring.',
    },
    {
      question: `How often is ${collectionName} inventory refreshed?`,
      answer:
        'Counts sync from our operator tools when developers publish or update stock. If something looks off, flag it to concierge@superluxere.com.',
    },
  ];
}

function categoryCharacter(
  name: string,
  editorial: CategoryData | null,
  _totalProjects: number,
): CorridorCharacterProps {
  const intro =
    editorial?.introText ??
    `${name} is presented as a curated collection on Superluxere — we only surface published, developer-backed inventory you can compare in one place.`;

  return {
    sectionLabel: 'Why this collection',
    title: `${name} — what we curate`,
    paragraphs: [
      intro,
      'Selection criteria differ by collection — from asset type and geography to brand positioning and completion risk. The fact cards summarise the diligence signals our team revisits when onboarding new stock.',
      'For allocations, payment schedules, or inventory not yet on the platform, use the project cards or NRI strip and we will respond with structured notes.',
    ],
    pullQuote: '"Curation is a filter — the right collection shortlists before you shortlist floor plans."',
    facts: [
      {
        index: '01',
        title: 'Verified listings',
        description: `Each project card maps to live developer data. We do not blend unverified resale or broker-only leads into ${name}.`,
      },
      {
        index: '02',
        title: 'Comparable set',
        description:
          'Use filters and tags within the grid to narrow the inventory that actually matches your use case before site visits.',
      },
      {
        index: '03',
        title: 'Geography & product mix',
        description:
          'Inventory may span multiple cities; verify location and RERA context on every listing before you reserve.',
      },
      {
        index: '04',
        title: 'Acquisition checklist',
        description:
          'Beyond ticket price, model PLC, parking, corpus, and escalation clauses — we help you build a signing checklist.',
      },
    ],
  };
}

export function buildCategoryCollectionPageModel(
  name: string,
  editorial: CategoryData | null,
  listing: PropertyListResponse,
): MicroMarketPageModel {
  const items = listing.data ?? [];
  const total = listing.pagination?.total ?? items.length;
  const prices = items.flatMap((p) =>
    [p.priceMin, p.priceMax].filter((x): x is number => x != null && x > 0),
  );
  const minP = prices.length ? Math.min(...prices) : null;
  const maxP = prices.length ? Math.max(...prices) : null;

  const moodLine =
    editorial?.heroSubtitle ?? `Curated projects · ${new Date().getFullYear()}`;

  const hero: CorridorHeroProps = {
    parentCityHref: '/projects',
    parentCityName: 'All projects',
    corridorLabel: 'Curated collection',
    title: name,
    moodLine,
    stats: [
      {
        value:
          minP != null && maxP != null
            ? `${formatCurrencyCompact(minP)} – ${formatCurrencyCompact(maxP)}`
            : minP != null
              ? `From ${formatCurrencyCompact(minP)}`
              : '—',
        label: 'List price band',
        sub: 'Across published listings · indicative',
      },
      {
        value: String(total),
        label: 'Active projects',
        sub: 'In this collection',
      },
      {
        value: 'Ask',
        label: 'Inventory notes',
        sub: 'Request availability memo',
      },
      {
        value: '3–4%',
        label: 'Rental yield band',
        sub: 'Luxury tier · illustrative',
      },
    ],
  };

  const projectsSection: MicroMarketProjectsSectionHeader = {
    eyebrow: `${name} · curated collection`,
    title: 'Projects in this collection',
    viewAll: { href: '/projects', label: 'Browse all projects →' },
    sectionClassName: 'bg-cream',
  };

  const devMap = new Map<string, { name: string; slug: string; titles: string[] }>();
  for (const p of items) {
    const d = p.Developer;
    if (!d?.slug) continue;
    const cur = devMap.get(d.slug) ?? { name: d.name, slug: d.slug, titles: [] };
    cur.titles.push(p.title);
    devMap.set(d.slug, cur);
  }

  const devItems: DeveloperPresenceItem[] = [...devMap.values()].slice(0, 8).map((d) => ({
    initials: d.name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase(),
    name: d.name,
    href: `/developer/${d.slug}`,
    projectsLine: d.titles.slice(0, 4).join(' · ') || '—',
    countLabel: `${d.titles.length} project${d.titles.length === 1 ? '' : 's'} →`,
  }));

  const nri: NriStripProps = {
    sectionLabel: 'NRI buyers',
    title: `Why NRIs explore ${name}`,
    body: `International capital often uses category collections to compare like-for-like before drilling into a corridor. ${name} on Superluxere is built for buyers who want institutional rigour on a shorter funnel.`,
    ctaLabel: 'Book NRI consultation →',
    facts: [
      { value: 'FX ready', label: 'USD / AED / GBP lanes' },
      { value: 'Ask us', label: 'Tax & repat memo' },
      { value: 'Zoom + site', label: 'Coordinated tours' },
      { value: '3.5–4%', label: 'Yield band · illustrative' },
    ],
  };

  return {
    hero,
    projectsSection,
    character: categoryCharacter(name, editorial, total),
    developers: {
      sectionSubtitle: 'Developers with inventory in this category — follow through to brand pages.',
      items:
        devItems.length > 0
          ? devItems
          : [
              {
                initials: 'SL',
                name: 'Superluxere',
                href: '/contact',
                projectsLine: 'We are onboarding developers for this collection.',
                countLabel: 'Partner with us →',
              },
            ],
    },
    nri,
    faqs: categoryFaqs(name),
  };
}
