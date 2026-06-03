'use client';

import dynamic from 'next/dynamic';
import type { ProjectMapData } from '@/lib/sanity/types';

const GeomaticsMap = dynamic(() => import('./geomatics-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] animate-pulse items-center justify-center rounded-lg bg-gray-200">
      <p className="text-gray-500">Chargement de la carte…</p>
    </div>
  ),
});

interface Props {
  projects: ProjectMapData[];
}

export default function GeomaticsMapLoader({ projects }: Props) {
  return <GeomaticsMap projects={projects} />;
}
