/**
 * Status tags: listing filter pills + card badges + admin tag order.
 * Slugs must match `tags.slug` in the DB (seed / migration).
 */
export const STATUS_TAG_SLUGS = [
  'new-launch',
  'upcoming',
  'under-construction',
  'ready-to-move',
] as const;

export type StatusTagSlug = (typeof STATUS_TAG_SLUGS)[number];

export const STATUS_TAG_DEFAULT_LABELS: Record<StatusTagSlug, string> = {
  'new-launch': 'New Launch',
  upcoming: 'Upcoming',
  'under-construction': 'Under Construction',
  'ready-to-move': 'Ready to Move',
};

/** Fallback badge colors when `tag.color` is missing (aligned with site chrome). */
export const STATUS_BADGE_COLORS: Record<
  StatusTagSlug,
  { bg: string; text: string }
> = {
  'new-launch': { bg: 'rgba(109,40,217,0.12)', text: '#6D28D9' },
  upcoming: { bg: 'rgba(5,150,105,0.12)', text: '#059669' },
  'under-construction': { bg: 'rgba(180,83,9,0.12)', text: '#B45309' },
  'ready-to-move': { bg: 'rgba(29,78,216,0.12)', text: '#1D4ED8' },
};

export function isStatusTagSlug(slug: string): slug is StatusTagSlug {
  return (STATUS_TAG_SLUGS as readonly string[]).includes(slug);
}

/** Puts the four status tags first (fixed order), then all other tags A–Z. */
export function sortTagsForAdmin<T extends { slug: string; name: string }>(
  tags: T[],
): T[] {
  const bySlug = new Map(tags.map((t) => [t.slug, t]));
  const ordered: T[] = [];
  for (const slug of STATUS_TAG_SLUGS) {
    const row = bySlug.get(slug);
    if (row) ordered.push(row);
  }
  const rest = tags
    .filter((t) => !isStatusTagSlug(t.slug))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...ordered, ...rest];
}
