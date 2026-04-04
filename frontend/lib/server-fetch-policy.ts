/**
 * Opt-in bypass of Next.js Data Cache for server-side `fetch()` in `fetchFromAPI`.
 *
 * Default: **off** — callers control caching via `next: { revalidate }` or `cache`, so routes
 * can be static / ISR without conflicting with `no-store` (avoids “static to dynamic at runtime”).
 *
 * In **production**, this always returns false. If `NEXT_FETCH_NO_CACHE` were honored at runtime
 * but not at build time, prerendered pages would error: “Page changed from static to dynamic at runtime”.
 *
 * Enable for local debugging (always hit the API): in development, set `NEXT_FETCH_NO_CACHE=1`
 * (or `true` / `on` / `yes`). Client-side `fetchFromAPI` ignores this (browser).
 */

const TRUTHY = new Set(['1', 'true', 'yes', 'on']);

export function serverFetchNoCache(): boolean {
  if (typeof window !== 'undefined') return false;
  if (process.env.NODE_ENV === 'production') return false;
  const v = (process.env.NEXT_FETCH_NO_CACHE || '').trim().toLowerCase();
  return TRUTHY.has(v);
}
