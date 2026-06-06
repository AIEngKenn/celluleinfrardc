import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cellule Infrastructures RDC',
    short_name: 'CI RDC',
    description:
      "Plateforme officielle de la Cellule Infrastructures de la République Démocratique du Congo.",
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#17418a',
    lang: 'fr-CD',
    categories: ['government', 'public services', 'infrastructure'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
