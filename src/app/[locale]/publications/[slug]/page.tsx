import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { morePublicationsQuery, publicationBySlugQuery } from '@/lib/sanity/queries';
import type { Publication } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Download, ArrowLeft, FileWarning } from 'lucide-react';
import { SharePanel } from '@/components/share/share-panel';
import { cleanMigratedText } from '@/lib/content-cleanup';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const publication = await sanityFetch<Publication>({
    query: publicationBySlugQuery,
    params: { slug },
    tags: [`publication:${slug}`],
  });

  if (!publication) return {};

  const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
  const description = cleanMigratedText(
    locale === 'fr' ? publication.descriptionFr : publication.descriptionEn
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: publication.coverImage ? [publication.coverImage.asset.url] : [],
    },
  };
}

export default async function PublicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'publications' });

  const [publication, morePublications] = await Promise.all([
    sanityFetch<Publication>({
      query: publicationBySlugQuery,
      params: { slug },
      tags: [`publication:${slug}`],
    }),
    sanityFetch<Publication[]>({
      query: morePublicationsQuery,
      params: { slug },
      tags: ['publication'],
    }),
  ]);

  if (!publication) {
    notFound();
  }

  const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
  const description = locale === 'fr' ? publication.descriptionFr : publication.descriptionEn;
  const pdfAsset = publication.pdfFile?.asset;
  const formattedDate = new Date(publication.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/${locale}/publications`}
            className="mb-4 inline-flex items-center gap-2 text-rdc-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToPublications')}
          </Link>

          <div className="mb-4 flex items-center gap-2">
            <Badge variant="default">{t(`types.${publication.publicationType}`)}</Badge>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8 p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('about')}</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{description}</p>
              </div>
            </Card>

            {/* PDF Viewer */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{t('document')}</h2>
                {pdfAsset && (
                  <a
                    href={pdfAsset.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md bg-rdc-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rdc-blue/90"
                  >
                    <Download className="h-4 w-4" />
                    {t('download')}
                  </a>
                )}
              </div>

              {/* Embedded PDF Viewer */}
              {pdfAsset ? (
                <div className="aspect-[8.5/11] overflow-hidden rounded-lg bg-gray-200">
                  <iframe
                    src={`${pdfAsset.url}#toolbar=1&view=FitH`}
                    className="h-full w-full"
                    title={title}
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-8 text-center">
                  <FileWarning className="mx-auto mb-3 h-10 w-10 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">
                    {locale === 'fr' ? 'Document non disponible' : 'Document unavailable'}
                  </h3>
                  <p className="mt-2 text-sm text-amber-800">
                    {locale === 'fr'
                      ? "Le fichier source n'était pas présent dans la copie HTTrack importée."
                      : 'The source file was not present in the imported HTTrack copy.'}
                  </p>
                </div>
              )}

              {pdfAsset?.size && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  PDF - {(pdfAsset.size / 1024 / 1024).toFixed(2)} MB
                  {pdfAsset.originalFilename ? ` - ${pdfAsset.originalFilename}` : ''}
                </p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SharePanel
              title={title}
              description={description}
              path={`/${locale}/publications/${publication.slug}`}
              locale={locale}
            />
            {/* Cover Image */}
            {publication.coverImage && (
              <Card className="overflow-hidden">
                <img src={publication.coverImage.asset.url} alt={title} className="h-auto w-full" />
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">{t('quickActions')}</h3>
              <div className="space-y-3">
                {pdfAsset ? (
                  <>
                    <a
                      href={pdfAsset.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <Download className="h-5 w-5 text-rdc-blue" />
                      <div>
                        <p className="font-medium text-gray-900">{t('downloadPDF')}</p>
                        {pdfAsset.size && (
                          <p className="text-xs text-gray-500">
                            {(pdfAsset.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </a>

                    <a
                      href={pdfAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <FileText className="h-5 w-5 text-rdc-blue" />
                      <div>
                        <p className="font-medium text-gray-900">{t('openInNewTab')}</p>
                      </div>
                    </a>
                  </>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <FileWarning className="h-5 w-5 text-amber-600" />
                    <p className="text-sm font-medium text-amber-900">
                      {locale === 'fr' ? 'Aucun fichier attaché' : 'No file attached'}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Info */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">{t('information')}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">{t('type')}</p>
                  <p className="font-medium text-gray-900">
                    {t(`types.${publication.publicationType}`)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">{t('publishedDate')}</p>
                  <p className="font-medium text-gray-900">
                    {new Date(publication.publishedAt).toLocaleDateString(
                      locale === 'fr' ? 'fr-FR' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>

                {pdfAsset?.originalFilename && (
                  <div>
                    <p className="text-gray-500">{t('filename')}</p>
                    <p className="break-all font-medium text-gray-900">
                      {pdfAsset.originalFilename}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {morePublications.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? 'Autres publications' : 'More publications'}
              </h2>
              <Link href={`/${locale}/publications`} className="text-sm font-semibold text-rdc-blue">
                {t('viewAll')}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {morePublications.map((item) => {
                const itemTitle = locale === 'fr' ? item.titleFr : item.titleEn;
                const hasFile = Boolean(item.pdfFile?.asset?.url);
                return (
                  <Link key={item._id} href={`/${locale}/publications/${item.slug}`} className="group">
                    <Card className="h-full border-l-4 border-l-rdc-blue p-5 transition-shadow hover:shadow-lg">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <Badge variant="outline">{t(`types.${item.publicationType}`)}</Badge>
                        {hasFile ? (
                          <FileText className="h-5 w-5 text-rdc-blue" />
                        ) : (
                          <FileWarning className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <h3 className="line-clamp-3 font-semibold leading-snug text-gray-900 group-hover:text-rdc-blue">
                        {itemTitle}
                      </h3>
                      <p className="mt-3 text-sm text-gray-500">
                        {new Date(item.publishedAt).toLocaleDateString(
                          locale === 'fr' ? 'fr-FR' : 'en-US',
                          { year: 'numeric', month: 'long' }
                        )}
                      </p>
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
