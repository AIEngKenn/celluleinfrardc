'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=1080&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop',
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

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const locale = useLocale();
  const isFr = locale === 'fr';

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];
  const slideNum = String(current + 1).padStart(2, '0');
  const totalNum = String(slides.length).padStart(2, '0');

  return (
    <section
      className="ci-hero"
      aria-label="Diaporama principal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background layers */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="ci-hero-bg"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${s.image})`,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        />
      ))}
      <div className="ci-hero-overlay" aria-hidden="true" />

      {/* Slide content */}
      <div className="ci-hero-content">
        <p className="ci-hero-eyebrow">{isFr ? slide.eyebrowFr : slide.eyebrowEn}</p>
        <h1 className="ci-hero-title">{isFr ? slide.titleFr : slide.titleEn}</h1>
        <p className="ci-hero-desc">{isFr ? slide.descriptionFr : slide.descriptionEn}</p>
        <div className="ci-hero-actions">
          <Link href={`/${locale}${slide.cta1Href}`} className="ci-btn-primary">
            {isFr ? 'Voir les projets' : 'View projects'}
            <ArrowRight size={16} />
          </Link>
          <Link href={`/${locale}${slide.cta2Href}`} className="ci-btn-outline-white">
            {isFr ? "Appels d'offres" : 'Procurement'}
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
        {slides.map((_, i) => (
          <button
            key={i}
            className={`ci-hero-dot${i === current ? 'ci-hero-dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`${isFr ? 'Diapositive' : 'Slide'} ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
