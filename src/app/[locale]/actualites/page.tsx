import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { newsListQuery, newsCategoriesListQuery } from '@/lib/sanity/queries';
import type { News, NewsCategory } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { sanityImageUrl } from '@/lib/placeholder-images';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'news' });

  // Fetch all news and categories
  const [allNews, categories] = await Promise.all([
    sanityFetch<News[]>({
      query: newsListQuery,
      tags: ['news'],
    }),
    sanityFetch<NewsCategory[]>({
      query: newsCategoriesListQuery,
      tags: ['newsCategory'],
    }),
  ]);

  // Filter by category if specified
  const news = category ? allNews.filter((n) => n.category.slug === category) : allNews;

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
            const excerpt = locale === 'fr' ? article.excerptFr : article.excerptEn;

            return (
              <Link key={article._id} href={`/${locale}/actualites/${article.slug}`}>
                <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="aspect-video overflow-hidden bg-gray-200">
                    <img
                      src={sanityImageUrl(article.mainImage)}
                      alt={article.mainImage?.alt || title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      {article.featured && (
                        <Badge variant="default" className="bg-rdc-yellow text-gray-900">
                          {t('featured')}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {locale === 'fr' ? article.category.nameFr : article.category.nameEn}
                      </Badge>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-rdc-blue">
                      {title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-gray-600">{excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
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
                      <ArrowRight className="h-5 w-5 text-rdc-blue transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
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
      </div>
    </div>
  );
}
