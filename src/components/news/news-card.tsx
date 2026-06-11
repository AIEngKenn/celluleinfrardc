'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { truncateText } from '@/lib/content-cleanup';

export interface NewsCardArticle {
  _id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr?: string;
  excerptEn?: string;
  publishedAt: string;
  featured?: boolean;
  category?: {
    nameFr: string;
    nameEn: string;
    slug?: string;
  };
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
}

const PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

interface NewsCardProps {
  article: NewsCardArticle;
  locale: string;
  featuredLabel?: string;
  className?: string;
  compact?: boolean;
}

export function NewsCard({
  article,
  locale,
  featuredLabel,
  className,
  compact = false,
}: NewsCardProps) {
  const isFr = locale === 'fr';
  const title = isFr ? article.titleFr : article.titleEn;
  const excerpt = isFr ? article.excerptFr : article.excerptEn;
  const displayTitle = truncateText(title, compact ? 85 : 105);
  const imageUrl = article.mainImage?.asset?.url || PLACEHOLDER_IMAGE;
  const categoryName = article.category
    ? isFr
      ? article.category.nameFr
      : article.category.nameEn
    : isFr
      ? 'Actualités'
      : 'News';

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    isFr ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <Link
      href={`/${locale}/actualites/${article.slug}`}
      className={cn('group block h-full', className)}
      aria-label={`${isFr ? 'Lire' : 'Read'}: ${title}`}
    >
      <article
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300',
          'hover:-translate-y-1 hover:border-rdc-blue/20 hover:shadow-2xl',
          'focus-within:ring-2 focus-within:ring-rdc-blue focus-within:ring-offset-2'
        )}
      >
        <div className="relative aspect-video shrink-0 overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={article.mainImage?.alt || title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {article.featured && featuredLabel && (
            <div className="absolute left-4 top-4">
              <span className="inline-flex rounded-full bg-rdc-yellow px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                {featuredLabel}
              </span>
            </div>
          )}
          {!article.mainImage?.asset?.url && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/20">
              <Newspaper className="h-16 w-16" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className={cn('flex flex-1 flex-col', compact ? 'p-4' : 'p-6')}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-semibold text-rdc-blue">
              {categoryName}
            </span>
          </div>

          <h3
            className={cn(
              'mb-3 font-bold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue',
              compact ? 'text-base line-clamp-2' : 'text-xl line-clamp-3'
            )}
            title={title}
          >
            {displayTitle}
          </h3>

          {excerpt && !compact && (
            <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{excerpt}</p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4 text-rdc-blue" aria-hidden="true" />
              <time dateTime={article.publishedAt}>{formattedDate}</time>
            </div>
            <ArrowRight
              className="h-5 w-5 text-rdc-blue transition-all duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
