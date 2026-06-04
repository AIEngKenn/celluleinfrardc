import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { activeProcurementQuery, closedProcurementQuery } from '@/lib/sanity/queries';
import type { Procurement } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: 'open' | 'closed' }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'procurement' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function ProcurementPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { tab = 'open' } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'procurement' });

  // Fetch open and closed procurement
  const [openProcurement, closedProcurement] = await Promise.all([
    sanityFetch<Procurement[]>({
      query: activeProcurementQuery,
      tags: ['procurement'],
    }),
    sanityFetch<Procurement[]>({
      query: closedProcurementQuery,
      tags: ['procurement'],
    }),
  ]);

  const currentProcurement = tab === 'open' ? openProcurement : closedProcurement;

  return (
    <div>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />
      <div className="ci-container ci-section--sm">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-6">
            <Link
              href={`/${locale}/appels-offres?tab=open`}
              className={`border-b-2 px-2 pb-4 font-medium transition-colors ${
                tab === 'open'
                  ? 'border-rdc-blue text-rdc-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('tabs.open')}
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-rdc-blue px-2 py-1 text-xs font-bold leading-none text-white">
                {openProcurement.length}
              </span>
            </Link>
            <Link
              href={`/${locale}/appels-offres?tab=closed`}
              className={`border-b-2 px-2 pb-4 font-medium transition-colors ${
                tab === 'closed'
                  ? 'border-rdc-blue text-rdc-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('tabs.closed')}
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-1 text-xs font-bold leading-none text-gray-600">
                {closedProcurement.length}
              </span>
            </Link>
          </div>
        </div>

        {/* Alert for open procurements */}
        {tab === 'open' && openProcurement.length > 0 && (
          <div className="mb-8 rounded-lg border border-rdc-yellow/30 bg-rdc-yellow/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-rdc-yellow" />
              <div>
                <p className="font-medium text-gray-900">{t('activeNotice')}</p>
                <p className="mt-1 text-sm text-gray-600">{t('activeNoticeDescription')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Procurement List */}
        <div className="space-y-6">
          {currentProcurement.map((proc) => {
            const title = locale === 'fr' ? proc.titleFr : proc.titleEn;
            const description = locale === 'fr' ? proc.descriptionFr : proc.descriptionEn;
            const closingDate = new Date(proc.closingDate);
            const openingDate = new Date(proc.openingDate);
            const today = new Date();
            const daysRemaining = Math.ceil(
              (closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            const isUrgent = daysRemaining <= 7 && daysRemaining > 0;

            return (
              <Card key={proc._id} className="p-6 transition-shadow hover:shadow-lg">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="mb-3 flex items-start gap-3">
                      <FileText className="mt-1 h-6 w-6 text-rdc-blue" />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-500">{proc.reference}</span>
                          <Badge variant={tab === 'open' ? 'default' : 'secondary'}>
                            {t(`categories.${proc.category}`)}
                          </Badge>
                          {isUrgent && (
                            <Badge variant="destructive" className="bg-rdc-red">
                              {t('urgent')}
                            </Badge>
                          )}
                        </div>
                        <Link href={`/${locale}/appels-offres/${proc.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 transition-colors hover:text-rdc-blue">
                            {title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mb-4 line-clamp-2 text-gray-600">{description}</p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-gray-500">{t('openingDate')}</p>
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {openingDate.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-500">{t('closingDate')}</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span
                            className={isUrgent ? 'font-semibold text-rdc-red' : 'text-gray-900'}
                          >
                            {closingDate.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          {daysRemaining > 0 && (
                            <span
                              className={`text-xs ${isUrgent ? 'text-rdc-red' : 'text-gray-500'}`}
                            >
                              ({t('daysRemaining', { days: daysRemaining })})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Related Projects */}
                    {proc.relatedProjects && proc.relatedProjects.length > 0 && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <p className="mb-2 text-sm text-gray-500">{t('relatedProjects')}</p>
                        <div className="flex flex-wrap gap-2">
                          {proc.relatedProjects.map((project) => (
                            <Link
                              key={project._id}
                              href={`/${locale}/projets/${project.slug}`}
                              className="text-sm text-rdc-blue hover:underline"
                            >
                              {locale === 'fr' ? project.titleFr : project.titleEn}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 lg:w-48">
                    <Link href={`/${locale}/appels-offres/${proc.slug}`}>
                      <Button className="w-full bg-rdc-blue hover:bg-rdc-blue/90">
                        {t('viewDetails')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    {proc.attachments && proc.attachments.length > 0 && (
                      <p className="mt-2 text-center text-xs text-gray-500">
                        {t('documentsAvailable', { count: proc.attachments.length })}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {currentProcurement.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="mb-4 h-16 w-16 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">
              {tab === 'open' ? t('noOpenProcurement') : t('noClosedProcurement')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
