import { sanityFetch } from '@/lib/sanity/client';
import { seoFeedQuery } from '@/lib/sanity/queries';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';

interface FeedItem {
  _id: string;
  titleFr: string;
  titleEn: string;
  excerptFr?: string;
  excerptEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  publishedAt?: string;
  _updatedAt?: string;
  slug: string;
}

interface FeedData {
  news: FeedItem[];
  publications: FeedItem[];
}

function escapeXml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function itemXml(item: FeedItem, type: 'actualites' | 'publications') {
  const title = item.titleFr || item.titleEn;
  const description = cleanMigratedText(item.excerptFr || item.descriptionFr || item.excerptEn || '');
  const link = absoluteUrl(`/fr/${type}/${item.slug}`);
  const date = new Date(item.publishedAt || item._updatedAt || Date.now()).toUTCString();

  return `
    <item>
      <title>${escapeXml(truncateText(title, 160))}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(date)}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
}

export async function GET() {
  const data = await sanityFetch<FeedData>({
    query: seoFeedQuery,
    tags: ['news', 'publication'],
  });

  const items = [
    ...data.news.map((item) => itemXml(item, 'actualites')),
    ...data.publications.map((item) => itemXml(item, 'publications')),
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(
      "Actualités, appels d'offres, projets et publications de la Cellule Infrastructures RDC."
    )}</description>
    <language>fr-CD</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
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
