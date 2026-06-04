'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

const mediaItems = [
  {
    id: 1,
    image: PLACEHOLDER_IMAGES.media[0],
    titleFr: 'Construction de la route RN1',
    titleEn: 'RN1 road construction',
  },
  {
    id: 2,
    image: PLACEHOLDER_IMAGES.media[1],
    titleFr: 'Barrage hydroélectrique',
    titleEn: 'Hydroelectric dam',
  },
  {
    id: 3,
    image: PLACEHOLDER_IMAGES.media[2],
    titleFr: 'Développement urbain',
    titleEn: 'Urban development',
  },
  {
    id: 4,
    image: PLACEHOLDER_IMAGES.media[3],
    titleFr: 'Infrastructure moderne',
    titleEn: 'Modern infrastructure',
  },
  {
    id: 5,
    image: PLACEHOLDER_IMAGES.media[4],
    titleFr: 'Projet de construction',
    titleEn: 'Construction project',
  },
  {
    id: 6,
    image: PLACEHOLDER_IMAGES.media[5],
    titleFr: 'Chantier en cours',
    titleEn: 'Ongoing construction',
  },
];

export function MediaPreview() {
  const t = useTranslations('home.sections');
  const locale = useLocale();

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('media')}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === 'fr'
                ? 'Découvrez nos projets en images'
                : 'Discover our projects in images'}
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
              key={item.id}
              href={`/${locale}/mediatheque`}
              className={`group relative overflow-hidden rounded-lg bg-gray-200 ${
                index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div
                className={`aspect-square ${index === 0 || index === 5 ? 'md:aspect-video' : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={locale === 'fr' ? item.titleFr : item.titleEn}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white">
                      {locale === 'fr' ? item.titleFr : item.titleEn}
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
