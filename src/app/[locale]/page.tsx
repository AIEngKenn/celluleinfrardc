import { setRequestLocale } from 'next-intl/server';
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
