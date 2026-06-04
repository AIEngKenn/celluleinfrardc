import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Locale } from '@/i18n';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GovernmentBand } from '@/components/ui/government-band';
import '../globals.css';

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
            <GovernmentBand />
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
