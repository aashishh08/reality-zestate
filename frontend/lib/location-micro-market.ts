import { getLocationMicroMarketOverrides } from '@/data/page-copy-overrides';
import { CONTACT_INFO } from '@/lib/constants';
import { deepMerge } from '@/lib/deep-merge';
import type { LocationDetail, PropertyListResponse } from '@/types/property-listing';
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

function defaultFaqs(locationName: string): CorridorFaqItem[] {
  return [
    {
      question: `What is the investment case for ${locationName}?`,
      answer: `Micro-markets like ${locationName} are evaluated on supply scarcity, tenant demand, and social infrastructure maturity. Compare listed projects on this page, then speak with our concierge for transaction-level benchmarks.`,
    },
    {
      question: `How do I budget for stamp duty and GST on projects in ${locationName}?`,
      answer:
        'Typically plan roughly fifteen to eighteen percent above the base price for GST, stamp duty, registration, and common PLC charges — exact rates vary by state and circle rate. Your legal advisor can confirm before you book.',
    },
    {
      question: `Which developers are active in ${locationName}?`,
      answer:
        'The “Who builds here” section lists developers tied to current inventory on Superluxere. Follow each card to see their dedicated brand page and full portfolio.',
    },
    {
      question: 'Is this corridor suitable for NRI buyers?',
      answer:
        'Many NRIs prioritise rental liquidity, airport connectivity, and resale depth. Review the NRI facts strip for indicative yields and entry bands, then book a consultation for tailored scenarios.',
    },
    {
      question: `How often is ${locationName} inventory updated?`,
      answer:
        `Listing counts and project cards sync from our operator tools. If you notice a mismatch, contact ${CONTACT_INFO.EMAIL} and we will verify with the developer team.`,
    },
    {
      question: `How does ${locationName} compare with neighbouring corridors?`,
      answer:
        'Each corridor differs on entry price, supply pipeline, and tenant profile. Ask us for a structured benchmark report or browse parent-city listings for side-by-side context.',
    },
  ];
}

function characterDefaults(location: LocationDetail, _totalProjects: number): CorridorCharacterProps {
  const name = location.name;
  const parent = location.parent?.name ?? 'the region';
  return {
    sectionLabel: 'Why this corridor',
    title: `${name} — positioning & fundamentals`,
    paragraphs: [
      `${name} sits within ${parent} as a curated micro-market on Superluxere. We surface only published, verified developer inventory so you can compare like-for-like before you visit sales galleries.`,
      'Structural demand drivers vary by corridor — corporate catchments, airport access, school districts, and scarcity of future supply. The fact cards opposite summarise signals we monitor for institutional and family-office buyers.',
      'For bespoke underwriting — rental comparables, resale velocity, or launch phase timing — route your inquiry through the NRI strip or project cards and our team will respond with data-backed notes.',
    ],
    pullQuote: `"The address is the asset — micro-market selection matters as much as the floor plan."`,
    facts: [
      {
        index: '01',
        title: 'Verified listings',
        description: `Every project card below is tied to a live developer profile. We do not aggregate unverified broker inventory for ${name}.`,
      },
      {
        index: '02',
        title: 'Tenant & employer ecosystem',
        description:
          'Premium corridors benefit from executive leasing. Ask us for indicative rentals on configurations you are considering.',
      },
      {
        index: '03',
        title: 'Infrastructure maturity',
        description:
          'Schools, hospitals, hospitality, and retail depth anchor long-cycle premiums — we highlight these contextually in your consultation.',
      },
      {
        index: '04',
        title: 'Acquisition planning',
        description:
          'Stamp duty, GST, registration, PLC, and club charges vary by state and project. We help you build a checklist before you sign.',
      },
    ],
  };
}

export function buildMicroMarketPageModel(
  location: LocationDetail,
  listing: PropertyListResponse,
): MicroMarketPageModel {
  const items = listing.data ?? [];
  const total = listing.pagination?.total ?? items.length;
  const prices = items.flatMap((p) => [p.priceMin, p.priceMax].filter((x): x is number => x != null && x > 0));
  const minP = prices.length ? Math.min(...prices) : null;
  const maxP = prices.length ? Math.max(...prices) : null;

  const hero: CorridorHeroProps = {
    parentCityHref: location.parent ? `/location/${location.parent.slug}` : '/',
    parentCityName: location.parent?.name ?? 'India',
    corridorLabel: 'Micro-market',
    title: location.name,
    moodLine: `Curated projects · ${new Date().getFullYear()}`,
    stats: [
      {
        value:
          minP != null && maxP != null
            ? `${formatCurrencyCompact(minP)} – ${formatCurrencyCompact(maxP)}`
            : minP != null
              ? `From ${formatCurrencyCompact(minP)}`
              : '—',
        label: 'List price band',
        sub: 'Across published projects · indicative',
      },
      {
        value: String(total),
        label: 'Active projects',
        sub: 'In this micro-market',
      },
      {
        value: 'Ask',
        label: '3-year trend',
        sub: 'Request corridor benchmark memo',
      },
      {
        value: '3–4%',
        label: 'Rental yield band',
        sub: 'Luxury tier · indicative',
      },
    ],
  };

  const projectsSection: MicroMarketProjectsSectionHeader = {
    eyebrow: `${location.name}${location.parent ? ` · ${location.parent.name}` : ''}`,
    title: 'Projects on this corridor',
    viewAll: location.parent
      ? { href: `/location/${location.parent.slug}`, label: `View all ${location.parent.name} →` }
      : { href: '/projects', label: 'View all projects →' },
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
    title: `Why NRIs shortlist ${location.name}`,
    body: `International buyers weigh airport friction, lease depth, and resale liquidity. ${location.name} — framed inside ${location.parent?.name ?? 'India'} — is positioned for buyers who want executors to compress diligence timelines.`,
    ctaLabel: 'Book NRI consultation →',
    facts: [
      { value: '30m', label: 'Typical airport run · indicative' },
      { value: 'Peak rent', label: 'Request rental grid' },
      { value: 'FX ready', label: 'USD / AED / GBP lanes' },
      { value: '3.5–4%', label: 'Yield band · illustrative' },
    ],
  };

  const model: MicroMarketPageModel = {
    hero,
    projectsSection,
    character: characterDefaults(location, total),
    developers: {
      sectionSubtitle: 'Quality of developer roster is itself a signal — follow through to brand pages.',
      items:
        devItems.length > 0
          ? devItems
          : [
              {
                initials: 'SL',
                name: 'Superluxere',
                href: '/contact',
                projectsLine: 'We are onboarding developers with inventory in this corridor.',
                countLabel: 'Partner with us →',
              },
            ],
    },
    nri,
    faqs: defaultFaqs(location.name),
  };

  const patch = getLocationMicroMarketOverrides(location.slug);
  if (!patch || Object.keys(patch).length === 0) {
    return model;
  }

  return deepMerge(
    model as unknown as Record<string, unknown>,
    patch as Record<string, unknown>,
  ) as unknown as MicroMarketPageModel;
}
