import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  Home,
  FolderOpen,
  Newspaper,
  ShoppingCart,
  FileText,
  MapPin,
  Mail,
  Search,
} from 'lucide-react';

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('404.title'),
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });
  const isFr = locale === 'fr';

  const links = [
    { href: `/${locale}`, icon: Home, label: isFr ? 'Accueil' : 'Home', color: 'text-rdc-blue' },
    {
      href: `/${locale}/projets`,
      icon: FolderOpen,
      label: isFr ? 'Projets' : 'Projects',
      color: 'text-blue-600',
    },
    {
      href: `/${locale}/actualites`,
      icon: Newspaper,
      label: isFr ? 'Actualités' : 'News',
      color: 'text-green-600',
    },
    {
      href: `/${locale}/appels-offres`,
      icon: ShoppingCart,
      label: isFr ? "Appels d'Offres" : 'Procurement',
      color: 'text-yellow-600',
    },
    {
      href: `/${locale}/publications`,
      icon: FileText,
      label: isFr ? 'Publications' : 'Publications',
      color: 'text-purple-600',
    },
    {
      href: `/${locale}/geomatique`,
      icon: MapPin,
      label: isFr ? 'Géomatique' : 'Geomatics',
      color: 'text-teal-600',
    },
    {
      href: `/${locale}/contact`,
      icon: Mail,
      label: isFr ? 'Contact' : 'Contact',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-20">
      {/* Animated 404 */}
      <div className="relative mb-6 select-none" aria-hidden="true">
        <span
          className="text-[10rem] font-black leading-none tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #007FFF 0%, #CE1021 50%, #F7D618 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[10rem] font-black leading-none tracking-tighter text-gray-900">
            404
          </span>
        </div>
      </div>

      {/* CI Logo mark */}
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-rdc-blue text-xs font-bold text-white">
          CI
        </span>
        <span className="text-sm font-medium text-gray-500">Cellule Infrastructures RDC</span>
      </div>

      {/* Heading */}
      <h1 className="mb-3 text-center text-3xl font-bold text-gray-900">{t('404.title')}</h1>
      <p className="mb-8 max-w-md text-center text-gray-500">{t('404.description')}</p>

      {/* Search bar */}
      <form action={`/${locale}/recherche`} method="get" className="mb-10 w-full max-w-md">
        <div className="flex overflow-hidden rounded-lg border-2 border-rdc-blue/30 bg-white shadow-sm focus-within:border-rdc-blue focus-within:ring-1 focus-within:ring-rdc-blue">
          <input
            type="search"
            name="q"
            placeholder={isFr ? 'Rechercher...' : 'Search...'}
            className="flex-1 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-rdc-blue px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-rdc-blue/90"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">{isFr ? 'Rechercher' : 'Search'}</span>
          </button>
        </div>
      </form>

      {/* Navigation grid */}
      <div className="w-full max-w-2xl">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-wide text-gray-400">
          {isFr ? 'Ou naviguez vers' : 'Or navigate to'}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {links.map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rdc-blue/30 hover:shadow-md"
            >
              <Icon className={`h-6 w-6 ${color} transition-transform group-hover:scale-110`} />
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Back home CTA */}
      <Link
        href={`/${locale}`}
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-rdc-blue px-8 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-rdc-blue/90"
      >
        <Home className="h-4 w-4" />
        {t('404.backHome')}
      </Link>
    </div>
  );
}
