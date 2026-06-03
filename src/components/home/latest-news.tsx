'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const news = [
  {
    id: 1,
    titleFr: 'Lancement officiel des travaux de réhabilitation de la RN1',
    titleEn: 'Official launch of RN1 rehabilitation works',
    date: '2024-05-15',
    categoryFr: 'Projets',
    categoryEn: 'Projects',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    id: 2,
    titleFr: "Signature d'un accord de financement pour Inga 3",
    titleEn: 'Signing of financing agreement for Inga 3',
    date: '2024-05-10',
    categoryFr: 'Financement',
    categoryEn: 'Financing',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
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
        <div className="ci-section-header">
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
        </div>

        {/* Featured + secondary rows */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
          className="lg:grid-cols-[3fr_2fr]"
        >
          {/* Featured article */}
          <Link href={`/${locale}/actualites/${featured.id}`} className="ci-news-featured">
            {featured.image && (
              <div className="ci-news-featured-img">
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
        </div>
      </div>
    </section>
  );
}
