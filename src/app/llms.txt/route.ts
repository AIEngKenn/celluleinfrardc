import { sanityFetch } from '@/lib/sanity/client';
import { seoFeedQuery } from '@/lib/sanity/queries';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';

interface LlmItem {
  titleFr: string;
  titleEn: string;
  excerptFr?: string;
  descriptionFr?: string;
  publishedAt?: string;
  slug: string;
}

interface LlmData {
  news: LlmItem[];
  publications: LlmItem[];
}

function lineItem(label: string, url: string, description?: string) {
  return `- ${label}: ${url}${description ? ` - ${description}` : ''}`;
}

export async function GET() {
  const data = await sanityFetch<LlmData>({
    query: seoFeedQuery,
    tags: ['news', 'publication'],
  });

  const news = data.news
    .slice(0, 10)
    .map((item) =>
      lineItem(
        truncateText(item.titleFr || item.titleEn, 120),
        absoluteUrl(`/fr/actualites/${item.slug}`),
        truncateText(cleanMigratedText(item.excerptFr || ''), 180)
      )
    )
    .join('\n');

  const publications = data.publications
    .slice(0, 10)
    .map((item) =>
      lineItem(
        truncateText(item.titleFr || item.titleEn, 120),
        absoluteUrl(`/fr/publications/${item.slug}`),
        truncateText(cleanMigratedText(item.descriptionFr || ''), 180)
      )
    )
    .join('\n');

  const text = `# ${SITE_NAME}

Official website of the Democratic Republic of Congo Infrastructure Unit.

Base URL: ${SITE_URL}
Primary language: French (fr-CD)
Secondary language: English

## Key Sections
${lineItem('Home', absoluteUrl('/fr'))}
${lineItem('Infrastructure projects', absoluteUrl('/fr/projets'))}
${lineItem('News', absoluteUrl('/fr/actualites'))}
${lineItem('Procurement opportunities', absoluteUrl('/fr/appels-offres'))}
${lineItem('Publications', absoluteUrl('/fr/publications'))}
${lineItem('Media center', absoluteUrl('/fr/mediatheque'))}
${lineItem('Interactive map', absoluteUrl('/fr/geomatique'))}
${lineItem('Contact', absoluteUrl('/fr/contact'))}

## Fresh News
${news}

## Recent Publications
${publications}

## Machine-Readable Resources
${lineItem('Sitemap', absoluteUrl('/sitemap.xml'))}
${lineItem('RSS feed', absoluteUrl('/rss.xml'))}
${lineItem('Robots policy', absoluteUrl('/robots.txt'))}
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
