/**
 * Opt-in bypass of Next.js Data Cache for server-side `fetch()` in `fetchFromAPI`.
 *
 * Default: **off** — callers control caching via `next: { revalidate }` or `cache`, so routes
 * can be static / ISR without conflicting with `no-store` (avoids “static to dynamic at runtime”).
 *
 * Enable for local debugging (always hit the API): set `NEXT_FETCH_NO_CACHE=1` (or `true` / `on` / `yes`).
 * Client-side `fetchFromAPI` ignores this (browser).
 */

const TRUTHY = new Set(['1', 'true', 'yes', 'on']);

export function serverFetchNoCache(): boolean {
  if (typeof window !== 'undefined') return false;
  const v = (process.env.NEXT_FETCH_NO_CACHE || '').trim().toLowerCase();
  return TRUTHY.has(v);
}
