import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/lib/sanity/client';
import { projectsMapDataQuery } from '@/lib/sanity/queries';
import type { ProjectMapData } from '@/lib/sanity/types';
import dynamic from 'next/dynamic';

// Dynamically import the map component (client-side only)
const GeomaticsMap = dynamic(() => import('@/components/geomatics/geomatics-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] animate-pulse items-center justify-center rounded-lg bg-gray-200">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'geomatics' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function GeomaticsPage({ params }: Props) {
  const { locale } = await params;
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
        <GeomaticsMap projects={projects} />
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
