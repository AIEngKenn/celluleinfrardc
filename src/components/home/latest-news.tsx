'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

const news = [
  {
    id: 1,
    titleFr: 'Lancement officiel des travaux de réhabilitation de la RN1',
    titleEn: 'Official launch of RN1 rehabilitation works',
    date: '2024-05-15',
    categoryFr: 'Projets',
    categoryEn: 'Projects',
    image: PLACEHOLDER_IMAGES.newsFeatured,
    featured: true,
  },
  {
    id: 2,
    titleFr: "Signature d'un accord de financement pour Inga 3",
    titleEn: 'Signing of financing agreement for Inga 3',
    date: '2024-05-10',
    categoryFr: 'Financement',
    categoryEn: 'Financing',
    image: PLACEHOLDER_IMAGES.newsFinancing,
  },
  {
    id: 3,
    titleFr: 'Visite de terrain des partenaires internationaux',
    titleEn: 'Field visit by international partners',
    date: '2024-05-08',
    categoryFr: 'Partenariats',
    categoryEn: 'Partnerships',
  },
  {
    id: 4,
    titleFr: 'Publication du rapport annuel 2023 de la Cellule Infrastructures',
    titleEn: 'Publication of the 2023 Annual Report of Cellule Infrastructures',
    date: '2024-04-22',
    categoryFr: 'Publications',
    categoryEn: 'Publications',
  },
];

export function LatestNews() {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const [featured, ...rest] = news;

  return (
    <section className="ci-section" style={{ background: 'white' }}>
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
            <span className="ci-eyebrow">{isFr ? 'Actualités récentes' : 'Latest news'}</span>
            <h2 className="ci-section-title">
              {isFr ? 'La vie des projets' : 'Projects in motion'}
            </h2>
          </div>
          <Link href={`/${locale}/actualites`} className="ci-view-all">
            {isFr ? 'Toutes les actualités' : 'All news'}
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Featured + secondary rows */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
          className="lg:grid-cols-[3fr_2fr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Featured article */}
          <Link href={`/${locale}/actualites/${featured.id}`} className="ci-news-featured">
            {featured.image && (
              <div className="ci-news-featured-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={isFr ? featured.titleFr : featured.titleEn}
                  loading="lazy"
                />
              </div>
            )}
            <div className="ci-news-featured-body">
              <div className="ci-news-row-category" style={{ marginBottom: '0.75rem' }}>
                {isFr ? featured.categoryFr : featured.categoryEn}
              </div>
              <h3
                style={{
                  fontSize: 'var(--ci-step-3)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: 'var(--ci-text-primary)',
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {isFr ? featured.titleFr : featured.titleEn}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ci-text-muted)' }}>
                {formatDate(featured.date, locale)}
              </p>
            </div>
          </Link>

          {/* Secondary: text rows */}
          <div>
            {rest.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/actualites/${article.id}`}
                className="ci-news-row"
              >
                <span className="ci-news-row-date">{formatDate(article.date, locale)}</span>
                <div>
                  <div className="ci-news-row-category">
                    {isFr ? article.categoryFr : article.categoryEn}
                  </div>
                  <p className="ci-news-row-title">{isFr ? article.titleFr : article.titleEn}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
