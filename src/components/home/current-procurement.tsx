'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, FileText, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Procurement } from '@/lib/sanity/types';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';

const PROCUREMENT_PLACEHOLDER = '/images/placeholders/RDC-Drapeau-CUA.jpg';

function procurementImage(opportunity: Procurement) {
  const relatedImage = opportunity.relatedProjects?.[0]?.mainImage?.asset?.url;
  return relatedImage || PROCUREMENT_PLACEHOLDER;
}

function categoryLabel(category: string, isFr: boolean) {
  const labels: Record<string, { fr: string; en: string }> = {
    works: { fr: 'Travaux', en: 'Works' },
    supplies: { fr: 'Fournitures', en: 'Supplies' },
    services: { fr: 'Services', en: 'Services' },
    consultancy: { fr: 'Consultance', en: 'Consultancy' },
    recruitment: { fr: 'Recrutement', en: 'Recruitment' },
  };
  const entry = labels[category];
  if (entry) return isFr ? entry.fr : entry.en;
  return category;
}

export function CurrentProcurement({ opportunities }: { opportunities?: Procurement[] }) {
  const t = useTranslations('home.sections');
  const locale = useLocale();
  const isFr = locale === 'fr';

  if (!opportunities?.length) return null;

  const [featured, ...restAll] = opportunities;
  const rest = restAll.slice(0, 4);
  const featuredTitle = isFr ? featured.titleFr : featured.titleEn;
  const featuredDescription = cleanMigratedText(
    isFr ? featured.descriptionFr : featured.descriptionEn
  );
  const featuredImage = procurementImage(featured);
  const featuredDays = Math.ceil(
    (new Date(featured.closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const featuredUrgent = featuredDays <= 7 && featuredDays > 0;

  return (
    <section
      className="overflow-hidden bg-slate-50 py-16 sm:py-20"
      aria-labelledby="home-procurement-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rdc-blue">
              {isFr ? 'Marchés publics' : 'Public procurement'}
            </span>
            <h2 id="home-procurement-heading" className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {t('procurement')}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
              {isFr
                ? "Opportunités d'affaires actuelles ouvertes aux soumissionnaires."
                : 'Current business opportunities open to bidders.'}
            </p>
          </div>
          <Link
            href={`/${locale}/appels-offres`}
            className="hidden items-center gap-2 text-sm font-semibold text-rdc-blue transition-all hover:gap-3 sm:inline-flex"
          >
            {isFr ? "Tous les appels d'offres" : 'All procurement'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Left: list */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            {rest.map((opportunity) => {
              const title = isFr ? opportunity.titleFr : opportunity.titleEn;
              const daysUntilDeadline = Math.ceil(
                (new Date(opportunity.closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;

              return (
                <Link
                  key={opportunity._id}
                  href={`/${locale}/appels-offres/${opportunity.slug}`}
                  className="group block"
                >
                  <article className="flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rdc-blue/20 hover:shadow-lg sm:p-5">
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-32">
                      <img
                        src={procurementImage(opportunity)}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-rdc-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-rdc-blue">
                          {categoryLabel(opportunity.category, isFr)}
                        </span>
                        {isUrgent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rdc-red/10 px-2.5 py-0.5 text-[11px] font-semibold text-rdc-red">
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {daysUntilDeadline} {isFr ? 'j' : 'd'}
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue sm:text-base">
                        {truncateText(title, 100)}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-rdc-blue" aria-hidden="true" />
                        {formatDate(opportunity.closingDate, locale)}
                      </p>
                    </div>
                    <ArrowRight className="mt-2 hidden h-5 w-5 shrink-0 text-rdc-blue opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 sm:block" />
                  </article>
                </Link>
              );
            })}

            {rest.length === 0 ? (
              <div className="flex h-full flex-col justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="mb-3 inline-flex w-fit rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-semibold text-rdc-blue">
                  {isFr ? 'Marchés ouverts' : 'Open tenders'}
                </span>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {isFr
                    ? "Soumissionnez aux appels d'offres en cours"
                    : 'Submit bids for open opportunities'}
                </h3>
                <p className="mb-6 text-sm leading-6 text-slate-600">
                  {isFr
                    ? "Consultez les dossiers complets, les pièces jointes et les dates limites sur la page dédiée."
                    : 'Review full dossiers, attachments and deadlines on the dedicated page.'}
                </p>
                <Link
                  href={`/${locale}/appels-offres`}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-rdc-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-rdc-blue/90 hover:gap-3"
                >
                  {isFr ? "Voir tous les appels d'offres" : 'View all procurement'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </motion.div>

          {/* Right: featured latest */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Link
              href={`/${locale}/appels-offres/${featured.slug}`}
              className="group block h-full"
            >
              <article className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-rdc-blue/20 hover:shadow-2xl">
                <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
                  <img
                    src={featuredImage}
                    alt={featuredTitle}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-rdc-blue shadow">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      {isFr ? 'Dernier appel' : 'Latest opportunity'}
                    </span>
                    {featuredUrgent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rdc-red px-3 py-1 text-xs font-semibold text-white">
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {featuredDays} {isFr ? 'jours restants' : 'days left'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-rdc-blue/10 px-3 py-1 font-semibold text-rdc-blue">
                      {categoryLabel(featured.category, isFr)}
                    </span>
                    <span className="font-mono">{featured.reference}</span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue sm:text-2xl">
                    {truncateText(featuredTitle, 120)}
                  </h3>

                  {featuredDescription && (
                    <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                      {truncateText(featuredDescription, 180)}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-rdc-blue" aria-hidden="true" />
                      <span>
                        {isFr ? 'Clôture:' : 'Deadline:'}{' '}
                        <strong className="text-slate-900">
                          {formatDate(featured.closingDate, locale)}
                        </strong>
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-rdc-blue">
                      {isFr ? 'Consulter' : 'View'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/appels-offres`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rdc-blue"
          >
            {isFr ? "Tous les appels d'offres" : 'All procurement'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
