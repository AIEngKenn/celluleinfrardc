import { setRequestLocale } from 'next-intl/server';
import { createSeoMetadata } from '@/lib/seo';
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

  return (
    <>
      {/* Hero Carousel - Full viewport height */}
      <HeroCarousel />

      {/* Statistics Section */}
      <StatsSection />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Latest News */}
      <LatestNews />

      {/* Current Procurement */}
      <CurrentProcurement />

      {/* Recent Publications */}
      <RecentPublications />

      {/* Media Preview */}
      <MediaPreview />

      {/* Partners */}
      <PartnersSection />
    </>
  );
}
