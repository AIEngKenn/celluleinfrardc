'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { News } from '@/lib/sanity/types';
import { truncateText } from '@/lib/content-cleanup';

export function LatestNews({ news }: { news?: News[] }) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  if (!news?.length) return null;
  const [featured, ...rest] = news;
  const featuredTitle = isFr ? featured.titleFr : featured.titleEn;

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
          <Link href={`/${locale}/actualites/${featured.slug}`} className="ci-news-featured">
            {featured.mainImage?.asset?.url && (
              <div className="ci-news-featured-img">
                <img
                  src={featured.mainImage.asset.url}
                  alt={featured.mainImage.alt || featuredTitle}
                  loading="lazy"
                />
              </div>
            )}
            <div className="ci-news-featured-body">
              <div className="ci-news-row-category" style={{ marginBottom: '0.75rem' }}>
                {isFr ? featured.category.nameFr : featured.category.nameEn}
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
                {truncateText(featuredTitle, 120)}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--ci-text-muted)' }}>
                {formatDate(featured.publishedAt, locale)}
              </p>
            </div>
          </Link>

          {/* Secondary: text rows */}
          <div>
            {rest.map((article) => (
              <Link
                key={article._id}
                href={`/${locale}/actualites/${article.slug}`}
                className="ci-news-row"
              >
                <span className="ci-news-row-date">{formatDate(article.publishedAt, locale)}</span>
                <div>
                  <div className="ci-news-row-category">
                    {isFr ? article.category.nameFr : article.category.nameEn}
                  </div>
                  <p className="ci-news-row-title">
                    {truncateText(isFr ? article.titleFr : article.titleEn, 95)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
