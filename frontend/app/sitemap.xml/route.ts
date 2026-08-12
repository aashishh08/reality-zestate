import {
  buildFallbackSitemapEntries,
  buildSitemapEntries,
} from '@/lib/sitemap-entries';
import { renderSitemapXml } from '@/lib/sitemap-xml';

export const revalidate = 3600;

export async function GET() {
  let entries;
  try {
    entries = await buildSitemapEntries();
  } catch (error) {
    console.error('[sitemap] generation failed, using fallback:', error);
    entries = buildFallbackSitemapEntries();
  }

  const xml = renderSitemapXml(entries);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
