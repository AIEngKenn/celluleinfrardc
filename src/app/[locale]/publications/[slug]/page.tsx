import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { publicationBySlugQuery } from '@/lib/sanity/queries';
import type { Publication } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Download, ArrowLeft } from 'lucide-react';
import { sanityImageUrl } from '@/lib/placeholder-images';

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
  const description = locale === 'fr' ? publication.descriptionFr : publication.descriptionEn;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [sanityImageUrl(publication.coverImage)],
    },
  };
}

export default async function PublicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'publications' });

  const publication = await sanityFetch<Publication>({
    query: publicationBySlugQuery,
    params: { slug },
    tags: [`publication:${slug}`],
  });

  if (!publication) {
    notFound();
  }

  const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
  const description = locale === 'fr' ? publication.descriptionFr : publication.descriptionEn;

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
            <span>
              {new Date(publication.publishedAt).toLocaleDateString(
                locale === 'fr' ? 'fr-FR' : 'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </span>
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
                <a
                  href={publication.pdfFile.asset.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-rdc-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rdc-blue/90"
                >
                  <Download className="h-4 w-4" />
                  {t('download')}
                </a>
              </div>

              {/* Embedded PDF Viewer */}
              <div className="aspect-[8.5/11] overflow-hidden rounded-lg bg-gray-200">
                <iframe
                  src={`${publication.pdfFile.asset.url}#toolbar=1&view=FitH`}
                  className="h-full w-full"
                  title={title}
                />
              </div>

              {publication.pdfFile.asset.size && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  PDF - {(publication.pdfFile.asset.size / 1024 / 1024).toFixed(2)} MB -{' '}
                  {publication.pdfFile.asset.originalFilename}
                </p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card className="overflow-hidden">
              <img src={sanityImageUrl(publication.coverImage)} alt={title} className="h-auto w-full" />
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">{t('quickActions')}</h3>
              <div className="space-y-3">
                <a
                  href={publication.pdfFile.asset.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="font-medium text-gray-900">{t('downloadPDF')}</p>
                    {publication.pdfFile.asset.size && (
                      <p className="text-xs text-gray-500">
                        {(publication.pdfFile.asset.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </a>

                <a
                  href={publication.pdfFile.asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                >
                  <FileText className="h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="font-medium text-gray-900">{t('openInNewTab')}</p>
                  </div>
                </a>
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

                {publication.pdfFile.asset.originalFilename && (
                  <div>
                    <p className="text-gray-500">{t('filename')}</p>
                    <p className="break-all font-medium text-gray-900">
                      {publication.pdfFile.asset.originalFilename}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
