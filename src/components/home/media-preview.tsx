'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import type { MediaItem } from '@/lib/sanity/types';

export function MediaPreview({
  mediaItems,
  titleFr,
  titleEn,
  descriptionFr,
  descriptionEn,
}: {
  mediaItems?: MediaItem[];
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}) {
  const t = useTranslations('home.sections');
  const locale = useLocale();
  if (!mediaItems?.length) return null;
  const isFr = locale === 'fr';

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {(isFr ? titleFr : titleEn) || t('media')}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {(isFr ? descriptionFr : descriptionEn) ||
                (isFr ? 'Découvrez nos projets en images' : 'Discover our projects in images')}
            </p>
          </div>
          <Link
            href={`/${locale}/mediatheque`}
            className="hidden items-center gap-2 font-medium text-rdc-blue transition-colors hover:text-rdc-blue/80 sm:flex"
          >
            {locale === 'fr' ? 'Voir la galerie complète' : 'View full gallery'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {mediaItems.map((item, index) => (
            <Link
              key={item._id}
              href={`/${locale}/mediatheque`}
              className={`group relative overflow-hidden rounded-lg bg-gray-200 ${
                index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div
                className={`aspect-square ${index === 0 || index === 5 ? 'md:aspect-video' : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {(item.image?.asset?.url || item.thumbnail?.asset?.url) && (
                  <img
                    src={item.image?.asset?.url || item.thumbnail?.asset?.url}
                    alt={item.image?.alt || item.thumbnail?.alt || item.title?.[isFr ? 'fr' : 'en']}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white">
                      {item.title?.[isFr ? 'fr' : 'en']}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/mediatheque`}
            className="flex items-center gap-2 font-medium text-rdc-blue transition-colors hover:text-rdc-blue/80"
          >
            {locale === 'fr' ? 'Voir la galerie complète' : 'View full gallery'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
