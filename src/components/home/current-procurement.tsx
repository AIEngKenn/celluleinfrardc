'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Procurement } from '@/lib/sanity/types';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';

export function CurrentProcurement({ opportunities }: { opportunities?: Procurement[] }) {
  const t = useTranslations('home.sections');
  const locale = useLocale();
  if (!opportunities?.length) return null;

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('procurement')}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === 'fr'
                ? "Opportunités d'affaires actuelles"
                : 'Current business opportunities'}
            </p>
          </div>
          <Link
            href={`/${locale}/appels-offres`}
            className="hidden items-center gap-2 font-medium text-rdc-blue transition-colors hover:text-rdc-blue/80 sm:flex"
          >
            {locale === 'fr' ? "Tous les appels d'offres" : 'All procurement'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {opportunities.map((opportunity) => {
            const daysUntilDeadline = Math.ceil(
              (new Date(opportunity.closingDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const isUrgent = daysUntilDeadline <= 7;

            return (
              // <Link
              //   key={opportunity._id}
              //   href={`/${locale}/appels-offres/${opportunity.slug}`}
              //   className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-white p-6 border border-gray-200 transition-all hover:shadow-lg hover:border-rdc-blue"
              // >
              //   <div className="flex-1">
              //     <div className="mb-2 flex items-center gap-2">
              //       <span className="inline-flex rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-medium text-rdc-blue">
              //         {opportunity.category}
              //       </span>
              //       <span className="text-sm text-gray-500">
              //         {opportunity.reference}
              //       </span>
              //     </div>
              //     <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors mb-2">
              //       {truncateText(locale === "fr" ? opportunity.titleFr : opportunity.titleEn, 120)}
              //     </h3>
              //     {(opportunity.descriptionFr || opportunity.descriptionEn) && (
              //       <p className="mb-3 line-clamp-2 text-sm text-gray-600">
              //         {truncateText(
              //           cleanMigratedText(locale === "fr" ? opportunity.descriptionFr : opportunity.descriptionEn),
              //           150
              //         )}
              //       </p>
              //     )}
              //     <div className="flex items-center gap-4 text-sm text-gray-500">
              //       <div className="flex items-center gap-1">
              //         <Calendar className="h-4 w-4" />
              //         <span>
              //           {locale === "fr" ? "Date limite: " : "Deadline: "}
              //           {formatDate(opportunity.closingDate, locale)}
              //         </span>
              //       </div>
              //     </div>
              //   </div>
              //   <div className="flex items-center gap-3">
              //     {isUrgent && (
              //       <div className="flex items-center gap-1 rounded-full bg-rdc-red/10 px-3 py-1">
              //         <AlertCircle className="h-4 w-4 text-rdc-red" />
              //         <span className="text-xs font-medium text-rdc-red">
              //           {daysUntilDeadline} {locale === "fr" ? "jours" : "days"}
              //         </span>
              //       </div>
              //     )}
              //     <FileText className="h-5 w-5 text-gray-400 group-hover:text-rdc-blue transition-colors" />
              //   </div>
              // </Link>
              <Link
                key={opportunity._id}
                href={`/${locale}/appels-offres/${opportunity.slug}`}
                className="group block"
              >
                <article className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rdc-blue/20 hover:shadow-2xl sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-semibold text-rdc-blue">
                        {opportunity.category}
                      </span>

                      <span className="text-xs text-slate-500">{opportunity.reference}</span>

                      {isUrgent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rdc-red/10 px-3 py-1 text-xs font-semibold text-rdc-red">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {daysUntilDeadline} {locale === 'fr' ? 'jours restants' : 'days left'}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-3 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue sm:text-xl">
                      {truncateText(
                        locale === 'fr' ? opportunity.titleFr : opportunity.titleEn,
                        120
                      )}
                    </h3>

                    {(opportunity.descriptionFr || opportunity.descriptionEn) && (
                      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">
                        {truncateText(
                          cleanMigratedText(
                            locale === 'fr' ? opportunity.descriptionFr : opportunity.descriptionEn
                          ),
                          150
                        )}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4 text-rdc-blue" />
                      <span>
                        {locale === 'fr' ? 'Date limite:' : 'Deadline:'}{' '}
                        <span className="font-medium text-slate-700">
                          {formatDate(opportunity.closingDate, locale)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all duration-300 group-hover:scale-105 group-hover:bg-rdc-blue group-hover:text-white">
                      <FileText className="h-5 w-5" />
                    </div>

                    <ArrowRight className="ml-3 h-5 w-5 text-rdc-blue opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/appels-offres`}
            className="flex items-center gap-2 font-medium text-rdc-blue transition-colors hover:text-rdc-blue/80"
          >
            {locale === 'fr' ? "Tous les appels d'offres" : 'All procurement'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
