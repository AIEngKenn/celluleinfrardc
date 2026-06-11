import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { aboutPageQuery } from '@/lib/sanity/queries';
import type { AboutPageData } from '@/lib/sanity/types';
import { MissionDetailContent } from '@/components/about/mission-detail-content';
import { resolveAboutMissionBySlug, resolveAboutMissions } from '@/lib/about/resolve-missions';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const isFr = locale === 'fr';

  const data = await sanityFetch<AboutPageData>({
    query: aboutPageQuery,
    tags: ['aboutPage', 'project'],
  });

  const mission = resolveAboutMissionBySlug(data, slug);
  if (!mission) {
    return createSeoMetadata({
      locale,
      path: '/a-propos',
      title: isFr ? 'Mission introuvable' : 'Mission not found',
      description: isFr ? 'Page mission introuvable.' : 'Mission page not found.',
    });
  }

  const title = isFr ? mission.titleFr : mission.titleEn;
  const description = isFr ? mission.descriptionFr : mission.descriptionEn;

  return createSeoMetadata({
    locale,
    path: `/a-propos/missions/${slug}`,
    title,
    description,
    keywords: ['Cellule Infrastructures RDC', 'mission', title],
  });
}

export default async function MissionDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = await sanityFetch<AboutPageData>({
    query: aboutPageQuery,
    tags: ['aboutPage', 'project'],
  });

  const mission = resolveAboutMissionBySlug(data, slug);
  if (!mission) notFound();

  const allMissions = resolveAboutMissions(data);
  const otherMissions = allMissions.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <MissionDetailContent locale={locale} mission={mission} otherMissions={otherMissions} />
  );
}
