import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

// AI assistant / answer-engine crawlers we explicitly welcome (in addition to
// the default `*` allow rule below) — keeps intent unambiguous for bots that
// respect narrower disallow lists elsewhere or are blocked by default on some
// hosts.
const AI_BOT_USER_AGENTS = [
  'GPTBot',
  'Google-Extended',
  'PerplexityBot',
  'ClaudeBot',
  'OAI-SearchBot',
  'CCBot',
  'Amazonbot',
];

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      ...AI_BOT_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
