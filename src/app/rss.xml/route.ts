import { sanityFetch } from '@/lib/sanity/client';
import { seoFeedQuery } from '@/lib/sanity/queries';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';
import { mergeMissionSlugs, missionRoutePath } from '@/lib/seo/site-routes';
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
  openingDate?: string;
  closingDate?: string;
  _updatedAt?: string;
  slug: string;
}

interface MissionFeedItem {
  slug?: string;
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

interface FeedData {
  news: FeedItem[];
  publications: FeedItem[];
  procurement: FeedItem[];
  missions?: MissionFeedItem[];
}

function escapeXml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function itemXml(
  item: FeedItem,
  type: 'actualites' | 'publications' | 'appels-offres',
  locale: 'fr' | 'en' = 'fr'
) {
  const title = locale === 'fr' ? item.titleFr || item.titleEn : item.titleEn || item.titleFr;
  const description = cleanMigratedText(
    locale === 'fr'
      ? item.excerptFr || item.descriptionFr || item.excerptEn || ''
      : item.excerptEn || item.descriptionEn || item.excerptFr || ''
  );
  const link = absoluteUrl(`/${locale}/${type}/${item.slug}`);
  const date = new Date(
    item.publishedAt || item.openingDate || item.closingDate || item._updatedAt || Date.now()
  ).toUTCString();

  return `
    <item>
      <title>${escapeXml(truncateText(title, 160))}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(date)}</pubDate>
      <description>${escapeXml(truncateText(description, 280))}</description>
    </item>`;
}

function missionItemXml(slug: string, title: string, description: string) {
  const link = absoluteUrl(`/fr${missionRoutePath(slug)}`);
  return `
    <item>
      <title>${escapeXml(truncateText(title, 160))}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(new Date().toUTCString())}</pubDate>
      <description>${escapeXml(truncateText(description, 280))}</description>
    </item>`;
}

export async function GET() {
  const raw = await sanityFetch<FeedData | null>({
    query: seoFeedQuery,
    tags: ['aboutPage', 'news', 'publication', 'procurement'],
  });

  const newsItems = raw?.news ?? [];
  const publicationItems = raw?.publications ?? [];
  const procurementItems = raw?.procurement ?? [];
  const missionItems = raw?.missions ?? [];

  const missionSlugs = mergeMissionSlugs(missionItems.map((mission) => mission.slug));

  const missionFeedItems = missionSlugs.map((slug) => {
    const cmsMission = missionItems.find((mission) => mission.slug === slug);
    const title = cmsMission?.titleFr || cmsMission?.titleEn || slug;
    const description = cleanMigratedText(cmsMission?.descriptionFr || cmsMission?.descriptionEn || '');
    return missionItemXml(slug, title, description);
  });

  const items = [
    ...newsItems.map((item) => itemXml(item, 'actualites')),
    ...publicationItems.map((item) => itemXml(item, 'publications')),
    ...procurementItems.map((item) => itemXml(item, 'appels-offres')),
    ...missionFeedItems,
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(
      "Actualités, appels d'offres, missions, projets et publications de la Cellule Infrastructures RDC."
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
