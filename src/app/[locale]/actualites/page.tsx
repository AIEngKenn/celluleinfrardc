import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { newsPaginatedQuery, newsCategoriesListQuery } from '@/lib/sanity/queries';
import type { News, NewsCategory } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { pageWindow, truncateText } from '@/lib/content-cleanup';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });

  return createSeoMetadata({
    locale,
    path: '/actualites',
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ['actualité infrastructures RDC', 'Cellule Infrastructures', 'travaux publics RDC'],
  });
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category, page: pageParam } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'news' });
  const { page, start, end } = pageWindow(pageParam, PAGE_SIZE);

  // Fetch all news and categories
  const [newsResult, categories] = await Promise.all([
    sanityFetch<{ items: News[]; total: number }>({
      query: newsPaginatedQuery,
      params: { category: category || null, start, end },
      tags: ['news'],
    }),
    sanityFetch<NewsCategory[]>({
      query: newsCategoriesListQuery,
      tags: ['newsCategory'],
    }),
  ]);

  const news = newsResult.items;

  return (
    <div>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />
      <div className="ci-container ci-section--sm">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/actualites`}>
              <Badge
                variant={!category ? 'default' : 'outline'}
                className="cursor-pointer transition-colors hover:bg-rdc-blue hover:text-white"
              >
                {t('allCategories')}
              </Badge>
            </Link>
            {categories.map((cat) => (
              <Link key={cat._id} href={`/${locale}/actualites?category=${cat.slug}`}>
                <Badge
                  variant={category === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors hover:bg-rdc-blue hover:text-white"
                >
                  {locale === 'fr' ? cat.nameFr : cat.nameEn}
                  {cat.newsCount !== undefined && (
                    <span className="ml-1.5 opacity-75">({cat.newsCount})</span>
                  )}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">{t('resultsCount', { count: news.length })}</p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => {
            const title = locale === 'fr' ? article.titleFr : article.titleEn;
            const displayTitle = truncateText(title, 105);
            const excerpt = locale === 'fr' ? article.excerptFr : article.excerptEn;

            return (
              // <Link key={article._id} href={`/${locale}/actualites/${article.slug}`}>
              //   <Card className="group h-full overflow-hidden border-t-4 border-t-rdc-blue transition-shadow hover:shadow-lg">
              //     {article.mainImage && (
              //       <div className="aspect-video overflow-hidden bg-gray-200">
              //         <img
              //           src={article.mainImage.asset.url}
              //           alt={article.mainImage.alt || title}
              //           className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              //         />
              //       </div>
              //     )}
              //     {!article.mainImage && (
              //       <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-rdc-blue/10 to-rdc-blue/5 text-rdc-blue">
              //         <Newspaper className="h-12 w-12" />
              //       </div>
              //     )}
              //     <div className="p-6">
              //       <div className="mb-3 flex items-center gap-2">
              //         {article.featured && (
              //           <Badge variant="default" className="bg-rdc-yellow text-gray-900">
              //             {t('featured')}
              //           </Badge>
              //         )}
              //         <Badge variant="outline">
              //           {locale === 'fr' ? article.category.nameFr : article.category.nameEn}
              //         </Badge>
              //       </div>

              //       <h3
              //         className="mb-3 text-xl font-semibold leading-snug text-gray-900 transition-colors group-hover:text-rdc-blue"
              //         title={title}
              //       >
              //         {displayTitle}
              //       </h3>

              //       <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600">{excerpt}</p>

              //       <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              //         <div className="flex items-center gap-2 text-sm text-gray-500">
              //           <Calendar className="h-4 w-4" />
              //           <span>
              //             {new Date(article.publishedAt).toLocaleDateString(
              //               locale === 'fr' ? 'fr-FR' : 'en-US',
              //               {
              //                 year: 'numeric',
              //                 month: 'long',
              //                 day: 'numeric',
              //               }
              //             )}
              //           </span>
              //         </div>
              //         <ArrowRight className="h-5 w-5 text-rdc-blue transition-transform group-hover:translate-x-1" />
              //       </div>
              //     </div>
              //   </Card>
              // </Link>
              <Link
                key={article._id}
                href={`/${locale}/actualites/${article.slug}`}
                className="group block h-full"
              >
                <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-rdc-blue/20 hover:shadow-2xl">
                  {article.mainImage ? (
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={article.mainImage.asset.url}
                        alt={article.mainImage.alt || title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      {article.featured && (
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex rounded-full bg-rdc-yellow px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                            {t('featured')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-rdc-blue/10 to-rdc-blue/5 text-rdc-blue">
                      <Newspaper className="h-12 w-12" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-semibold text-rdc-blue">
                        {locale === 'fr' ? article.category.nameFr : article.category.nameEn}
                      </span>
                    </div>

                    <h3
                      className="mb-3 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue"
                      title={title}
                    >
                      {displayTitle}
                    </h3>

                    <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">{excerpt}</p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4 text-rdc-blue" />
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString(
                            locale === 'fr' ? 'fr-FR' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </div>

                      <ArrowRight className="h-5 w-5 text-rdc-blue transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {news.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <p className="text-lg text-gray-500">{t('noResults')}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={`/${locale}/actualites`}>{t('viewAll')}</Link>
            </Button>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={newsResult.total}
          basePath={`/${locale}/actualites`}
          searchParams={{ category }}
          labels={{ previous: 'Précédent', next: 'Suivant', page: 'Page' }}
        />
      </div>
    </div>
  );
}
