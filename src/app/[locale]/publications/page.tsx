import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { publicationsListQuery } from '@/lib/sanity/queries';
import type { Publication } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Download, Eye } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'publications' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function PublicationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { type } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'publications' });

  // Fetch all publications
  const allPublications = await sanityFetch<Publication[]>({
    query: publicationsListQuery,
    tags: ['publication'],
  });

  // Filter by type if specified
  const publications = type
    ? allPublications.filter((pub) => pub.publicationType === type)
    : allPublications;

  const publicationTypes = [
    'annual-report',
    'technical-report',
    'feasibility-study',
    'environmental-study',
    'law-decree',
    'guide',
    'newsletter',
    'brochure',
    'other',
  ];

  return (
    <div>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />
      <div className="ci-container ci-section--sm">
        {/* Type Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/publications`}>
              <Badge
                variant={!type ? 'default' : 'outline'}
                className="cursor-pointer transition-colors hover:bg-rdc-blue hover:text-white"
              >
                {t('allTypes')}
              </Badge>
            </Link>
            {publicationTypes.map((pubType) => {
              const count = allPublications.filter((p) => p.publicationType === pubType).length;
              if (count === 0) return null;

              return (
                <Link key={pubType} href={`/${locale}/publications?type=${pubType}`}>
                  <Badge
                    variant={type === pubType ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors hover:bg-rdc-blue hover:text-white"
                  >
                    {t(`types.${pubType}`)}
                    <span className="ml-1.5 opacity-75">({count})</span>
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">{t('resultsCount', { count: publications.length })}</p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publications.map((publication) => {
            const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
            const description =
              locale === 'fr' ? publication.descriptionFr : publication.descriptionEn;

            return (
              <Card
                key={publication._id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                {/* Cover Image */}
                {publication.coverImage && (
                  <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                    <img
                      src={publication.coverImage.asset.url}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="outline">{t(`types.${publication.publicationType}`)}</Badge>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">{title}</h3>

                  <p className="mb-4 line-clamp-3 text-sm text-gray-600">{description}</p>

                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(publication.publishedAt).toLocaleDateString(
                        locale === 'fr' ? 'fr-FR' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/publications/${publication.slug}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-rdc-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rdc-blue/90"
                    >
                      <Eye className="h-4 w-4" />
                      {t('view')}
                    </Link>
                    <a
                      href={publication.pdfFile.asset.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>

                  {publication.pdfFile.asset.size && (
                    <p className="mt-2 text-center text-xs text-gray-500">
                      PDF - {(publication.pdfFile.asset.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {publications.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <FileText className="mb-4 h-16 w-16 text-gray-400" />
            <p className="text-lg text-gray-500">{t('noResults')}</p>
            <Link
              href={`/${locale}/publications`}
              className="mt-4 inline-block text-rdc-blue hover:underline"
            >
              {t('viewAll')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
