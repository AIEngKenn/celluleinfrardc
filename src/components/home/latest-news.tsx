'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { News } from '@/lib/sanity/types';
import { NewsCard } from '@/components/news/news-card';

export function LatestNews({ news }: { news?: News[] }) {
  const locale = useLocale();
  const t = useTranslations('news');
  const isFr = locale === 'fr';
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const articles = news ?? [];

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  const scrollByCard = useCallback((direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-news-card]');
    const gap = 24;
    const amount = (card?.offsetWidth ?? 320) + gap;
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setPrefersReducedMotion(media.matches);
    syncMotion();
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return undefined;
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, articles.length]);

  useEffect(() => {
    if (articles.length <= 1 || isPaused || prefersReducedMotion) return undefined;
    const interval = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard('right');
      }
    }, 5000);
    return () => window.clearInterval(interval);
  }, [articles.length, isPaused, prefersReducedMotion, scrollByCard]);

  if (!articles.length) return null;

  return (
    <section
      className="overflow-hidden bg-white py-16 sm:py-20"
      aria-labelledby="home-news-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rdc-blue">
              {isFr ? 'Actualités récentes' : 'Latest news'}
            </span>
            <h2 id="home-news-heading" className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {isFr ? 'La vie des projets' : 'Projects in motion'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              {isFr
                ? 'Retrouvez les dernières actualités de la Cellule Infrastructures, mises à jour depuis le CMS.'
                : 'Browse the latest Infrastructure Unit news, updated from the CMS.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCard('left')}
                disabled={!canScrollLeft}
                className="ci-news-carousel-btn"
                aria-label={isFr ? 'Actualité précédente' : 'Previous article'}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard('right')}
                disabled={!canScrollRight}
                className="ci-news-carousel-btn"
                aria-label={isFr ? 'Actualité suivante' : 'Next article'}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Link
              href={`/${locale}/actualites`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-rdc-blue transition-all hover:gap-3"
            >
              {isFr ? 'Toutes les actualités' : 'All news'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        <div className="relative -mx-2 sm:-mx-4">
          <div
            ref={trackRef}
            className="ci-news-carousel-track ci-news-carousel-track--album"
            role="region"
            aria-roledescription={isFr ? 'carrousel' : 'carousel'}
            aria-label={isFr ? 'Actualités récentes' : 'Latest news'}
            tabIndex={0}
          >
            {articles.map((article) => (
              <div key={article._id} data-news-card className="ci-news-carousel-slide ci-news-carousel-slide--album">
                <NewsCard
                  article={article}
                  locale={locale}
                  featuredLabel={t('featured')}
                  variant="album"
                  className="h-full"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white/25 via-white/5 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white/25 via-white/5 to-transparent sm:w-20" />
        </div>
      </div>
    </section>
  );
}
