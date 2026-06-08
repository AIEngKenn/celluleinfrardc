'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { FileText, Download, ArrowRight } from 'lucide-react';
import type { Publication } from '@/lib/sanity/types';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';

export function RecentPublications({ publications }: { publications?: Publication[] }) {
  const t = useTranslations('home.sections');
  const locale = useLocale();
  if (!publications?.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('publications')}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === 'fr'
                ? 'Rapports, études et documents officiels'
                : 'Reports, studies and official documents'}
            </p>
          </div>
          <Link
            href={`/${locale}/publications`}
            className="hidden items-center gap-2 font-medium transition-colors hover:text-rdc-red/80 sm:flex"
          >
            {locale === 'fr' ? 'Toutes les publications' : 'All publications'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {publications.map((publication) => (
            // <Link
            //   key={publication._id}
            //   href={`/${locale}/publications/${publication.slug}`}
            //   className="group flex gap-4 rounded-lg bg-white border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-rdc-blue"
            // >
            //   {/* Icon */}
            //   <div className="flex-shrink-0">
            //     <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rdc-red/10 group-hover:bg-rdc-red/20 transition-colors">
            //       <FileText className="h-8 w-8 text-rdc-red" />
            //     </div>
            //   </div>

            //   {/* Content */}
            //   <div className="flex-1 min-w-0">
            //     <div className="mb-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            //       {publication.publicationType}
            //     </div>
            //     <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors line-clamp-2">
            //       {truncateText(locale === "fr" ? publication.titleFr : publication.titleEn, 105)}
            //     </h3>
            //     <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            //       {truncateText(
            //         cleanMigratedText(locale === "fr" ? publication.descriptionFr : publication.descriptionEn),
            //         130
            //       )}
            //     </p>
            //     <div className="flex items-center gap-4 text-sm text-gray-500">
            //       <span>{publication.publicationType}</span>
            //       {publication.pdfFile?.asset?.size ? (
            //         <>
            //           <span>•</span>
            //           <span>{(publication.pdfFile.asset.size / 1024 / 1024).toFixed(1)} MB</span>
            //         </>
            //       ) : null}
            //     </div>
            //   </div>

            //   {/* Download Icon */}
            //   <div className="flex-shrink-0">
            //     {publication.pdfFile?.asset?.url ? (
            //       <Download className="h-5 w-5 text-gray-400 group-hover:text-rdc-blue transition-colors" />
            //     ) : null}
            //   </div>
            // </Link>
            <Link
              key={publication._id}
              href={`/${locale}/publications/${publication.slug}`}
              className="group block h-full"
            >
              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#CE1021]/20 hover:shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    {publication.publicationType}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CE1021]/10 text-[#CE1021] transition-all duration-300 group-hover:bg-[#CE1021] group-hover:text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-[#3c3c3d]">
                  {truncateText(locale === 'fr' ? publication.titleFr : publication.titleEn, 105)}
                </h3>

                <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                  {truncateText(
                    cleanMigratedText(
                      locale === 'fr' ? publication.descriptionFr : publication.descriptionEn
                    ),
                    130
                  )}
                </p>

                <div className="mt-auto border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      {/* <span>{publication.publicationType}</span> */}
                      <span></span>

                      {publication.pdfFile?.asset?.size ? (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>
                            {(publication.pdfFile.asset.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </>
                      ) : null}
                    </div>

                    {/* Download Icon */}
                    <div className="flex-shrink-0">
                      {publication.pdfFile?.asset?.url ? (
                        <Download className="h-5 w-5 text-gray-400 transition-colors group-hover:text-rdc-red" />
                      ) : null}
                    </div>

                    {/* <div className="flex items-center gap-2 text-sm font-semibold text-[#CE1021] transition-all duration-300 group-hover:gap-3">
                      <span>{t('view')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div> */}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/publications`}
            className="flex items-center gap-2 font-medium transition-colors hover:text-rdc-red/80"
          >
            {locale === 'fr' ? 'Toutes les publications' : 'All publications'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
