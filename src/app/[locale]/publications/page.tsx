import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { publicationsListQuery, publicationsPaginatedQuery } from '@/lib/sanity/queries';
import type { Publication } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Download, Eye, FileWarning, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { cleanMigratedText, pageWindow, truncateText } from '@/lib/content-cleanup';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; page?: string }>;
}

const PAGE_SIZE = 12;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'publications' });

  return createSeoMetadata({
    locale,
    path: '/publications',
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ['publications infrastructures RDC', 'rapports', 'documents projets RDC'],
  });
}

export default async function PublicationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { type, page: pageParam } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'publications' });
  const { page, start, end } = pageWindow(pageParam, PAGE_SIZE);

  // Fetch all publications
  const [allPublications, publicationResult] = await Promise.all([
    sanityFetch<Publication[]>({
      query: publicationsListQuery,
      tags: ['publication'],
    }),
    sanityFetch<{ items: Publication[]; total: number }>({
      query: publicationsPaginatedQuery,
      params: { type: type || null, start, end },
      tags: ['publication'],
    }),
  ]);

  // Filter by type if specified
  const publications = publicationResult.items;

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
    });

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
          <p className="text-left text-gray-600">
            {t('resultsCount', { count: publicationResult.total })}
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {publications.map((publication) => {
            const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
            const displayTitle = truncateText(title, 115);
            const description = cleanMigratedText(
              locale === 'fr' ? publication.descriptionFr : publication.descriptionEn
            );
            const pdfAsset = publication.pdfFile?.asset;
            const fileSize = pdfAsset?.size
              ? `${(pdfAsset.size / 1024 / 1024).toFixed(2)} MB`
              : null;

            // return (
            //   <Card
            //     key={publication._id}
            //     className="group flex h-full overflow-hidden border-l-4 border-l-rdc-blue transition-shadow hover:shadow-lg"
            //   >
            //     <div className="flex w-28 flex-shrink-0 items-center justify-center bg-rdc-blue/5 md:w-36">
            //       {publication.coverImage ? (
            //         <img
            //           src={publication.coverImage.asset.url}
            //           alt={title}
            //           className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            //         />
            //       ) : (
            //         <div className="flex h-full min-h-48 w-full flex-col items-center justify-center px-4 text-center text-rdc-blue">
            //           <FileText className="mb-2 h-10 w-10" />
            //           <span className="text-xs font-semibold uppercase tracking-wide">PDF</span>
            //         </div>
            //       )}
            //     </div>

            //     <div className="flex min-w-0 flex-1 flex-col p-5">
            //       <div className="mb-3 flex flex-wrap items-center gap-2">
            //         <Badge variant="outline">{t(`types.${publication.publicationType}`)}</Badge>
            //         <span
            //           className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            //             pdfAsset
            //               ? 'bg-green-50 text-green-700'
            //               : 'bg-amber-50 text-amber-700'
            //           }`}
            //         >
            //           {pdfAsset ? (
            //             <>
            //               <FileText className="h-3.5 w-3.5" />
            //               PDF
            //             </>
            //           ) : (
            //             <>
            //               <FileWarning className="h-3.5 w-3.5" />
            //               {locale === 'fr' ? 'Fichier manquant' : 'Missing file'}
            //             </>
            //           )}
            //         </span>
            //       </div>

            //       <h3
            //         className="mb-2 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-rdc-blue"
            //         title={title}
            //       >
            //         {displayTitle}
            //       </h3>

            //       <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">{description}</p>

            //       <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            //         <Calendar className="h-4 w-4" />
            //         <span>{formatDate(publication.publishedAt)}</span>
            //         {fileSize && <span className="text-gray-300">|</span>}
            //         {fileSize && <span>{fileSize}</span>}
            //       </div>

            //       <div className="mt-auto flex gap-2">
            //         <Link
            //           href={`/${locale}/publications/${publication.slug}`}
            //           className="flex flex-1 items-center justify-center gap-2 rounded-md bg-rdc-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rdc-blue/90"
            //         >
            //           <Eye className="h-4 w-4" />
            //           {t('view')}
            //         </Link>
            //         {pdfAsset && (
            //           <a
            //             href={pdfAsset.url}
            //             download
            //             target="_blank"
            //             rel="noopener noreferrer"
            //             className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            //             aria-label={t('download')}
            //           >
            //             <Download className="h-4 w-4" />
            //           </a>
            //         )}
            //       </div>
            //     </div>
            //   </Card>
            // );

            return (
              <Link
                key={publication._id}
                href={`/${locale}/publications/${publication.slug}`}
                className="group block h-full"
              >
                <article className="flex h-auto flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#CE1021]/20 hover:shadow-2xl">
                  <div className="relative aspect-[16/10] h-1/3 overflow-hidden bg-slate-100">
                    {publication.coverImage ? (
                      <>
                        <img
                          src={publication.coverImage.asset.url}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50">
                        <FileText className="h-16 w-16 text-slate-300" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-md bg-[#CE1021] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                        PDF
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4">
                      <span className="inline-flex items-center rounded-full bg-[#CE1021]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#CE1021]">
                        {t(`types.${publication.publicationType}`)}
                      </span>
                    </div>

                    <h3
                      title={title}
                      className="mb-3 line-clamp-2 text-xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-[#CE1021]"
                    >
                      {displayTitle}
                    </h3>

                    <p className="mb-6 line-clamp-3 text-sm leading-7 text-slate-600">
                      {description}
                    </p>

                    <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(publication.publishedAt)}</span>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          {fileSize && <span className="font-medium">{fileSize}</span>}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-[#CE1021] transition-all duration-300 group-hover:gap-3">
                          <span>{t('view')}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
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

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={publicationResult.total}
          basePath={`/${locale}/publications`}
          searchParams={{ type }}
          labels={{ previous: 'Précédent', next: 'Suivant', page: 'Page' }}
        />
      </div>
    </div>
  );
}
