import type { Metadata } from 'next';
import { createElement } from 'react';

export const SITE_NAME = 'Cellule Infrastructures RDC';
const PRODUCTION_SITE_URL = 'https://www.celluleinfra.org';

function normalizeSiteUrl(value?: string) {
  if (!value) return undefined;
  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, '');
}

function isLocalUrl(value?: string) {
  return Boolean(value && /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(value));
}

function getSiteUrl() {
  const configuredUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const vercelProductionUrl = normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const vercelUrl = normalizeSiteUrl(process.env.VERCEL_URL);

  if (configuredUrl && (!isLocalUrl(configuredUrl) || process.env.NODE_ENV === 'development')) {
    return configuredUrl;
  }

  return vercelProductionUrl || vercelUrl || PRODUCTION_SITE_URL;
}

export const SITE_URL = getSiteUrl();
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

type Locale = 'fr' | 'en' | string;

interface SeoMetadataInput {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function localePath(locale: Locale, path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
}

export function alternateLanguages(path = '') {
  return {
    fr: absoluteUrl(localePath('fr', path)),
    en: absoluteUrl(localePath('en', path)),
    'x-default': absoluteUrl(localePath('fr', path)),
  };
}

export function createSeoMetadata({
  locale,
  path = '',
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
  keywords = [],
}: SeoMetadataInput): Metadata {
  const canonicalPath = localePath(locale, path);
  const canonical = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternateLanguages(path),
      types: {
        'application/rss+xml': absoluteUrl('/rss.xml'),
        'text/plain': absoluteUrl('/llms.txt'),
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: locale === 'fr' ? 'fr_CD' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_CD',
      url: canonical,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@CelluleInfraRDC',
      site: '@CelluleInfraRDC',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: SITE_NAME,
    alternateName: 'Cellule Infrastructures',
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kinshasa',
      addressCountry: 'CD',
    },
    sameAs: [
      absoluteUrl('/fr/actualites'),
      absoluteUrl('/fr/projets'),
      absoluteUrl('/fr/appels-offres'),
      absoluteUrl('/fr/publications'),
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['fr-CD', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/fr/recherche?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, '\\u003c') },
  });
}
