import { useTranslations } from 'next-intl';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { LatestNews } from '@/components/home/latest-news';
import { CurrentProcurement } from '@/components/home/current-procurement';
import { RecentPublications } from '@/components/home/recent-publications';
import { MediaPreview } from '@/components/home/media-preview';
import { PartnersSection } from '@/components/home/partners-section';
import { GovernmentBand } from '@/components/ui/government-band';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <>
      <Header />
      <main className="min-h-screen">
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
      </main>

      {/* Government Signature Band */}
      <GovernmentBand />

      <Footer />
    </>
  );
}
