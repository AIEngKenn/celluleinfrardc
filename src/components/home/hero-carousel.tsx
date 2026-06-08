'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { HomeHeroSlide } from '@/lib/sanity/types';

const HERO_PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

const fallbackSlides: Required<Pick<HomeHeroSlide, 'titleFr' | 'image'>>[] & HomeHeroSlide[] = [
  {
    id: 1,
    image: { asset: { _id: 'fallback-1', url: HERO_PLACEHOLDER_IMAGE } },
    eyebrowFr: 'Infrastructure Routière',
    eyebrowEn: 'Road Infrastructure',
    titleFr: 'Moderniser les routes pour connecter la nation',
    titleEn: 'Modernizing roads to connect the nation',
    descriptionFr:
      '250 projets routiers en cours dans les 26 provinces de la République Démocratique du Congo.',
    descriptionEn:
      '250 road projects underway across the 26 provinces of the Democratic Republic of Congo.',
    cta1Href: '/projets',
    cta2Href: '/appels-offres',
  },
  {
    id: 2,
    image: { asset: { _id: 'fallback-2', url: HERO_PLACEHOLDER_IMAGE } },
    eyebrowFr: 'Énergie Hydroélectrique',
    eyebrowEn: 'Hydroelectric Energy',
    titleFr: "Investir dans l'énergie propre pour l'avenir",
    titleEn: 'Investing in clean energy for the future',
    descriptionFr:
      'Grand Inga et autres barrages stratégiques : la RDC consolide son potentiel énergétique.',
    descriptionEn: 'Grand Inga and other strategic dams: DRC consolidates its energy potential.',
    cta1Href: '/projets',
    cta2Href: '/publications',
  },
  {
    id: 3,
    image: { asset: { _id: 'fallback-3', url: HERO_PLACEHOLDER_IMAGE } },
    eyebrowFr: 'Développement Urbain',
    eyebrowEn: 'Urban Development',
    titleFr: 'Construire des villes inclusives et durables',
    titleEn: 'Building inclusive and sustainable cities',
    descriptionFr:
      "Planification urbaine, logement social et réseaux d'eau : la CI pilote la transformation urbaine.",
    descriptionEn:
      'Urban planning, social housing and water networks: CI leads urban transformation.',
    cta1Href: '/projets',
    cta2Href: '/actualites',
  },
];

export function HeroCarousel({ slides }: { slides?: HomeHeroSlide[] }) {
  const items = slides?.filter((slide) => slide.titleFr).length
    ? slides.filter((slide) => slide.titleFr)
    : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const locale = useLocale();
  const isFr = locale === 'fr';

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = items[current] || items[0];
  const slideNum = String(current + 1).padStart(2, '0');
  const totalNum = String(items.length).padStart(2, '0');

  return (
    <section
      className="ci-hero"
      aria-label="Diaporama principal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background layers */}
      {items.map((s, i) => (
        <div
          key={`${s.titleFr}-${i}`}
          className="ci-hero-bg"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${s.image?.asset?.url || HERO_PLACEHOLDER_IMAGE})`,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        />
      ))}
      <div className="ci-hero-overlay" aria-hidden="true" />

      {/* Slide content */}
      <div className="ci-hero-content">
        <p className="ci-hero-eyebrow">{isFr ? slide.eyebrowFr : slide.eyebrowEn}</p>
        <h1 className="ci-hero-title">{isFr ? slide.titleFr : slide.titleEn || slide.titleFr}</h1>
        <p className="ci-hero-desc">
          {isFr ? slide.descriptionFr : slide.descriptionEn || slide.descriptionFr}
        </p>
        <div className="ci-hero-actions">
          <Link href={`/${locale}${slide.primaryHref || '/projets'}`} className="ci-btn-primary">
            {(isFr ? slide.primaryCtaFr : slide.primaryCtaEn) ||
              (isFr ? 'Voir les projets' : 'View projects')}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`/${locale}${slide.secondaryHref || '/appels-offres'}`}
            className="ci-btn-outline-white"
          >
            {(isFr ? slide.secondaryCtaFr : slide.secondaryCtaEn) ||
              (isFr ? "Appels d'offres" : 'Procurement')}
          </Link>
        </div>
      </div>

      {/* Slide counter + nav — bottom right */}
      <div className="ci-hero-controls">
        <button
          onClick={prev}
          className="ci-hero-nav-btn"
          aria-label={isFr ? 'Diapositive précédente' : 'Previous slide'}
        >
          <ChevronLeft size={16} />
        </button>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.05em',
          }}
        >
          {slideNum}&thinsp;/&thinsp;{totalNum}
        </span>
        <button
          onClick={next}
          className="ci-hero-nav-btn"
          aria-label={isFr ? 'Diapositive suivante' : 'Next slide'}
        >
          <ChevronRight size={16} />
        </button>

        {/* Dot indicators */}
        {items.map((_, i) => (
          <button
            key={i}
            className={`ci-hero-dot${i === current ? 'ci-hero-dot--active' : ''} hidden md:block`}
            onClick={() => setCurrent(i)}
            aria-label={`${isFr ? 'Diapositive' : 'Slide'} ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
