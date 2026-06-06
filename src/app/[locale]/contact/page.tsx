import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return createSeoMetadata({
    locale,
    path: '/contact',
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ['contact Cellule Infrastructures', 'contact infrastructures RDC', 'Kinshasa'],
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  const settings = await sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
  });
  const address =
    (locale === 'fr' ? settings?.addressFr : settings?.addressEn) ||
    'Avenue de la Justice\nGombe, Kinshasa\nRépublique Démocratique du Congo';
  const phone = settings?.phone || '+243 (0)XX XXX XXXX';
  const email = settings?.email || 'info@celluleinfra.cd';

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
        locale={locale}
      />

      <div className="ci-container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('form.title')}</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      {t('form.firstName')} *
                    </label>
                    <Input id="firstName" name="firstName" required />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      {t('form.lastName')} *
                    </label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.email')} *
                  </label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.phone')}
                  </label>
                  <Input id="phone" name="phone" type="tel" />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.subject')} *
                  </label>
                  <Input id="subject" name="subject" required />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('form.message')} *
                  </label>
                  <Textarea id="message" name="message" rows={6} required />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-rdc-blue hover:bg-rdc-blue/90 md:w-auto"
                  >
                    {t('form.submit')}
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">{t('form.requiredFields')}</p>
                </div>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Address */}
            <Card className="p-6">
              <div className="mb-4 flex items-start gap-3">
                <MapPin className="mt-0.5 h-6 w-6 text-rdc-blue" />
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">{t('info.address')}</h3>
                  <p className="whitespace-pre-line text-sm text-gray-600">{address}</p>
                </div>
              </div>
            </Card>

            {/* Phone */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-6 w-6 text-rdc-blue" />
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">{t('info.phone')}</h3>
                  <p className="whitespace-pre-line text-sm text-gray-600">{phone}</p>
                </div>
              </div>
            </Card>

            {/* Email */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-6 w-6 text-rdc-blue" />
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">{t('info.email')}</h3>
                  <p className="text-sm text-gray-600">
                    <a href={`mailto:${email}`} className="hover:text-rdc-blue">
                      {email}
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Hours */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-6 w-6 text-rdc-blue" />
                <div>
                  <h3 className="mb-2 font-bold text-gray-900">{t('info.hours')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('info.workdays')}
                    <br />
                    08:00 - 16:00
                  </p>
                </div>
              </div>
            </Card>

            {/* Complaints Link */}
            <Card className="border-rdc-blue/20 bg-rdc-blue/5 p-6">
              <h3 className="mb-2 font-bold text-gray-900">{t('complaints.title')}</h3>
              <p className="mb-4 text-sm text-gray-600">{t('complaints.description')}</p>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/${locale}/reclamations`}>{t('complaints.button')}</a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
