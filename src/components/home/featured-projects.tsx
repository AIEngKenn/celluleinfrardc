'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

const projects = [
  {
    id: 1,
    titleFr: 'Réhabilitation de la Route Nationale N°1',
    titleEn: 'Rehabilitation of National Road N°1',
    province: 'Kinshasa',
    statusFr: 'En cours',
    statusEn: 'In progress',
    budget: 45000000,
    image: PLACEHOLDER_IMAGES.projectFeatured,
    sectorFr: 'Transport',
    sectorEn: 'Transport',
    featured: true,
  },
  {
    id: 2,
    titleFr: 'Construction du Barrage Hydroélectrique Inga 3',
    titleEn: 'Construction of Inga 3 Hydroelectric Dam',
    province: 'Kongo Central',
    statusFr: 'En préparation',
    statusEn: 'In preparation',
    budget: 120000000,
    image: PLACEHOLDER_IMAGES.projectEnergy,
    sectorFr: 'Énergie',
    sectorEn: 'Energy',
  },
  {
    id: 3,
    titleFr: "Modernisation de l'Aéroport International de Kinshasa",
    titleEn: 'Modernization of Kinshasa International Airport',
    province: 'Kinshasa',
    statusFr: 'En cours',
    statusEn: 'In progress',
    budget: 85000000,
    image: PLACEHOLDER_IMAGES.projectAirport,
    sectorFr: 'Transport aérien',
    sectorEn: 'Air transport',
  },
];

function statusClass(status: string) {
  if (status.toLowerCase().includes('cours') || status.toLowerCase().includes('progress'))
    return 'ci-badge ci-badge--blue';
  if (status.toLowerCase().includes('achev') || status.toLowerCase().includes('complet'))
    return 'ci-badge ci-badge--green';
  return 'ci-badge ci-badge--yellow';
}

export function FeaturedProjects() {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const [featured, ...rest] = projects;

  return (
    <section className="ci-section" style={{ background: 'var(--ci-bg-subtle)' }}>
      <div className="ci-container">
        {/* Header */}
        <motion.div
          className="ci-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div>
            <span className="ci-eyebrow">{isFr ? 'Projets phares' : 'Featured projects'}</span>
            <h2 className="ci-section-title">
              {isFr ? 'Projets structurants' : 'Structural projects'}
            </h2>
          </div>
          <Link href={`/${locale}/projets`} className="ci-view-all">
            {isFr ? 'Tous les projets' : 'All projects'}
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Editorial layout: large featured + stack */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1px',
            background: 'var(--ci-border)',
          }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px' }}
            className="lg:grid-cols-[2fr_1fr]"
          >
            {/* Main featured */}
            <Link
              href={`/${locale}/projets/${featured.id}`}
              className="ci-project-card"
              style={{ gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}
            >
              <div className="ci-project-card-img" style={{ flex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={isFr ? featured.titleFr : featured.titleEn}
                  loading="lazy"
                />
              </div>
              <div className="ci-project-card-body">
                <div className="ci-project-card-meta">
                  <MapPin size={12} />
                  <span>{featured.province}</span>
                  <span style={{ color: 'var(--ci-border-strong)' }}>·</span>
                  <span>{isFr ? featured.sectorFr : featured.sectorEn}</span>
                </div>
                <h3 className="ci-project-card-title" style={{ fontSize: '1.25rem' }}>
                  {isFr ? featured.titleFr : featured.titleEn}
                </h3>
                <div className="ci-project-card-footer">
                  <span className={statusClass(isFr ? featured.statusFr : featured.statusEn)}>
                    {isFr ? featured.statusFr : featured.statusEn}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--ci-text-primary)',
                    }}
                  >
                    ${(featured.budget / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
            </Link>

            {/* Side stack */}
            {rest.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/projets/${project.id}`}
                className="ci-project-card"
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <div
                  style={{
                    width: '8rem',
                    flexShrink: 0,
                    overflow: 'hidden',
                    background: 'var(--ci-bg-tinted)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={isFr ? project.titleFr : project.titleEn}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s',
                    }}
                  />
                </div>
                <div className="ci-project-card-body" style={{ flex: 1 }}>
                  <div className="ci-project-card-meta">
                    <MapPin size={11} />
                    <span>{project.province}</span>
                  </div>
                  <h3 className="ci-project-card-title" style={{ fontSize: '0.9rem' }}>
                    {isFr ? project.titleFr : project.titleEn}
                  </h3>
                  <span
                    className={statusClass(
                      isFr ? (project.statusFr ?? '') : (project.statusEn ?? '')
                    )}
                  >
                    {isFr ? project.statusFr : project.statusEn}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
