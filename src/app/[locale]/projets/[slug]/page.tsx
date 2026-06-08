import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { moreProjectsQuery, projectBySlugQuery } from '@/lib/sanity/queries';
import type { Project } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, TrendingUp, Download, ArrowLeft, Building2, Clock } from 'lucide-react';
import { ProjectMap } from '@/components/projects/project-map-loader';
import { SharePanel } from '@/components/share/share-panel';
import { truncateText } from '@/lib/content-cleanup';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = await sanityFetch<Project>({
    query: projectBySlugQuery,
    params: { slug },
    tags: [`project:${slug}`],
  });

  if (!project) return {};

  const title = locale === 'fr' ? project.titleFr : project.titleEn;
  const description = locale === 'fr' ? project.descriptionFr : project.descriptionEn;

  return createSeoMetadata({
    locale,
    path: `/projets/${project.slug}`,
    title,
    description: description.substring(0, 160),
    image: project.mainImage?.asset?.url,
    type: 'article',
    modifiedTime: project._updatedAt,
    keywords: [
      title,
      project.sector,
      project.province?.nameFr || project.province?.nameEn || '',
      'projet infrastructure RDC',
    ],
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  const [project, moreProjects] = await Promise.all([
    sanityFetch<Project>({
      query: projectBySlugQuery,
      params: { slug },
      tags: [`project:${slug}`],
    }),
    sanityFetch<Project[]>({
      query: moreProjectsQuery,
      params: { slug },
      tags: ['project'],
    }),
  ]);

  if (!project) {
    notFound();
  }

  const title = locale === 'fr' ? project.titleFr : project.titleEn;
  const description = locale === 'fr' ? project.descriptionFr : project.descriptionEn;
  const documents = project.documents?.filter((doc) => doc.file?.asset?.url) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <div className="relative">
        {project.mainImage ? (
          <div className="relative h-[420px] overflow-hidden bg-slate-900">
            <img
              src={project.mainImage.asset.url}
              alt={project.mainImage.alt || title}
              className="h-full w-full scale-105 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>
        ) : (
          <div className="h-[240px] bg-gradient-to-br from-slate-900 to-slate-700" />
        )}

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <Link
              href={`/${locale}/projets`}
              className="mb-4 inline-flex items-center gap-2 text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToProjects')}
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge
                className={
                  project.status === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : project.status === 'ongoing'
                      ? 'bg-rdc-blue text-white'
                      : 'bg-amber-500 text-white'
                }
              >
                {t(`status.${project.status}`)}
              </Badge>

              <span className="font-semibold text-white/90">
                {project.progress}% {t('complete')}
              </span>

              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {t(`sectors.${project.sector}`)}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-8 lg:col-span-2">
            {/* DESCRIPTION */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{t('description')}</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{description}</p>
            </Card>

            {/* MAP */}
            {project.location && (
              <Card className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="mb-4 text-xl font-bold text-slate-900">{t('location')}</h2>

                <ProjectMap
                  latitude={project.location.lat}
                  longitude={project.location.lng}
                  projectName={title}
                />
              </Card>
            )}

            {/* GALLERY */}
            {project.gallery && project.gallery.length > 0 && (
              <Card className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-bold text-slate-900">{t('gallery')}</h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {project.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="group aspect-video overflow-hidden rounded-xl bg-slate-100"
                    >
                      <img
                        src={image.asset.url}
                        alt={image.caption || `${title} ${index + 1}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* DOCUMENTS */}
            {documents.length > 0 && (
              <Card className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-bold text-slate-900">{t('documents')}</h2>

                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.file.asset?.url}
                      target="_blank"
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-rdc-blue hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-rdc-blue" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {locale === 'fr' ? doc.titleFr : doc.titleEn}
                          </p>
                          {doc.file.asset?.size && (
                            <p className="text-xs text-slate-500">
                              {(doc.file.asset.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-rdc-blue">{t('download')}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* RELATED NEWS */}
            {project.relatedNews && project.relatedNews.length > 0 && (
              <Card className="rounded-2xl border border-slate-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-bold text-slate-900">{t('relatedNews')}</h2>

                <div className="space-y-4">
                  {project.relatedNews.map((news) => {
                    const newsTitle = locale === 'fr' ? news.titleFr : news.titleEn;

                    return (
                      <Link
                        key={news._id}
                        href={`/${locale}/actualites/${news.slug}`}
                        className="group flex gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-rdc-blue hover:shadow-md"
                      >
                        {news.mainImage && (
                          <div className="h-20 w-24 overflow-hidden rounded-lg bg-slate-100">
                            <img
                              src={news.mainImage.asset.url}
                              className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 transition group-hover:text-rdc-blue">
                            {newsTitle}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(news.publishedAt).toLocaleDateString(
                              locale === 'fr' ? 'fr-FR' : 'en-US'
                            )}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <SharePanel
              title={title}
              description={description}
              path={`/${locale}/projets/${project.slug}`}
              locale={locale}
            />

            {/* KEY INFO */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-5 text-lg font-bold text-slate-900">{t('keyInfo')}</h3>

              <div className="space-y-5 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-rdc-blue" />
                  <div>
                    <p className="text-slate-500">{t('province')}</p>
                    <p className="font-medium text-slate-900">
                      {locale === 'fr' ? project.province.nameFr : project.province.nameEn}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Building2 className="mt-1 h-4 w-4 text-rdc-blue" />
                  <div>
                    <p className="text-slate-500">{t('sector')}</p>
                    <p className="font-medium text-slate-900">{t(`sectors.${project.sector}`)}</p>
                  </div>
                </div>

                {project.budget && (
                  <div className="flex gap-3">
                    <TrendingUp className="mt-1 h-4 w-4 text-rdc-blue" />
                    <div>
                      <p className="text-slate-500">{t('budget')}</p>
                      <p className="font-medium text-slate-900">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(project.budget)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* PROGRESS */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-slate-900">{t('progress')}</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{t('completion')}</span>
                  <span className="font-bold text-rdc-blue">{project.progress}%</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-rdc-blue transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* MORE PROJECTS */}
        {moreProjects.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {locale === 'fr' ? 'Autres projets' : 'More projects'}
              </h2>

              <Link
                href={`/${locale}/projets`}
                className="text-sm font-semibold text-rdc-blue hover:underline"
              >
                {t('viewAll')}
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {moreProjects.map((item) => {
                const itemTitle = locale === 'fr' ? item.titleFr : item.titleEn;

                return (
                  <Link key={item._id} href={`/${locale}/projets/${item.slug}`} className="group">
                    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                      {item.mainImage ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={item.mainImage.asset.url}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-slate-100">
                          <Building2 className="h-10 w-10 text-slate-400" />
                        </div>
                      )}

                      <div className="p-5">
                        <Badge className="mb-3 bg-slate-100 text-slate-700">
                          {t(`status.${item.status}`)}
                        </Badge>

                        <h3 className="font-semibold text-slate-900 transition group-hover:text-rdc-blue">
                          {itemTitle}
                        </h3>
                      </div>
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
