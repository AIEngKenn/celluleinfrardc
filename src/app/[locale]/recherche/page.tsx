import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Search, FolderOpen, Newspaper, FileText, ShoppingCart, ArrowRight } from 'lucide-react';
import { sanityFetch } from '@/lib/sanity/client';
import { fullSearchQuery } from '@/lib/sanity/queries';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { SearchForm } from '@/components/search/search-form';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

interface SearchResults {
  projects: {
    _id: string;
    titleFr: string;
    titleEn: string;
    descriptionFr?: string;
    descriptionEn?: string;
    slug: string;
    status: string;
    sector?: string;
    province?: { nameFr: string; nameEn: string };
    mainImage?: { asset: { url: string }; alt?: string };
  }[];
  news: {
    _id: string;
    titleFr: string;
    titleEn: string;
    excerptFr?: string;
    excerptEn?: string;
    slug: string;
    publishedAt?: string;
    mainImage?: { asset: { url: string }; alt?: string };
  }[];
  procurement: {
    _id: string;
    titleFr: string;
    titleEn: string;
    slug: string;
    reference?: string;
    status: string;
    closingDate?: string;
    category?: string;
  }[];
  publications: {
    _id: string;
    titleFr: string;
    titleEn: string;
    slug: string;
    publicationType?: string;
    publishedAt?: string;
    coverImage?: { asset: { url: string } };
  }[];
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'search' });
  return {
    title: q
      ? `${t('searchFor', { query: q })} - Cellule Infrastructures RDC`
      : `${t('title')} - Cellule Infrastructures RDC`,
  };
}

