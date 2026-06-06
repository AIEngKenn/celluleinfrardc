'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/sanity/types';
import { formatCurrency } from '@/lib/sanity/types';
import { truncateText } from '@/lib/content-cleanup';

function statusClass(status: string) {
  if (status === 'ongoing')
    return 'ci-badge ci-badge--blue';
  if (status === 'completed')
    return 'ci-badge ci-badge--green';
  return 'ci-badge ci-badge--yellow';
}

function statusLabel(status: Project['status'], isFr: boolean) {
  const labels = {
    preparation: isFr ? 'En préparation' : 'In preparation',
    ongoing: isFr ? 'En cours' : 'Ongoing',
    completed: isFr ? 'Terminé' : 'Completed',
    suspended: isFr ? 'Suspendu' : 'Suspended',
  };
  return labels[status] || status;
}

export function FeaturedProjects({ projects }: { projects?: Project[] }) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  if (!projects?.length) return null;
  const [featured, ...rest] = projects;
  const featuredTitle = isFr ? featured.titleFr : featured.titleEn;

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
              href={`/${locale}/projets/${featured.slug}`}
              className="ci-project-card"
              style={{ gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}
            >
              <div className="ci-project-card-img" style={{ flex: 1 }}>
                {featured.mainImage?.asset?.url && (
                  <img src={featured.mainImage.asset.url} alt={featured.mainImage.alt || featuredTitle} loading="lazy" />
                )}
              </div>
              <div className="ci-project-card-body">
                <div className="ci-project-card-meta">
                  <MapPin size={12} />
                  <span>{isFr ? featured.province.nameFr : featured.province.nameEn}</span>
                  <span style={{ color: 'var(--ci-border-strong)' }}>·</span>
                  <span>{featured.sector}</span>
                </div>
                <h3 className="ci-project-card-title" style={{ fontSize: '1.25rem' }}>
                  {truncateText(featuredTitle, 110)}
                </h3>
                <div className="ci-project-card-footer">
                  <span className={statusClass(featured.status)}>
                    {statusLabel(featured.status, isFr)}
                  </span>
                  {featured.budget ? (
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ci-text-primary)' }}>
                      {formatCurrency(featured.budget, locale as 'fr' | 'en')}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>

            {/* Side stack */}
            {rest.map((project) => (
              <Link
                key={project._id}
                href={`/${locale}/projets/${project.slug}`}
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
                  {project.mainImage?.asset?.url && (
                    <img
                      src={project.mainImage.asset.url}
                      alt={project.mainImage.alt || (isFr ? project.titleFr : project.titleEn)}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    />
                  )}
                </div>
                <div className="ci-project-card-body" style={{ flex: 1 }}>
                  <div className="ci-project-card-meta">
                    <MapPin size={11} />
                    <span>{isFr ? project.province.nameFr : project.province.nameEn}</span>
                  </div>
                  <h3 className="ci-project-card-title" style={{ fontSize: '0.9rem' }}>
                    {truncateText(isFr ? project.titleFr : project.titleEn, 80)}
                  </h3>
                  <span className={statusClass(project.status)}>
                    {statusLabel(project.status, isFr)}
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
