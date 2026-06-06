import { getTranslations, setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '@/lib/sanity/client';
import { projectsMapDataQuery } from '@/lib/sanity/queries';
import type { ProjectMapData } from '@/lib/sanity/types';
import GeomaticsMapLoader from '@/components/geomatics/geomatics-map-loader';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'geomatics' });

  return createSeoMetadata({
    locale,
    path: '/geomatique',
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ['carte infrastructures RDC', 'géomatique RDC', 'projets localisés RDC'],
  });
}

export default async function GeomaticsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'geomatics' });

  // Fetch all projects with location data
  const projects = await sanityFetch<ProjectMapData[]>({
    query: projectsMapDataQuery,
    tags: ['project'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>
      </div>

      {/* Map */}
      <div className="container mx-auto px-4 py-8">
        <GeomaticsMapLoader projects={projects} />
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('aboutMap')}</h2>
          <div className="prose max-w-none text-gray-700">
            <p>{t('mapDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
