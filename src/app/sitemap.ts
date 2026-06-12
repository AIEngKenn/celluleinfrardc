import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { seoSitemapQuery } from '@/lib/sanity/queries';
import { absoluteUrl, localePath } from '@/lib/seo';
import {
  STATIC_SITE_ROUTES,
  mergeMissionSlugs,
  missionRoutePath,
} from '@/lib/seo/site-routes';

interface SeoDoc {
  _id: string;
  _updatedAt?: string;
  publishedAt?: string;
  closingDate?: string;
  date?: string;
  slug: string;
}

interface SitemapData {
  projects: SeoDoc[];
  news: SeoDoc[];
  publications: SeoDoc[];
  procurement: SeoDoc[];
  mediaAlbums: SeoDoc[];
  missionSlugs?: Array<string | null>;
}

function lastModified(doc?: SeoDoc) {
  return new Date(doc?.publishedAt || doc?.closingDate || doc?.date || doc?._updatedAt || Date.now());
}

function entry(
  locale: string,
  routePath: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  doc?: SeoDoc
) {
  return {
    url: absoluteUrl(localePath(locale, routePath)),
    lastModified: lastModified(doc),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        fr: absoluteUrl(localePath('fr', routePath)),
        en: absoluteUrl(localePath('en', routePath)),
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<SitemapData>({
    query: seoSitemapQuery,
    tags: ['aboutPage', 'project', 'news', 'publication', 'procurement', 'media'],
  });

  const missionSlugs = mergeMissionSlugs(data.missionSlugs);
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of ['fr', 'en']) {
    STATIC_SITE_ROUTES.forEach((route) => {
      routes.push(entry(locale, route.path, route.priority, route.changeFrequency));
    });

    missionSlugs.forEach((slug) => {
      routes.push(entry(locale, missionRoutePath(slug), 0.72, 'monthly'));
    });

    data.projects.forEach((doc) => {
      routes.push(entry(locale, `/projets/${doc.slug}`, 0.75, 'monthly', doc));
    });
    data.news.forEach((doc) => {
      routes.push(entry(locale, `/actualites/${doc.slug}`, 0.8, 'weekly', doc));
    });
    data.publications.forEach((doc) => {
      routes.push(entry(locale, `/publications/${doc.slug}`, 0.7, 'monthly', doc));
    });
    data.procurement.forEach((doc) => {
      routes.push(entry(locale, `/appels-offres/${doc.slug}`, 0.75, 'daily', doc));
    });
    data.mediaAlbums.forEach((doc) => {
      routes.push(entry(locale, `/mediatheque/${doc.slug}`, 0.65, 'monthly', doc));
    });
  }

  return routes;
}
