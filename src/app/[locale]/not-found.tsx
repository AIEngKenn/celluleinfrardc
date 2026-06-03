import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('404.title'),
  };
}

export default async function NotFound({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="px-4 text-center">
        <h1 className="mb-4 text-9xl font-bold text-rdc-blue">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-gray-900">{t('404.title')}</h2>
        <p className="mb-8 text-xl text-gray-600">{t('404.description')}</p>
        <div className="flex justify-center gap-4">
          <Link
            href={`/${locale}`}
            className="rounded-md bg-rdc-blue px-6 py-3 text-white transition-colors hover:bg-rdc-blue/90"
          >
            {t('404.backHome')}
          </Link>
          <Link
            href={`/${locale}/projets`}
            className="rounded-md border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
          >
            {t('404.viewProjects')}
          </Link>
        </div>
      </div>
    </div>
  );
}
