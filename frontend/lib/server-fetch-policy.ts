/**
 * Controls Next.js Data Cache + static shell for server-side `fetch()` calls.
 *
 * Default (server): fresh data on every request — no fetch cache, dynamic HTML.
 * Opt out (restore ISR / cached fetches): set `NEXT_FETCH_NO_CACHE=0` or `false`.
 *
 * Client-side `fetchFromAPI` ignores this (browser env); policy applies only on the server.
 */

export function serverFetchNoCache(): boolean {
  if (typeof window !== 'undefined') return false;
  const v = (process.env.NEXT_FETCH_NO_CACHE || '').trim().toLowerCase();
  if (v === '0' || v === 'false' || v === 'off') return false;
  return true;
}
