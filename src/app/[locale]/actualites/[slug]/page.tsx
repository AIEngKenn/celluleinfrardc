import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { moreNewsQuery, newsBySlugQuery } from '@/lib/sanity/queries';
import type { News } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowLeft, Tag, Newspaper, ArrowRight } from 'lucide-react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { SharePanel } from '@/components/share/share-panel';
import { NewsCard } from '@/components/news/news-card';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const articleComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold text-slate-900">{children}</h2>
    ),
    h2: ({ children }) => (
      <h3 className="mb-3 mt-8 text-xl font-bold text-slate-900">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="mb-2 mt-6 text-lg font-semibold text-slate-900">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-5 leading-7 text-slate-700">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 ml-5 list-disc text-slate-700">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 ml-5 list-decimal text-slate-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
};

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'news' });

  const [article, moreNews] = await Promise.all([
    sanityFetch<News>({
      query: newsBySlugQuery,
      params: { slug },
      tags: [`news:${slug}`],
    }),
    sanityFetch<News[]>({
      query: moreNewsQuery,
      params: { slug },
      tags: ['news'],
    }),
  ]);

  if (!article) notFound();

  const isFr = locale === 'fr';

  const title = isFr ? article.titleFr : article.titleEn;
  const excerpt = isFr ? article.excerptFr : article.excerptEn;
  const content = isFr ? article.contentFr : article.contentEn;

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <header className="relative border-b border-slate-200 bg-white">
        {article.mainImage ? (
          <div className="relative h-[32rem] overflow-hidden bg-slate-900">
            <img
              src={article.mainImage.asset.url}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-10">
              <ArticleHeader
                locale={locale}
                title={title}
                category={isFr ? article.category.nameFr : article.category.nameEn}
                categorySlug={article.category.slug}
                date={formattedDate}
                featured={article.featured}
                featuredLabel={t('featured')}
                backLabel={t('backToNews')}
                inverse
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl px-6 py-12">
            <ArticleHeader
              locale={locale}
              title={title}
              category={isFr ? article.category.nameFr : article.category.nameEn}
              categorySlug={article.category.slug}
              date={formattedDate}
              featured={article.featured}
              featuredLabel={t('featured')}
              backLabel={t('backToNews')}
            />
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_20rem]">
        {/* ARTICLE */}
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* {excerpt && (
            <p className="mb-10 border-l-4 border-rdc-blue bg-rdc-blue/5 px-6 py-5 text-lg font-medium leading-relaxed text-slate-800">
              {excerpt}
            </p>
          )} */}

          <div className="prose prose-slate max-w-none">
            {content && <PortableText value={content} components={articleComponents} />}
          </div>
        </article>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <SharePanel
              title={title}
              description={excerpt}
              path={`/${locale}/actualites/${article.slug}`}
              locale={locale}
            />

            <Card className="rounded-2xl border border-slate-200 p-5">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                {locale === 'fr' ? 'Informations' : 'Information'}
              </h2>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Date</dt>
                  <dd className="mt-1 flex items-center gap-2 font-medium text-slate-900">
                    <Calendar className="h-4 w-4 text-rdc-blue" />
                    {formattedDate}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Category</dt>
                  <dd className="mt-1">
                    <Link
                      href={`/${locale}/actualites?category=${article.category.slug}`}
                      className="inline-flex items-center gap-2 font-medium text-rdc-blue hover:underline"
                    >
                      <Tag className="h-4 w-4" />
                      {isFr ? article.category.nameFr : article.category.nameEn}
                    </Link>
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </aside>

        {/* MORE NEWS */}
        {moreNews.length > 0 && (
          <section className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {isFr ? 'À lire aussi' : 'More news'}
              </h2>

              <Link
                href={`/${locale}/actualites`}
                className="flex items-center gap-1 text-sm font-semibold text-rdc-blue"
              >
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moreNews.map((item) => (
                <NewsCard
                  key={item._id}
                  article={item}
                  locale={locale}
                  featuredLabel={t('featured')}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* HEADER */
function ArticleHeader({
  locale,
  title,
  category,
  categorySlug,
  date,
  featured,
  featuredLabel,
  backLabel,
  inverse = false,
}: any) {
  return (
    <>
      <Link
        href={`/${locale}/actualites`}
        className={`mb-6 inline-flex items-center gap-2 text-sm font-medium ${
          inverse ? 'text-white/90 hover:text-white' : 'text-rdc-blue hover:underline'
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-semibold text-rdc-blue">
          <Newspaper className="mr-1.5 h-3.5 w-3.5" />
          {category}
        </span>

        {featured && (
          <span className="rounded-full bg-rdc-yellow px-3 py-1 text-xs font-semibold text-slate-900">
            {featuredLabel}
          </span>
        )}
      </div>

      <h1
        className={`max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl ${
          inverse ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h1>

      <div
        className={`mt-5 flex items-center gap-2 text-sm ${
          inverse ? 'text-white/80' : 'text-slate-600'
        }`}
      >
        <Calendar className="h-4 w-4" />
        <time>{date}</time>
      </div>
    </>
  );
}
