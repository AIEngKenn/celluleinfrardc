'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="px-4 text-center">
        <h1 className="mb-4 text-9xl font-bold text-rdc-red">500</h1>
        <h2 className="mb-4 text-3xl font-semibold text-gray-900">{t('500.title')}</h2>
        <p className="mb-8 text-xl text-gray-600">{t('500.description')}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-md bg-rdc-blue px-6 py-3 text-white transition-colors hover:bg-rdc-blue/90"
          >
            {t('500.tryAgain')}
          </button>
          <Link
            href="/"
            className="rounded-md border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
          >
            {t('500.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
