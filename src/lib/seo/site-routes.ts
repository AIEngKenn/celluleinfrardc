import { FALLBACK_MISSIONS } from '@/lib/about/missions-fallback';

export interface StaticSiteRoute {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

/** Public indexable pages (without locale prefix). */
export const STATIC_SITE_ROUTES: StaticSiteRoute[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/a-propos', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/projets', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/actualites', priority: 0.85, changeFrequency: 'daily' },
  { path: '/appels-offres', priority: 0.85, changeFrequency: 'daily' },
  { path: '/publications', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/mediatheque', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/geomatique', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/reclamations', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/recherche', priority: 0.5, changeFrequency: 'monthly' },
];

export const MISSION_PAGE_SLUGS = FALLBACK_MISSIONS.map((mission) => mission.slug);

export function mergeMissionSlugs(cmsSlugs: Array<string | null | undefined> = []) {
  const slugs = new Set<string>(MISSION_PAGE_SLUGS);
  cmsSlugs.forEach((slug) => {
    if (slug) slugs.add(slug);
  });
  return Array.from(slugs);
}

export function missionRoutePath(slug: string) {
  return `/a-propos/missions/${slug}`;
}
