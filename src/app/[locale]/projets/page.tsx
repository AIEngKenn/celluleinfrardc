import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { projectsPaginatedQuery, provincesListQuery } from '@/lib/sanity/queries';
import type { Project, Province } from '@/lib/sanity/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, MapPin, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ProjectFilters } from '@/components/projects/project-filters';
import { Pagination } from '@/components/ui/pagination';
import { pageWindow, truncateText } from '@/lib/content-cleanup';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ province?: string; status?: string; sector?: string; page?: string }>;
}

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return createSeoMetadata({
    locale,
    path: '/projets',
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ['projets infrastructures RDC', 'routes RDC', 'développement infrastructures'],
  });
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { province, status, sector, page: pageParam } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'projects' });
  const { page, start, end } = pageWindow(pageParam, PAGE_SIZE);

  // Fetch all projects and provinces
  const [projectResult, provinces] = await Promise.all([
    sanityFetch<{ items: Project[]; total: number }>({
      query: projectsPaginatedQuery,
      params: {
        province: province || null,
        status: status || null,
        sector: sector || null,
        start,
        end,
      },
      tags: ['project'],
    }),
    sanityFetch<Province[]>({
      query: provincesListQuery,
      tags: ['province'],
    }),
  ]);
  const filteredProjects = projectResult.items;

  return (
    <div>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />
      <div className="ci-container ci-section--sm">
        {/* Filters — Client Component */}
        <ProjectFilters
          provinces={provinces}
          currentProvince={province}
          currentStatus={status}
          currentSector={sector}
          locale={locale}
          labels={{
            province: t('filters.province'),
            status: t('filters.status'),
            sector: t('filters.sector'),
            allProvinces: t('filters.allProvinces'),
            allStatuses: t('filters.allStatuses'),
            allSectors: t('filters.allSectors'),
            statusOptions: [
              { value: 'preparation', label: t('status.preparation') },
              { value: 'ongoing', label: t('status.ongoing') },
              { value: 'completed', label: t('status.completed') },
              { value: 'suspended', label: t('status.suspended') },
            ],
            sectorOptions: [
              { value: 'roads', label: t('sectors.roads') },
              { value: 'bridges', label: t('sectors.bridges') },
              { value: 'water', label: t('sectors.water') },
              { value: 'electricity', label: t('sectors.electricity') },
              { value: 'schools', label: t('sectors.schools') },
              { value: 'hospitals', label: t('sectors.hospitals') },
            ],
          }}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">{t('resultsCount', { count: projectResult.total })}</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {filteredProjects.map((project) => {
            const projectTitle = locale === 'fr' ? project.titleFr : project.titleEn;
            const displayTitle = truncateText(projectTitle, 110);
            return (
            <Link key={project._id} href={`/${locale}/projets/${project.slug}`} className="group">
              <Card className="grid h-full overflow-hidden border-l-4 border-l-rdc-blue transition-shadow hover:shadow-xl md:grid-cols-[14rem_1fr]">
                {project.mainImage && (
                  <div className="relative min-h-56 overflow-hidden bg-gray-200">
                    <img
                      src={project.mainImage.asset.url}
                      alt={project.mainImage.alt || projectTitle}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                {!project.mainImage && (
                  <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-rdc-blue/10 to-rdc-blue/5 text-rdc-blue">
                    <Building2 className="h-14 w-14" />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
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
                    <Badge variant="outline">{t(`sectors.${project.sector}`)}</Badge>
                  </div>

                  <h3
                    className="mb-3 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-rdc-blue"
                    title={projectTitle}
                  >
                    {displayTitle}
                  </h3>

                  <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {locale === 'fr' ? project.descriptionFr : project.descriptionEn}
                  </p>

                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
                      <span>{t('progress')}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100">
                      <div
                        className="h-2.5 rounded-full bg-rdc-blue"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
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
                  <div className="mt-5 flex items-center text-sm font-semibold text-rdc-blue">
                    {t('viewDetails')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <p className="text-lg text-gray-500">{t('noResults')}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={`/${locale}/projets`}>{t('clearFilters')}</Link>
            </Button>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={projectResult.total}
          basePath={`/${locale}/projets`}
          searchParams={{ province, status, sector }}
          labels={{ previous: 'Précédent', next: 'Suivant', page: 'Page' }}
        />
      </div>
    </div>
  );
}
