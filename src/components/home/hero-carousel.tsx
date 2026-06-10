'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HomeHeroSlide } from '@/lib/sanity/types';

const HERO_PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

const fallbackSlides: HomeHeroSlide[] = [
  {
    image: { asset: { _id: 'fallback-1', url: HERO_PLACEHOLDER_IMAGE } },
    eyebrowFr: 'Infrastructure Routière',
    eyebrowEn: 'Road Infrastructure',
    titleFr: 'Moderniser les routes pour connecter la nation',
    titleEn: 'Modernizing roads to connect the nation',
    descriptionFr:
      '250 projets routiers en cours dans les 26 provinces de la République Démocratique du Congo.',
    descriptionEn:
      '250 road projects underway across the 26 provinces of the Democratic Republic of Congo.',
    primaryHref: '/projets',
    secondaryHref: '/appels-offres',
  },
  {
    image: { asset: { _id: 'fallback-2', url: HERO_PLACEHOLDER_IMAGE } },
    eyebrowFr: 'Énergie Hydroélectrique',
    eyebrowEn: 'Hydroelectric Energy',
    titleFr: "Investir dans l'énergie propre pour l'avenir",
    titleEn: 'Investing in clean energy for the future',
    descriptionFr:
      'Grand Inga et autres barrages stratégiques : la RDC consolide son potentiel énergétique.',
    descriptionEn: 'Grand Inga and other strategic dams: DRC consolidates its energy potential.',
    primaryHref: '/projets',
    secondaryHref: '/publications',
  },
  {
    image: { asset: { _id: 'fallback-3', url: HERO_PLACEHOLDER_IMAGE } },
    eyebrowFr: 'Développement Urbain',
    eyebrowEn: 'Urban Development',
    titleFr: 'Construire des villes inclusives et durables',
    titleEn: 'Building inclusive and sustainable cities',
    descriptionFr:
      "Planification urbaine, logement social et réseaux d'eau : la CI pilote la transformation urbaine.",
    descriptionEn:
      'Urban planning, social housing and water networks: CI leads urban transformation.',
    primaryHref: '/projets',
    secondaryHref: '/actualites',
  },
];

/** Stagger animation for text elements */
const textVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const containerVariants = {
  center: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export function HeroCarousel({ slides }: { slides?: HomeHeroSlide[] }) {
  const items = slides?.filter((slide) => slide.titleFr).length
    ? slides.filter((slide) => slide.titleFr)
    : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const locale = useLocale();
  const isFr = locale === 'fr';

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = items[current] || items[0];
  const imageUrl = slide.image?.asset?.url || HERO_PLACEHOLDER_IMAGE;

  return (
    <section
      className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-gray-900 lg:h-[90vh]"
      aria-label={isFr ? 'Diaporama principal' : 'Main slideshow'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background image with crossfade ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 8, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full w-full items-end">
        <div className="mx-auto w-full max-w-[1360px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${current}`}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl lg:max-w-3xl"
            >
              {/* Eyebrow */}
              <motion.p
                variants={textVariants}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="mb-4 flex items-center gap-3"
              >
                <span className="h-px w-8 bg-[#F7D618]" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80 sm:text-sm">
                  {isFr ? slide.eyebrowFr : slide.eyebrowEn}
                </span>
              </motion.p>

              {/* Title */}
              <motion.h1
                variants={textVariants}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="mb-5 text-xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl"
              >
                {isFr ? slide.titleFr : slide.titleEn || slide.titleFr}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={textVariants}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="mb-8 text-left text-base font-normal leading-relaxed text-white/70 sm:text-lg lg:text-xl"
              >
                {isFr ? slide.descriptionFr : slide.descriptionEn || slide.descriptionFr}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={textVariants}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <Link
                  href={`/${locale}${slide.primaryHref || '/projets'}`}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#007FFF] px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-lg shadow-[#007FFF]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0066cc] hover:shadow-xl hover:shadow-[#007FFF]/30 sm:px-7 sm:py-4 sm:text-base"
                >
                  {(isFr ? slide.primaryCtaFr : slide.primaryCtaEn) ||
                    (isFr ? 'Voir les projets' : 'View projects')}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={`/${locale}${slide.secondaryHref || '/appels-offres'}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white no-underline backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 sm:px-7 sm:py-4 sm:text-base"
                >
                  {(isFr ? slide.secondaryCtaFr : slide.secondaryCtaEn) ||
                    (isFr ? "Appels d'offres" : 'Procurement')}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Controls — bottom-right ── */}
      <div className="absolute bottom-6 right-4 z-20 flex items-center gap-3 sm:bottom-8 sm:right-6 lg:right-8">
        {/* Pause/Play */}
        <button
          onClick={() => setPaused(!paused)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white"
          aria-label={paused ? 'Play' : 'Pause'}
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>

        {/* Prev */}
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white"
          aria-label={isFr ? 'Précédent' : 'Previous'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dots / progress indicators */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group relative flex h-9 w-9 items-center justify-center"
              aria-label={`${isFr ? 'Diapositive' : 'Slide'} ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
            >
              <span
                className={cn(
                  'block rounded-full transition-all duration-300',
                  i === current
                    ? 'h-2.5 w-2.5 bg-white shadow-sm shadow-white/50'
                    : 'h-2 w-2 bg-white/40 group-hover:bg-white/70'
                )}
              />
              {/* Auto-progress ring */}
              {i === current && !paused && (
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14}`}
                    strokeLinecap="round"
                    className="animate-[hero-progress_7s_linear_forwards]"
                    key={`progress-${current}`}
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white"
          aria-label={isFr ? 'Suivant' : 'Next'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Slide counter — bottom-left ── */}
      <div className="absolute bottom-6 left-4 z-20 sm:bottom-8 sm:left-6 lg:left-8">
        <span className="font-mono text-xs tabular-nums tracking-wider text-white/50">
          <span className="text-lg font-bold text-white">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="mx-1">/</span>
          {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
