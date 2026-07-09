/** Sets HTTP cache headers on public read responses (CDN/browser friendly). */
export function cacheControl(maxAgeSec, sMaxAgeSec = maxAgeSec) {
  return (_req, res, next) => {
    res.set(
      'Cache-Control',
      `public, max-age=${maxAgeSec}, s-maxage=${sMaxAgeSec}, stale-while-revalidate=60`,
    );
    next();
  };
}
