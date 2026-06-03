import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { projectsListQuery, provincesListQuery } from '@/lib/sanity/queries';
import type { Project, Province } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ province?: string; status?: string; sector?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { province, status, sector } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'projects' });

  // Fetch all projects and provinces
  const [projects, provinces] = await Promise.all([
    sanityFetch<Project[]>({
      query: projectsListQuery,
      tags: ['project'],
    }),
    sanityFetch<Province[]>({
      query: provincesListQuery,
      tags: ['province'],
    }),
  ]);

  // Filter projects based on search params
  let filteredProjects = projects;

  if (province) {
    filteredProjects = filteredProjects.filter((p) => p.province.slug === province);
  }

  if (status) {
    filteredProjects = filteredProjects.filter((p) => p.status === status);
  }

  if (sector) {
    filteredProjects = filteredProjects.filter((p) => p.sector === sector);
  }

  return (
    <div>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />
      <div className="ci-container ci-section--sm">
        {/* Filters */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Province Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('filters.province')}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={province || ''}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  if (e.target.value) {
                    url.searchParams.set('province', e.target.value);
                  } else {
                    url.searchParams.delete('province');
                  }
                  window.location.href = url.toString();
                }}
              >
                <option value="">{t('filters.allProvinces')}</option>
                {provinces.map((p) => (
                  <option key={p._id} value={p.slug}>
                    {locale === 'fr' ? p.nameFr : p.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('filters.status')}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={status || ''}
              >
                <option value="">{t('filters.allStatuses')}</option>
                <option value="preparation">{t('status.preparation')}</option>
                <option value="ongoing">{t('status.ongoing')}</option>
                <option value="completed">{t('status.completed')}</option>
                <option value="suspended">{t('status.suspended')}</option>
              </select>
            </div>

            {/* Sector Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t('filters.sector')}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={sector || ''}
              >
                <option value="">{t('filters.allSectors')}</option>
                <option value="roads">{t('sectors.roads')}</option>
                <option value="bridges">{t('sectors.bridges')}</option>
                <option value="water">{t('sectors.water')}</option>
                <option value="electricity">{t('sectors.electricity')}</option>
                <option value="schools">{t('sectors.schools')}</option>
                <option value="hospitals">{t('sectors.hospitals')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">{t('resultsCount', { count: filteredProjects.length })}</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link key={project._id} href={`/${locale}/projets/${project.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                {project.mainImage && (
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                    <img
                      src={project.mainImage.asset.url}
                      alt={project.mainImage.alt || ''}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge
                      variant={
                        project.status === 'completed'
                          ? 'default'
                          : project.status === 'ongoing'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {t(`status.${project.status}`)}
                    </Badge>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900">
                    {locale === 'fr' ? project.titleFr : project.titleEn}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-gray-600">
                    {locale === 'fr' ? project.descriptionFr : project.descriptionEn}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {locale === 'fr' ? project.province.nameFr : project.province.nameEn}
                      </span>
                    </div>
                    {project.budget && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                          }).format(project.budget)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">{t('noResults')}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={`/${locale}/projets`}>{t('clearFilters')}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
