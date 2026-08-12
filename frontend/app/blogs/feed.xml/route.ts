import { getBlogs } from '@/lib/api/blogs';
import { getSiteUrl } from '@/lib/site-url';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const base = getSiteUrl();
  const { data: posts } = await getBlogs({ limit: 50, offset: 0 }, 3600);

  const items = posts
    .map((post) => {
      const link = `${base}/blogs/${post.slug}`;
      const pubDate = new Date(post.publishedAt || post.createdAt || Date.now()).toUTCString();
      const description = escapeXml(post.excerpt || post.title);
      const title = escapeXml(post.title);
      const image = post.seo?.ogImage || post.featuredImage;

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${image ? `<enclosure url="${escapeXml(image)}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Superluxere — Luxury Real Estate Insights</title>
    <link>${base}/blogs</link>
    <description>Expert insights, market trends, and guides on luxury real estate in India.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/blogs/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
