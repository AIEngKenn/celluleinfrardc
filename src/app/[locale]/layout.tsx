import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Locale } from '@/i18n';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GovernmentBand } from '@/components/ui/government-band';
import { sanityFetch } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

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
  const [messages, siteSettings] = await Promise.all([
    getMessages(),
    sanityFetch<SiteSettings | null>({
      query: siteSettingsQuery,
      tags: ['siteSettings'],
    }),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none focus:outline-none">
        {children}
        <GovernmentBand />
        {/* ── Tricolour sovereignty stripe ── */}
        {/* <div className="flex h-[3px] w-full" aria-hidden="true">
          <span className="flex-1 bg-[#007FFF]" />
          <span className="flex-1 bg-[#F7D618]" />
          <span className="flex-1 bg-[#CE1021]" />
        </div> */}
      </main>
      <Footer settings={siteSettings || undefined} />
    </NextIntlClientProvider>
  );
}
