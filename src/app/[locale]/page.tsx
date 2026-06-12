import { setRequestLocale } from 'next-intl/server';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { homePageQuery } from '@/lib/sanity/queries';
import type { HomeHeroSlide, HomePageData } from '@/lib/sanity/types';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { LatestNews } from '@/components/home/latest-news';
import { CurrentProcurement } from '@/components/home/current-procurement';
import { RecentPublications } from '@/components/home/recent-publications';
import { MediaPreview } from '@/components/home/media-preview';
import { PartnersSection } from '@/components/home/partners-section';
import { resolveHomeProcurement } from '@/lib/home/resolve-procurement';

interface Props {
  params: Promise<{ locale: string }>;
}

const HERO_PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

function placeholderImage() {
  return { asset: { _id: 'homepage-hero-placeholder', url: HERO_PLACEHOLDER_IMAGE } };
}

function buildContentHeroSlides(data: HomePageData): HomeHeroSlide[] {
  const titleLimit = 95;
  const descriptionLimit = 145;
  const projects = data.heroProjects.map((project) => ({
    eyebrowFr: 'Projet récent',
    eyebrowEn: 'Latest project',
    titleFr: truncateText(project.titleFr, titleLimit),
    titleEn: truncateText(project.titleEn, titleLimit),
    descriptionFr: truncateText(project.descriptionFr, descriptionLimit),
    descriptionEn: truncateText(project.descriptionEn, descriptionLimit),
    image: project.mainImage || placeholderImage(),
    primaryCtaFr: 'Voir le projet',
    primaryCtaEn: 'View project',
    primaryHref: `/projets/${project.slug}`,
    secondaryCtaFr: 'Tous les projets',
    secondaryCtaEn: 'All projects',
    secondaryHref: '/projets',
  }));

  const procurement = data.heroProcurement.map((item) => ({
    eyebrowFr: "Appel d'offres récent",
    eyebrowEn: 'Latest procurement',
    titleFr: truncateText(item.titleFr, titleLimit),
    titleEn: truncateText(item.titleEn, titleLimit),
    descriptionFr: truncateText(cleanMigratedText(item.descriptionFr), descriptionLimit),
    descriptionEn: truncateText(cleanMigratedText(item.descriptionEn), descriptionLimit),
    image: placeholderImage(),
    primaryCtaFr: "Voir l'appel d'offres",
    primaryCtaEn: 'View opportunity',
    primaryHref: `/appels-offres/${item.slug}`,
    secondaryCtaFr: 'Tous les appels',
    secondaryCtaEn: 'All procurement',
    secondaryHref: '/appels-offres',
  }));

  const news = data.heroNews.map((article) => ({
    eyebrowFr: 'Actualité récente',
    eyebrowEn: 'Latest news',
    titleFr: truncateText(article.titleFr, titleLimit),
    titleEn: truncateText(article.titleEn, titleLimit),
    descriptionFr: truncateText(article.excerptFr, descriptionLimit),
    descriptionEn: truncateText(article.excerptEn, descriptionLimit),
    image: article.mainImage || placeholderImage(),
    primaryCtaFr: "Lire l'article",
    primaryCtaEn: 'Read article',
    primaryHref: `/actualites/${article.slug}`,
    secondaryCtaFr: 'Toutes les actualités',
    secondaryCtaEn: 'All news',
    secondaryHref: '/actualites',
  }));

  const publications = data.heroPublications.map((publication) => ({
    eyebrowFr: 'Publication récente',
    eyebrowEn: 'Latest publication',
    titleFr: truncateText(publication.titleFr, titleLimit),
    titleEn: truncateText(publication.titleEn, titleLimit),
    descriptionFr: truncateText(cleanMigratedText(publication.descriptionFr), descriptionLimit),
    descriptionEn: truncateText(cleanMigratedText(publication.descriptionEn), descriptionLimit),
    image: publication.coverImage || placeholderImage(),
    primaryCtaFr: 'Voir la publication',
    primaryCtaEn: 'View publication',
    primaryHref: `/publications/${publication.slug}`,
    secondaryCtaFr: 'Toutes les publications',
    secondaryCtaEn: 'All publications',
    secondaryHref: '/publications',
  }));

  return [...projects, ...procurement, ...news, ...publications];
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
  const heroSlides = buildContentHeroSlides(homeData);
  const procurement = resolveHomeProcurement(homeData.procurement, homeData.procurementBackfill);

  return (
    <>
      {/* Hero Carousel - Full viewport height */}
      <HeroCarousel slides={heroSlides.length ? heroSlides : homeData.settings?.heroSlides} />

      {/* Statistics Section */}
      <StatsSection stats={homeData.stats} />

      {/* Featured Projects */}
      <FeaturedProjects projects={homeData.projects} />

      {/* Latest News */}
      <LatestNews news={homeData.news} />

      {/* Current Procurement */}
      <CurrentProcurement opportunities={procurement} />

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