export default async function RecherchePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'search' });

  let results: SearchResults | null = null;
  let totalCount = 0;

  if (q && q.trim().length > 0) {
    const searchTerm = q.trim() + '*';
    results = await sanityFetch<SearchResults>({
      query: fullSearchQuery,
      params: { searchTerm },
      tags: ['project', 'news', 'procurement', 'publication'],
    });
    totalCount =
      (results?.projects?.length ?? 0) +
      (results?.news?.length ?? 0) +
      (results?.procurement?.length ?? 0) +
      (results?.publications?.length ?? 0);
  }

  const categoryLinks = [
    {
      href: `/${locale}/projets`,
      label: locale === 'fr' ? 'Projets' : 'Projects',
      icon: FolderOpen,
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
    {
      href: `/${locale}/actualites`,
      label: locale === 'fr' ? 'Actualités' : 'News',
      icon: Newspaper,
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
    },
    {
      href: `/${locale}/appels-offres`,
      label: locale === 'fr' ? "Appels d'Offres" : 'Procurement',
      icon: ShoppingCart,
      color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
    },
    {
      href: `/${locale}/publications`,
      label: locale === 'fr' ? 'Publications' : 'Publications',
      icon: FileText,
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('results')}
        subtitle={q ? t('resultCount', { count: totalCount }) : t('enterQuery')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />

      <div className="ci-container ci-section--sm">
        {/* Search form */}
        <div className="mb-10">
          <SearchForm defaultValue={q ?? ''} locale={locale} placeholder={t('placeholder')} />
        </div>

        {/* No query state */}
        {!q && (
          <div className="py-8 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="mb-2 text-xl font-semibold text-gray-700">{t('enterQuery')}</p>
            <p className="mb-8 text-gray-500">{t('enterQueryDescription')}</p>

            <div className="mx-auto grid max-w-xl grid-cols-2 gap-4 md:grid-cols-4">
              {categoryLinks.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-colors ${cat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* No results state */}
        {q && results && totalCount === 0 && (
          <div className="py-8 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="mb-2 text-xl font-semibold text-gray-700">
              {t('noResults', { query: q })}
            </p>
            <p className="mb-8 text-gray-500">{t('noResultsDescription')}</p>

            <div className="mx-auto grid max-w-xl grid-cols-2 gap-4 md:grid-cols-4">
              {categoryLinks.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-colors ${cat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {q && results && totalCount > 0 && (
          <div className="space-y-12">
            {/* Projects */}
            {results.projects.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <FolderOpen className="h-5 w-5 text-rdc-blue" />
                    {t('categories.projects')}
                    <Badge variant="secondary">{results.projects.length}</Badge>
                  </h2>
                  <Link
                    href={`/${locale}/projets`}
                    className="flex items-center gap-1 text-sm text-rdc-blue hover:underline"
                  >
                    {locale === 'fr' ? 'Voir tous' : 'View all'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                  {results.projects.map((item) => (
                    <Link
                      key={item._id}
                      href={`/${locale}/projets/${item.slug}`}
                      className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
                    >
                      {item.mainImage && (
                        <img
                          src={item.mainImage.asset.url}
                          alt={item.mainImage.alt || ''}
                          className="h-16 w-24 flex-shrink-0 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-semibold text-gray-900">
                          {locale === 'fr' ? item.titleFr : item.titleEn}
                        </p>
                        {(locale === 'fr' ? item.descriptionFr : item.descriptionEn) && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {locale === 'fr' ? item.descriptionFr : item.descriptionEn}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                          {item.province && (
                            <span className="text-xs text-gray-400">
                              {locale === 'fr' ? item.province.nameFr : item.province.nameEn}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* News */}
            {results.news.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <Newspaper className="h-5 w-5 text-rdc-blue" />
                    {t('categories.news')}
                    <Badge variant="secondary">{results.news.length}</Badge>
                  </h2>
                  <Link
                    href={`/${locale}/actualites`}
                    className="flex items-center gap-1 text-sm text-rdc-blue hover:underline"
                  >
                    {locale === 'fr' ? 'Voir tous' : 'View all'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                  {results.news.map((item) => (
                    <Link
                      key={item._id}
                      href={`/${locale}/actualites/${item.slug}`}
                      className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
                    >
                      {item.mainImage && (
                        <img
                          src={item.mainImage.asset.url}
                          alt={item.mainImage.alt || ''}
                          className="h-16 w-24 flex-shrink-0 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-semibold text-gray-900">
                          {locale === 'fr' ? item.titleFr : item.titleEn}
                        </p>
                        {(locale === 'fr' ? item.excerptFr : item.excerptEn) && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {locale === 'fr' ? item.excerptFr : item.excerptEn}
                          </p>
                        )}
                        {item.publishedAt && (
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(item.publishedAt).toLocaleDateString(
                              locale === 'fr' ? 'fr-FR' : 'en-US'
                            )}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Procurement */}
            {results.procurement.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <ShoppingCart className="h-5 w-5 text-rdc-blue" />
                    {t('categories.procurement')}
                    <Badge variant="secondary">{results.procurement.length}</Badge>
                  </h2>
                  <Link
                    href={`/${locale}/appels-offres`}
                    className="flex items-center gap-1 text-sm text-rdc-blue hover:underline"
                  >
                    {locale === 'fr' ? 'Voir tous' : 'View all'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                  {results.procurement.map((item) => (
                    <Link
                      key={item._id}
                      href={`/${locale}/appels-offres/${item.slug}`}
                      className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-semibold text-gray-900">
                          {locale === 'fr' ? item.titleFr : item.titleEn}
                        </p>
                        {item.reference && (
                          <p className="mt-1 font-mono text-xs text-gray-500">
                            Réf: {item.reference}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant={item.status === 'open' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                          {item.closingDate && (
                            <span className="text-xs text-gray-400">
                              {locale === 'fr' ? 'Clôture:' : 'Closing:'}{' '}
                              {new Date(item.closingDate).toLocaleDateString(
                                locale === 'fr' ? 'fr-FR' : 'en-US'
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Publications */}
            {results.publications.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <FileText className="h-5 w-5 text-rdc-blue" />
                    {t('categories.publications')}
                    <Badge variant="secondary">{results.publications.length}</Badge>
                  </h2>
                  <Link
                    href={`/${locale}/publications`}
                    className="flex items-center gap-1 text-sm text-rdc-blue hover:underline"
                  >
                    {locale === 'fr' ? 'Voir tous' : 'View all'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                  {results.publications.map((item) => (
                    <Link
                      key={item._id}
                      href={`/${locale}/publications/${item.slug}`}
                      className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
                    >
                      {item.coverImage && (
                        <img
                          src={item.coverImage.asset.url}
                          alt=""
                          className="h-16 w-12 flex-shrink-0 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-semibold text-gray-900">
                          {locale === 'fr' ? item.titleFr : item.titleEn}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          {item.publicationType && (
                            <Badge variant="outline" className="text-xs">
                              {item.publicationType}
                            </Badge>
                          )}
                          {item.publishedAt && (
                            <span className="text-xs text-gray-400">
                              {new Date(item.publishedAt).toLocaleDateString(
                                locale === 'fr' ? 'fr-FR' : 'en-US'
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
