import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { newsBySlugQuery } from '@/lib/sanity/queries';
import type { News } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { sanityImageUrl } from '@/lib/placeholder-images';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

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
      images: [sanityImageUrl(article.mainImage)],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'news' });

  const article = await sanityFetch<News>({
    query: newsBySlugQuery,
    params: { slug },
    tags: [`news:${slug}`],
  });

  if (!article) {
    notFound();
  }

  const title = locale === 'fr' ? article.titleFr : article.titleEn;
  const excerpt = locale === 'fr' ? article.excerptFr : article.excerptEn;
  const content = locale === 'fr' ? article.contentFr : article.contentEn;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={sanityImageUrl(article.mainImage)}
          alt={article.mainImage?.alt || title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <Link
              href={`/${locale}/actualites`}
              className="mb-4 inline-flex items-center gap-2 text-white hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToNews')}
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/90">
                {locale === 'fr' ? article.category.nameFr : article.category.nameEn}
              </Badge>
              {article.featured && (
                <Badge variant="default" className="bg-rdc-yellow text-gray-900">
                  {t('featured')}
                </Badge>
              )}
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{title}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">
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
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Excerpt */}
        {excerpt && (
          <div className="mb-8">
            <p className="text-xl font-medium leading-relaxed text-gray-700">{excerpt}</p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg mb-12 max-w-none">
          {content && <PortableText value={content} />}
        </div>

        {/* Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('gallery')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {article.gallery.map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={sanityImageUrl(image)}
                    alt={image.caption || `${title} - Image ${index + 1}`}
                    className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                  />
                  {image.caption && (
                    <p className="mt-2 text-center text-sm text-gray-600">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {article.relatedProjects && article.relatedProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('relatedProjects')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {article.relatedProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/${locale}/projets/${project.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="aspect-video overflow-hidden bg-gray-200">
                      <img
                        src={sanityImageUrl(project.mainImage)}
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-semibold text-gray-900">
                        {locale === 'fr' ? project.titleFr : project.titleEn}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="border-t border-gray-200 pt-8">
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
      </div>
    </div>
  );
}
