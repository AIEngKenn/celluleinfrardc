import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { seoSitemapQuery } from '@/lib/sanity/queries';
import { absoluteUrl, localePath } from '@/lib/seo';

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
}

const staticRoutes = [
  '',
  '/a-propos',
  '/projets',
  '/actualites',
  '/appels-offres',
  '/publications',
  '/mediatheque',
  '/geomatique',
  '/reclamations',
  '/contact',
  '/recherche',
];

function lastModified(doc?: SeoDoc) {
  return new Date(doc?.publishedAt || doc?.closingDate || doc?.date || doc?._updatedAt || Date.now());
}

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], doc?: SeoDoc) {
  return {
    url: absoluteUrl(path),
    lastModified: lastModified(doc),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        fr: absoluteUrl(path.replace(/^\/en/, '/fr')),
        en: absoluteUrl(path.replace(/^\/fr/, '/en')),
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<SitemapData>({
    query: seoSitemapQuery,
    tags: ['project', 'news', 'publication', 'procurement', 'media'],
  });

  const routes: MetadataRoute.Sitemap = [];

  for (const locale of ['fr', 'en']) {
    staticRoutes.forEach((route) => {
      routes.push(entry(localePath(locale, route), route === '' ? 1 : 0.7, 'weekly'));
    });

    data.projects.forEach((doc) => {
      routes.push(entry(localePath(locale, `/projets/${doc.slug}`), 0.75, 'monthly', doc));
    });
    data.news.forEach((doc) => {
      routes.push(entry(localePath(locale, `/actualites/${doc.slug}`), 0.8, 'weekly', doc));
    });
    data.publications.forEach((doc) => {
      routes.push(entry(localePath(locale, `/publications/${doc.slug}`), 0.7, 'monthly', doc));
    });
    data.procurement.forEach((doc) => {
      routes.push(entry(localePath(locale, `/appels-offres/${doc.slug}`), 0.75, 'daily', doc));
    });
  }

  return routes;
}
