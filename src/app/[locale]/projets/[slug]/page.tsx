import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch, urlFor } from '@/lib/sanity/client';
import { projectBySlugQuery } from '@/lib/sanity/queries';
import type { Project } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, TrendingUp, Download, ArrowLeft, Building2, Clock } from 'lucide-react';
import { ProjectMap } from '@/components/projects/project-map-loader';

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

  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description,
      images: project.mainImage ? [project.mainImage.asset.url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  const project = await sanityFetch<Project>({
    query: projectBySlugQuery,
    params: { slug },
    tags: [`project:${slug}`],
  });

  if (!project) {
    notFound();
  }

  const title = locale === 'fr' ? project.titleFr : project.titleEn;
  const description = locale === 'fr' ? project.descriptionFr : project.descriptionEn;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      {project.mainImage && (
        <div className="relative h-96 bg-gray-900">
          <img
            src={project.mainImage.asset.url}
            alt={project.mainImage.alt || title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Link
                href={`/${locale}/projets`}
                className="mb-4 inline-flex items-center gap-2 text-white hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('backToProjects')}
              </Link>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant={
                    project.status === 'completed'
                      ? 'default'
                      : project.status === 'ongoing'
                        ? 'secondary'
                        : 'outline'
                  }
                  className="bg-white/90"
                >
                  {t(`status.${project.status}`)}
                </Badge>
                <span className="text-lg font-semibold text-white">
                  {project.progress}% {t('complete')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('description')}</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{description}</p>
              </div>
            </Card>

            {/* Map */}
            {project.location && (
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('location')}</h2>
                <ProjectMap
                  latitude={project.location.lat}
                  longitude={project.location.lng}
                  projectName={title}
                />
              </Card>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('gallery')}</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {project.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video overflow-hidden rounded-lg bg-gray-200"
                    >
                      <img
                        src={image.asset.url}
                        alt={image.caption || `${title} - Image ${index + 1}`}
                        className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('documents')}</h2>
                <div className="space-y-3">
                  {project.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.file.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-rdc-blue" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {locale === 'fr' ? doc.titleFr : doc.titleEn}
                          </p>
                          {doc.file.asset.size && (
                            <p className="text-sm text-gray-500">
                              {(doc.file.asset.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t('download')}
                      </Button>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Related News */}
            {project.relatedNews && project.relatedNews.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('relatedNews')}</h2>
                <div className="space-y-4">
                  {project.relatedNews.map((news) => (
                    <Link
                      key={news._id}
                      href={`/${locale}/actualites/${news.slug}`}
                      className="flex gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      {news.mainImage && (
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={news.mainImage.asset.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-gray-900">
                          {locale === 'fr' ? news.titleFr : news.titleEn}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(news.publishedAt).toLocaleDateString(
                            locale === 'fr' ? 'fr-FR' : 'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Information */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">{t('keyInfo')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">{t('province')}</p>
                    <p className="font-medium text-gray-900">
                      {locale === 'fr' ? project.province.nameFr : project.province.nameEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 text-rdc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">{t('sector')}</p>
                    <p className="font-medium text-gray-900">{t(`sectors.${project.sector}`)}</p>
                  </div>
                </div>

                {project.budget && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 text-rdc-blue" />
                    <div>
                      <p className="text-sm text-gray-500">{t('budget')}</p>
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                        }).format(project.budget)}
                      </p>
                    </div>
                  </div>
                )}

                {project.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-rdc-blue" />
                    <div>
                      <p className="text-sm text-gray-500">{t('startDate')}</p>
                      <p className="font-medium text-gray-900">
                        {new Date(project.startDate).toLocaleDateString(
                          locale === 'fr' ? 'fr-FR' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {project.endDate && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-rdc-blue" />
                    <div>
                      <p className="text-sm text-gray-500">{t('endDate')}</p>
                      <p className="font-medium text-gray-900">
                        {new Date(project.endDate).toLocaleDateString(
                          locale === 'fr' ? 'fr-FR' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Progress */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">{t('progress')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('completion')}</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-rdc-blue transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Related Procurement */}
            {project.relatedProcurement && project.relatedProcurement.length > 0 && (
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">{t('relatedProcurement')}</h3>
                <div className="space-y-3">
                  {project.relatedProcurement.map((proc) => (
                    <Link
                      key={proc._id}
                      href={`/${locale}/appels-offres/${proc.slug}`}
                      className="block rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <p className="mb-1 text-xs text-gray-500">{proc.reference}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {locale === 'fr' ? proc.titleFr : proc.titleEn}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {t('closingDate')}:{' '}
                        {new Date(proc.closingDate).toLocaleDateString(
                          locale === 'fr' ? 'fr-FR' : 'en-US'
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
