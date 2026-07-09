/**
 * Lightweight in-process TTL cache for public read endpoints.
 * Reduces DB load under crawler bursts without blocking AI/SEO bots.
 */

const store = new Map();

export function getMemoryCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setMemoryCache(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export async function withMemoryCache(key, ttlMs, loader) {
  const cached = getMemoryCache(key);
  if (cached !== null) return cached;
  const value = await loader();
  setMemoryCache(key, value, ttlMs);
  return value;
}

export function clearMemoryCache(prefix) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
