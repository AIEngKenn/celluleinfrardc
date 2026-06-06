import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { moreNewsQuery, newsBySlugQuery } from '@/lib/sanity/queries';
import type { News } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowLeft, Tag, Newspaper } from 'lucide-react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { SharePanel } from '@/components/share/share-panel';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const articleComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = await sanityFetch<News>({
    query: newsBySlugQuery,
    params: { slug },
    tags: [`news:${slug}`],
  });

  if (!article) return {};

  const title = locale === 'fr' ? article.titleFr : article.titleEn;
  const excerpt = locale === 'fr' ? article.excerptFr : article.excerptEn;

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      images: article.mainImage ? [article.mainImage.asset.url] : [],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

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

  if (!article) {
    notFound();
  }

  const title = locale === 'fr' ? article.titleFr : article.titleEn;
  const excerpt = locale === 'fr' ? article.excerptFr : article.excerptEn;
  const content = locale === 'fr' ? article.contentFr : article.contentEn;
  const firstBlock = content?.[0] as { children?: { text?: string }[] } | undefined;
  const firstContentText = firstBlock?.children?.map((child) => child.text ?? '').join(' ') ?? '';
  const shouldShowExcerpt =
    Boolean(excerpt) && !firstContentText.startsWith(excerpt.slice(0, 80));
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        {article.mainImage ? (
          <div className="relative min-h-[28rem] bg-gray-900">
          <img
            src={article.mainImage.asset.url}
            alt={article.mainImage.alt || title}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
            <div className="relative mx-auto flex min-h-[28rem] max-w-5xl flex-col justify-end px-4 py-10">
              <ArticleHeaderContent
                locale={locale}
                title={title}
                category={locale === 'fr' ? article.category.nameFr : article.category.nameEn}
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
          <div className="mx-auto max-w-5xl px-4 py-10">
            <ArticleHeaderContent
              locale={locale}
              title={title}
              category={locale === 'fr' ? article.category.nameFr : article.category.nameEn}
              categorySlug={article.category.slug}
              date={formattedDate}
              featured={article.featured}
              featuredLabel={t('featured')}
              backLabel={t('backToNews')}
            />
          </div>
        )}
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
          {shouldShowExcerpt && (
            <p className="mb-8 border-l-4 border-rdc-blue bg-rdc-blue/5 px-5 py-4 text-xl font-medium leading-relaxed text-gray-800">
              {excerpt}
            </p>
          )}

          <div className="ci-article-body">
            {content && <PortableText value={content} components={articleComponents} />}
          </div>
        </article>

        <aside className="space-y-4">
          <SharePanel
            title={title}
            description={excerpt}
            path={`/${locale}/actualites/${article.slug}`}
            locale={locale}
          />
          <Card className="p-5">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              {locale === 'fr' ? "Détails de l'article" : 'Article details'}
            </h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">{locale === 'fr' ? 'Date' : 'Date'}</dt>
                <dd className="mt-1 flex items-center gap-2 font-medium text-gray-900">
                  <Calendar className="h-4 w-4 text-rdc-blue" />
                  {formattedDate}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{locale === 'fr' ? 'Catégorie' : 'Category'}</dt>
                <dd className="mt-1">
                  <Link
                    href={`/${locale}/actualites?category=${article.category.slug}`}
                    className="inline-flex items-center gap-2 text-rdc-blue hover:underline"
                  >
                    <Tag className="h-4 w-4" />
                    {locale === 'fr' ? article.category.nameFr : article.category.nameEn}
                  </Link>
                </dd>
              </div>
            </dl>
          </Card>
        </aside>

        {moreNews.length > 0 && (
          <section className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? 'À lire aussi' : 'Keep reading'}
              </h2>
              <Link href={`/${locale}/actualites`} className="text-sm font-semibold text-rdc-blue">
                {t('viewAll')}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {moreNews.map((item) => (
                <Link key={item._id} href={`/${locale}/actualites/${item.slug}`} className="group">
                  <Card className="h-full overflow-hidden border-t-4 border-t-rdc-blue transition-shadow hover:shadow-lg">
                    {item.mainImage ? (
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={item.mainImage.asset.url}
                          alt={item.mainImage.alt || ''}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-rdc-blue/5 text-rdc-blue">
                        <Newspaper className="h-9 w-9" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-rdc-blue">
                        {new Date(item.publishedAt).toLocaleDateString(
                          locale === 'fr' ? 'fr-FR' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </p>
                      <h3 className="line-clamp-3 font-semibold leading-snug text-gray-900 group-hover:text-rdc-blue">
                        {locale === 'fr' ? item.titleFr : item.titleEn}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <section className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('gallery')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {article.gallery.map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={image.asset.url}
                    alt={image.caption || `${title} - Image ${index + 1}`}
                    className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                  />
                  {image.caption && (
                    <p className="mt-2 text-center text-sm text-gray-600">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {article.relatedProjects && article.relatedProjects.length > 0 && (
          <section className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('relatedProjects')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {article.relatedProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/${locale}/projets/${project.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    {project.mainImage && (
                      <div className="aspect-video overflow-hidden bg-gray-200">
                        <img
                          src={project.mainImage.asset.url}
                          alt=""
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-semibold text-gray-900">
                        {locale === 'fr' ? project.titleFr : project.titleEn}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Share */}
        <div className="border-t border-gray-200 pt-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="h-4 w-4" />
              <span>{locale === 'fr' ? article.category.nameFr : article.category.nameEn}</span>
            </div>
            <Link
              href={`/${locale}/actualites?category=${article.category.slug}`}
              className="text-sm text-rdc-blue hover:underline"
            >
              {t('moreInCategory')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArticleHeaderContent({
  locale,
  title,
  category,
  categorySlug,
  date,
  featured,
  featuredLabel,
  backLabel,
  inverse = false,
}: {
  locale: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string;
  featured: boolean;
  featuredLabel: string;
  backLabel: string;
  inverse?: boolean;
}) {
  const textClass = inverse ? 'text-white' : 'text-gray-900';
  const mutedClass = inverse ? 'text-white/85' : 'text-gray-600';

  return (
    <>
      <Link
        href={`/${locale}/actualites`}
        className={`mb-6 inline-flex items-center gap-2 text-sm font-medium ${
          inverse ? 'text-white hover:text-white/80' : 'text-rdc-blue hover:underline'
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href={`/${locale}/actualites?category=${categorySlug}`}>
          <Badge variant={inverse ? 'secondary' : 'outline'} className={inverse ? 'bg-white/90' : ''}>
            <Newspaper className="mr-1.5 h-3.5 w-3.5" />
            {category}
          </Badge>
        </Link>
        {featured && (
          <Badge variant="default" className="bg-rdc-yellow text-gray-900">
            {featuredLabel}
          </Badge>
        )}
      </div>

      <h1 className={`max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl ${textClass}`}>
        {title}
      </h1>
      <div className={`mt-5 flex items-center gap-2 text-base ${mutedClass}`}>
        <Calendar className="h-5 w-5" />
        <time>{date}</time>
      </div>
    </>
  );
}
