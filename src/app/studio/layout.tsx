import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanity Studio — Cellule Infrastructures RDC',
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
