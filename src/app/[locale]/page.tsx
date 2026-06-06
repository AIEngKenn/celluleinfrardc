import { setRequestLocale } from 'next-intl/server';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { homePageQuery } from '@/lib/sanity/queries';
import type { HomePageData } from '@/lib/sanity/types';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { LatestNews } from '@/components/home/latest-news';
import { CurrentProcurement } from '@/components/home/current-procurement';
import { RecentPublications } from '@/components/home/recent-publications';
import { MediaPreview } from '@/components/home/media-preview';
import { PartnersSection } from '@/components/home/partners-section';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return createSeoMetadata({
    locale,
    path: '',
    title: isFr
      ? 'Cellule Infrastructures RDC - Projets, appels d’offres et publications'
      : 'DRC Infrastructure Unit - Projects, procurement and publications',
    description: isFr
      ? "Site officiel de la Cellule Infrastructures de la RDC: projets d'infrastructures, appels d'offres, actualités, publications et suivi de la transparence."
      : 'Official DRC Infrastructure Unit website: infrastructure projects, procurement opportunities, news, publications and transparency updates.',
    keywords: [
      'Cellule Infrastructures RDC',
      'infrastructures RDC',
      "appels d'offres RDC",
      'projets routiers RDC',
      'travaux publics RDC',
    ],
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const homeData = await sanityFetch<HomePageData>({
    query: homePageQuery,
    tags: ['homeSettings', 'project', 'news', 'procurement', 'publication', 'media'],
  });

  return (
    <>
      {/* Hero Carousel - Full viewport height */}
      <HeroCarousel slides={homeData.settings?.heroSlides} />

      {/* Statistics Section */}
      <StatsSection stats={homeData.stats} />

      {/* Featured Projects */}
      <FeaturedProjects projects={homeData.projects} />

      {/* Latest News */}
      <LatestNews news={homeData.news} />

      {/* Current Procurement */}
      <CurrentProcurement opportunities={homeData.procurement} />

      {/* Recent Publications */}
      <RecentPublications publications={homeData.publications} />

      {/* Media Preview */}
      <MediaPreview
        mediaItems={homeData.media}
        titleFr={homeData.settings?.mediaTitleFr}
        titleEn={homeData.settings?.mediaTitleEn}
        descriptionFr={homeData.settings?.mediaDescriptionFr}
        descriptionEn={homeData.settings?.mediaDescriptionEn}
      />

      {/* Partners */}
      <PartnersSection partners={homeData.settings?.partners} />
    </>
  );
}
