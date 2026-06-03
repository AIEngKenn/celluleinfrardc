'use client';

import dynamic from 'next/dynamic';

const ProjectMap = dynamic(() => import('./project-map'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-lg bg-gray-200" />,
});

export { ProjectMap };
