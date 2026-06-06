import { notFound } from 'next/navigation';
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

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const procurement = await sanityFetch<Procurement>({
    query: procurementBySlugQuery,
    params: { slug },
    tags: [`procurement:${slug}`],
  });

  if (!procurement) return {};

  const title = locale === 'fr' ? procurement.titleFr : procurement.titleEn;
  const description = locale === 'fr' ? procurement.descriptionFr : procurement.descriptionEn;

  return {
    title: `${procurement.reference} - ${title}`,
    description,
  };
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
  const description = locale === 'fr' ? procurement.descriptionFr : procurement.descriptionEn;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/${locale}/appels-offres${isClosed ? '?tab=closed' : '?tab=open'}`}
            className="mb-4 inline-flex items-center gap-2 text-rdc-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToProcurement')}
          </Link>

          <div className="mb-4 flex items-start gap-3">
            <Badge variant={isClosed ? 'secondary' : 'default'} className="mt-1">
              {t(`categories.${procurement.category}`)}
            </Badge>
            {isUrgent && !isClosed && (
              <Badge variant="destructive" className="mt-1 bg-rdc-red">
                {t('urgent')}
              </Badge>
            )}
            {isClosed && (
              <Badge variant="outline" className="mt-1">
                {t('closed')}
              </Badge>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>
          <p className="font-mono text-lg text-gray-600">
            {t('reference')}: {procurement.reference}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Urgent Alert */}
        {isUrgent && !isClosed && (
          <div className="mb-8 rounded-lg border border-rdc-red/30 bg-rdc-red/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-6 w-6 text-rdc-red" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t('urgentDeadline')}</h3>
                <p className="mt-1 text-gray-700">
                  {t('urgentDeadlineDescription', { days: daysRemaining })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('description')}</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{description}</p>
              </div>
            </Card>

            {/* Documents */}
            {attachments.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('tenderDocuments')}</h2>
                <div className="space-y-3">
                  {attachments.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.file.asset?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-rdc-blue" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {locale === 'fr' ? doc.titleFr : doc.titleEn}
                          </p>
                          {doc.file.asset?.size && (
                            <p className="text-sm text-gray-500">
                              {(doc.file.asset.size / 1024 / 1024).toFixed(2)} MB - PDF
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Related Projects */}
            {procurement.relatedProjects && procurement.relatedProjects.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('relatedProjects')}</h2>
                <div className="space-y-3">
                  {procurement.relatedProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/${locale}/projets/${project.slug}`}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      {project.mainImage && (
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={project.mainImage.asset.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {locale === 'fr' ? project.titleFr : project.titleEn}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SharePanel
              title={title}
              description={description}
              path={`/${locale}/appels-offres/${procurement.slug}`}
              locale={locale}
            />
            {/* Timeline */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">{t('timeline')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">{t('openingDate')}</p>
                    <p className="font-medium text-gray-900">
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
                    <p className="text-sm text-gray-500">{t('closingDate')}</p>
                    <p className={`font-medium ${isUrgent ? 'text-rdc-red' : 'text-gray-900'}`}>
                      {closingDate.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {!isClosed && daysRemaining > 0 && (
                      <p
                        className={`mt-1 text-sm ${isUrgent ? 'font-semibold text-rdc-red' : 'text-gray-600'}`}
                      >
                        {t('daysRemaining', { days: daysRemaining })}
                      </p>
                    )}
                    {isClosed && (
                      <p className="mt-1 text-sm text-gray-500">{t('opportunityClosed')}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Budget */}
            {procurement.budget && (
              <Card className="p-6">
                <h3 className="mb-2 text-lg font-bold text-gray-900">{t('estimatedBudget')}</h3>
                <p className="text-3xl font-bold text-rdc-blue">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(procurement.budget)}
                </p>
              </Card>
            )}

            {/* Contact Info */}
            <Card className="border-rdc-blue/20 bg-rdc-blue/5 p-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900">{t('needHelp')}</h3>
              <p className="mb-4 text-sm text-gray-600">{t('needHelpDescription')}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${locale}/contact`}>{t('contactUs')}</Link>
              </Button>
            </Card>
          </div>
        </div>

        {moreProcurement.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? "D'autres appels d'offres" : 'More opportunities'}
              </h2>
              <Link href={`/${locale}/appels-offres`} className="text-sm font-semibold text-rdc-blue">
                {t('viewAll')}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {moreProcurement.map((item) => {
                const itemTitle = locale === 'fr' ? item.titleFr : item.titleEn;
                const docs = item.attachments?.filter((doc) => doc.file?.asset?.url).length ?? 0;
                return (
                  <Link
                    key={item._id}
                    href={`/${locale}/appels-offres/${item.slug}`}
                    className="group"
                  >
                    <Card className="h-full border-l-4 border-l-rdc-yellow p-5 transition-shadow hover:shadow-lg">
                      <p className="mb-2 font-mono text-xs text-gray-500">{item.reference}</p>
                      <h3 className="line-clamp-3 font-semibold leading-snug text-gray-900 group-hover:text-rdc-blue">
                        {itemTitle}
                      </h3>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {new Date(item.closingDate).toLocaleDateString(
                            locale === 'fr' ? 'fr-FR' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </span>
                        <span>{docs} doc.</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
