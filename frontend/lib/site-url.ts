/**
 * Public site origin for canonical URLs, OG, sitemap, robots, JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in deployment (e.g. https://superluxere.com).
 */
const DEFAULT_SITE_URL = "https://superluxere.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return DEFAULT_SITE_URL;
}
