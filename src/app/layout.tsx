import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { JsonLd, SITE_NAME, SITE_URL, absoluteUrl, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  category: 'government',
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
    'Cellule Infrastructures RDC',
    'marchés publics RDC',
    'travaux publics RDC',
    'routes RDC',
    'Kinshasa',
  ],
  alternates: {
    canonical: '/',
    languages: {
      fr: '/fr',
      en: '/en',
      'x-default': '/fr',
    },
    types: {
      'application/rss+xml': '/rss.xml',
      'text/plain': '/llms.txt',
    },
  },
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
    images: [
      {
        url: absoluteUrl('/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Cellule Infrastructures RDC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cellule Infrastructures RDC',
    description: 'Plateforme officielle de la Cellule Infrastructures de la RDC',
    creator: '@CelluleInfraRDC',
    site: '@CelluleInfraRDC',
    images: [absoluteUrl('/og-image.jpg')],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
