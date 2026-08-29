/**
 * Homepage “Browse by Developer” — slug order mirrors backend/config/featuredDevelopers.js.
 * Optional labels override DB names for display only.
 */
export const FEATURED_DEVELOPER_SLUGS = [
  'godrej-properties',
  'dlf',
  'kreeva',
  'trump-tower',
  'oberoi-realty',
  'conscient-hines-elevate',
] as const;

export const FEATURED_DEVELOPER_LABELS: Record<string, string> = {
  'godrej-properties': 'Godrej',
  'trump-tower': 'Trump Towers',
};

export function featuredDeveloperDisplayName(slug: string, fallback: string): string {
  return FEATURED_DEVELOPER_LABELS[slug] ?? fallback;
}
