import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { moreProcurementQuery, procurementBySlugQuery } from '@/lib/sanity/queries';
import type { Procurement } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Download, ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import { SharePanel } from '@/components/share/share-panel';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const procurement = await sanityFetch<Procurement>({
    query: procurementBySlugQuery,
    params: { slug },
    tags: [`procurement:${slug}`],
  });

  if (!procurement) return {};

  const title = locale === 'fr' ? procurement.titleFr : procurement.titleEn;
  const description = cleanMigratedText(
    locale === 'fr' ? procurement.descriptionFr : procurement.descriptionEn
  );

  return createSeoMetadata({
    locale,
    path: `/appels-offres/${procurement.slug}`,
    title: `${procurement.reference} - ${title}`,
    description,
    type: 'article',
    publishedTime: procurement.openingDate,
    modifiedTime: procurement._updatedAt,
    keywords: [
      procurement.reference,
      title,
      "appel d'offres infrastructures RDC",
      procurement.category,
    ],
  });
}

export default async function ProcurementDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'procurement' });

  const [procurement, moreProcurement] = await Promise.all([
    sanityFetch<Procurement>({
      query: procurementBySlugQuery,
      params: { slug },
      tags: [`procurement:${slug}`],
    }),
    sanityFetch<Procurement[]>({
      query: moreProcurementQuery,
      params: { slug },
      tags: ['procurement'],
    }),
  ]);

  if (!procurement) {
    notFound();
  }

  const title = locale === 'fr' ? procurement.titleFr : procurement.titleEn;
  const description = cleanMigratedText(
    locale === 'fr' ? procurement.descriptionFr : procurement.descriptionEn
  );
  const closingDate = new Date(procurement.closingDate);
  const openingDate = new Date(procurement.openingDate);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isClosed = closingDate < today;
  const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
  const attachments = procurement.attachments?.filter((doc) => doc.file?.asset?.url) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/${locale}/appels-offres${isClosed ? '?tab=closed' : '?tab=open'}`}
            className="mb-5 inline-flex items-center gap-2 text-rdc-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProcurement')}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-semibold text-rdc-blue">
              {t(`categories.${procurement.category}`)}
            </span>

            {isUrgent && !isClosed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rdc-red/10 px-3 py-1 text-xs font-semibold text-rdc-red">
                <AlertCircle className="h-3.5 w-3.5" />
                {daysRemaining} {locale === 'fr' ? 'jours restants' : 'days left'}
              </span>
            )}

            {isClosed && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {t('closed')}
              </span>
            )}

            <span className="font-mono text-xs text-slate-500">{procurement.reference}</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">{title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Urgent Banner */}
        {isUrgent && !isClosed && (
          <div className="mb-8 rounded-2xl border border-rdc-red/20 bg-rdc-red/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-rdc-red" />
              <div>
                <h3 className="font-semibold text-slate-900">{t('urgentDeadline')}</h3>
                <p className="text-sm text-slate-600">
                  {t('urgentDeadlineDescription', { days: daysRemaining })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* MAIN */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{t('description')}</h2>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{description}</p>
            </div>

            {/* Documents */}
            {attachments.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-slate-900">{t('tenderDocuments')}</h2>

                <div className="space-y-3">
                  {attachments.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.file.asset?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-rdc-blue/20 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-rdc-blue" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {locale === 'fr' ? doc.titleFr : doc.titleEn}
                          </p>
                          {doc.file.asset?.size && (
                            <p className="text-xs text-slate-500">
                              {(doc.file.asset.size / 1024 / 1024).toFixed(2)} MB · PDF
                            </p>
                          )}
                        </div>
                      </div>

                      <Download className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related Projects (SAFE: no shape change) */}
            {procurement.relatedProjects && procurement.relatedProjects.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-slate-900">{t('relatedProjects')}</h2>

                <div className="space-y-3">
                  {procurement.relatedProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/${locale}/projets/${project.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-rdc-blue/20 hover:bg-slate-50"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rdc-blue/10 text-rdc-blue transition group-hover:bg-rdc-blue group-hover:text-white">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-rdc-blue">
                          {truncateText(locale === 'fr' ? project.titleFr : project.titleEn, 120)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {locale === 'fr' ? 'Projet lié' : 'Related project'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <SharePanel
              title={title}
              description={description}
              path={`/${locale}/appels-offres/${procurement.slug}`}
              locale={locale}
            />

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-slate-900">{t('timeline')}</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="text-xs text-slate-500">{t('openingDate')}</p>
                    <p className="text-sm font-medium text-slate-900">
                      {openingDate.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="text-xs text-slate-500">{t('closingDate')}</p>
                    <p
                      className={`text-sm font-medium ${
                        isUrgent ? 'text-rdc-red' : 'text-slate-900'
                      }`}
                    >
                      {closingDate.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    {!isClosed && daysRemaining > 0 && (
                      <p className={`text-xs ${isUrgent ? 'text-rdc-red' : 'text-slate-500'}`}>
                        {t('daysRemaining', { days: daysRemaining })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            {procurement.budget && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{t('estimatedBudget')}</h3>
                <p className="text-2xl font-bold text-rdc-blue">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(procurement.budget)}
                </p>
              </div>
            )}

            {/* Help */}
            <div className="rounded-2xl border border-rdc-blue/10 bg-rdc-blue/5 p-6">
              <h3 className="mb-2 text-lg font-bold text-slate-900">{t('needHelp')}</h3>
              <p className="mb-4 text-sm text-slate-600">{t('needHelpDescription')}</p>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-rdc-blue px-4 py-3 text-sm font-semibold text-white hover:bg-rdc-blue/90"
              >
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </div>

        {/* MORE PROCUREMENT (SAFE CHECK FIXED) */}
        {moreProcurement && moreProcurement.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {locale === 'fr' ? "D'autres appels d'offres" : 'More opportunities'}
              </h2>

              <Link
                href={`/${locale}/appels-offres`}
                className="text-sm font-semibold text-rdc-blue"
              >
                {locale === 'fr' ? 'Voir tous' : 'View all'}
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {moreProcurement.map((item) => (
                <Link
                  key={item._id}
                  href={`/${locale}/appels-offres/${item.slug}`}
                  className="group"
                >
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-rdc-blue/20 hover:shadow-xl">
                    <p className="mb-2 font-mono text-xs text-slate-500">{item.reference}</p>

                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-rdc-blue">
                      {locale === 'fr' ? item.titleFr : item.titleEn}
                    </h3>

                    <p className="mt-3 text-xs text-slate-500">
                      {new Date(item.closingDate).toLocaleDateString(
                        locale === 'fr' ? 'fr-FR' : 'en-US'
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
