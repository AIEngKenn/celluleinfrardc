import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Cellule Infrastructures - République Démocratique du Congo',
    template: '%s | Cellule Infrastructures RDC',
  },
  description:
    "Plateforme officielle de la Cellule Infrastructures de la RDC. Informations sur les projets d'infrastructures, appels d'offres, publications et actualités.",
  keywords: [
    'RDC',
    'République Démocratique du Congo',
    'Infrastructures',
    'Projets',
    'Développement',
    "Appels d'offres",
    'Transparence',
  ],
  authors: [{ name: 'Cellule Infrastructures RDC' }],
  creator: 'Cellule Infrastructures RDC',
  publisher: 'République Démocratique du Congo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CD',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'Cellule Infrastructures RDC',
    title: 'Cellule Infrastructures - République Démocratique du Congo',
    description: 'Plateforme officielle de la Cellule Infrastructures de la RDC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cellule Infrastructures RDC',
    description: 'Plateforme officielle de la Cellule Infrastructures de la RDC',
    creator: '@CelluleInfraRDC',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased">{children}</body>
    </html>
  );
}
