import rateLimit from 'express-rate-limit';

/**
 * Known search / AI crawlers — higher limits so llms.txt, feed, and sitemap stay accessible.
 * Blocks abusive floods while keeping SEO and AI visibility intact.
 */
const CRAWLER_UA =
  /googlebot|bingbot|applebot|duckduckbot|yandexbot|baiduspider|gptbot|chatgpt-user|claudebot|anthropic-ai|perplexitybot|ccbot|bytespider|amazonbot|oai-searchbot|facebookexternalhit|linkedinbot|twitterbot|slackbot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot/i;

export function isKnownCrawler(req) {
  return CRAWLER_UA.test(req.get('user-agent') || '');
}

function maxRequestsPerMinute(req) {
  if (isKnownCrawler(req)) return 400;
  return 150;
}

/** Docker / private network — Next.js SSR calls the API from here; do not throttle. */
function isInternalCaller(req) {
  const ip = req.ip || '';
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.startsWith('172.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('::ffff:172.') ||
    ip.startsWith('::ffff:10.') ||
    ip.startsWith('::ffff:192.168.')
  );
}

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: maxRequestsPerMinute,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const path = req.path || '';
    if (path.endsWith('/health/live') || path.endsWith('/health/live/')) return true;
    if (path.endsWith('/health') || path.endsWith('/health/')) return true;
    // Frontend SSR → API is internal; rate-limit only public internet clients
    if (isInternalCaller(req)) return true;
    return false;
  },
  message: {
    success: false,
    message: 'Too many requests. Please retry shortly.',
  },
});
