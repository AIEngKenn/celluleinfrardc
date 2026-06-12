import { sanityFetch } from '@/lib/sanity/client';
import { seoFeedQuery } from '@/lib/sanity/queries';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';
import {
  mergeMissionSlugs,
  missionRoutePath,
  STATIC_SITE_ROUTES,
} from '@/lib/seo/site-routes';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';

interface LlmItem {
  titleFr: string;
  titleEn: string;
  excerptFr?: string;
  descriptionFr?: string;
  publishedAt?: string;
  slug: string;
}

interface MissionItem {
  slug?: string;
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
}

interface LlmData {
  news: LlmItem[];
  publications: LlmItem[];
  procurement: LlmItem[];
  missions?: MissionItem[];
}

function lineItem(label: string, url: string, description?: string) {
  return `- ${label}: ${url}${description ? ` - ${description}` : ''}`;
}

export async function GET() {
  const data = await sanityFetch<LlmData>({
    query: seoFeedQuery,
    tags: ['aboutPage', 'news', 'publication', 'procurement'],
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

  const procurement = data.procurement
    .slice(0, 8)
    .map((item) =>
      lineItem(
        truncateText(item.titleFr || item.titleEn, 120),
        absoluteUrl(`/fr/appels-offres/${item.slug}`),
        truncateText(cleanMigratedText(item.descriptionFr || ''), 180)
      )
    )
    .join('\n');

  const missionSlugs = mergeMissionSlugs(data.missions?.map((mission) => mission.slug));
  const missions = missionSlugs
    .map((slug) => {
      const cmsMission = data.missions?.find((mission) => mission.slug === slug);
      return lineItem(
        truncateText(cmsMission?.titleFr || cmsMission?.titleEn || slug, 120),
        absoluteUrl(`/fr${missionRoutePath(slug)}`),
        truncateText(cleanMigratedText(cmsMission?.descriptionFr || ''), 180)
      );
    })
    .join('\n');

  const keySections = STATIC_SITE_ROUTES.map((route) => {
    const labels: Record<string, string> = {
      '': 'Home',
      '/a-propos': 'About the Infrastructure Unit',
      '/projets': 'Infrastructure projects',
      '/actualites': 'News',
      '/appels-offres': 'Procurement opportunities',
      '/publications': 'Publications',
      '/mediatheque': 'Media center',
      '/geomatique': 'Interactive map',
      '/reclamations': 'Complaints',
      '/contact': 'Contact',
      '/recherche': 'Search',
    };
    return lineItem(labels[route.path] || route.path, absoluteUrl(`/fr${route.path}`));
  }).join('\n');

  const text = `# ${SITE_NAME}

Official website of the Democratic Republic of Congo Infrastructure Unit.

Base URL: ${SITE_URL}
Primary language: French (fr-CD)
Secondary language: English

## Key Sections
${keySections}

## About Missions
${missions}

## Fresh News
${news}

## Open Procurement
${procurement}

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
