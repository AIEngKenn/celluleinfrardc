'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { News } from '@/lib/sanity/types';
import { truncateText } from '@/lib/content-cleanup';

const ARTICLE_PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

export function LatestNews({ news }: { news?: News[] }) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  if (!news?.length) return null;

  const [featured, ...rest] = news;

  const featuredTitle = isFr ? featured.titleFr : featured.titleEn;

  const featuredImage = featured.mainImage?.asset?.url || ARTICLE_PLACEHOLDER_IMAGE;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex items-end justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rdc-blue">
              {isFr ? 'Actualités récentes' : 'Latest news'}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {isFr ? 'La vie des projets' : 'Projects in motion'}
            </h2>
          </div>

          <Link
            href={`/${locale}/actualites`}
            className="flex items-center gap-2 text-sm font-semibold text-rdc-blue transition-all hover:gap-3"
          >
            {isFr ? 'Toutes les actualités' : 'All news'}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          className="grid gap-8 lg:grid-cols-[3fr_2fr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          {/* FEATURED */}
          <Link
            href={`/${locale}/actualites/${featured.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={featuredImage}
                alt={featured.mainImage?.alt || featuredTitle}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="mb-3 inline-flex rounded-full bg-rdc-blue/90 px-3 py-1 text-xs font-semibold text-white">
                  {isFr ? featured.category.nameFr : featured.category.nameEn}
                </span>

                <h3 className="mb-3 text-xl font-bold leading-tight text-white md:text-2xl">
                  {truncateText(featuredTitle, 120)}
                </h3>

                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(featured.publishedAt, locale)}</span>
                </div>
              </div>
            </div>
          </Link>

          {/* SECONDARY LIST */}
          <div className="flex flex-col gap-4">
            {rest.map((article) => {
              const title = isFr ? article.titleFr : article.titleEn;

              return (
                <Link
                  key={article._id}
                  href={`/${locale}/actualites/${article.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-rdc-blue/20 hover:shadow-lg"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-rdc-blue/10 px-2.5 py-1 text-[11px] font-semibold text-rdc-blue">
                        {isFr ? article.category.nameFr : article.category.nameEn}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(article.publishedAt, locale)}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue">
                      {truncateText(title, 95)}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-rdc-blue" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
