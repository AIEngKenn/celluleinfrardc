import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { morePublicationsQuery, publicationBySlugQuery } from '@/lib/sanity/queries';
import type { Publication } from '@/lib/sanity/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Download, ArrowLeft, FileWarning } from 'lucide-react';
import { SharePanel } from '@/components/share/share-panel';
import { cleanMigratedText, truncateText } from '@/lib/content-cleanup';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const publication = await sanityFetch<Publication>({
    query: publicationBySlugQuery,
    params: { slug },
    tags: [`publication:${slug}`],
  });

  if (!publication) return {};

  const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
  const description = cleanMigratedText(
    locale === 'fr' ? publication.descriptionFr : publication.descriptionEn
  );

  return createSeoMetadata({
    locale,
    path: `/publications/${publication.slug}`,
    title,
    description,
    image: publication.coverImage?.asset?.url,
    type: 'article',
    publishedTime: publication.publishedAt,
    modifiedTime: publication._updatedAt,
    keywords: [title, publication.publicationType, 'publication infrastructures RDC'],
  });
}

export default async function PublicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'publications' });

  const [publication, morePublications] = await Promise.all([
    sanityFetch<Publication>({
      query: publicationBySlugQuery,
      params: { slug },
      tags: [`publication:${slug}`],
    }),
    sanityFetch<Publication[]>({
      query: morePublicationsQuery,
      params: { slug },
      tags: ['publication'],
    }),
  ]);

  if (!publication) {
    notFound();
  }

  const title = locale === 'fr' ? publication.titleFr : publication.titleEn;
  const description = cleanMigratedText(
    locale === 'fr' ? publication.descriptionFr : publication.descriptionEn
  );
  const pdfAsset = publication.pdfFile?.asset;
  const formattedDate = new Date(publication.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Link
            href={`/${locale}/publications`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rdc-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToPublications')}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge className="border-0 bg-[#CE1021]/10 text-[#CE1021]">
              {t(`types.${publication.publicationType}`)}
            </Badge>

            {pdfAsset ? (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                <FileText className="h-4 w-4 text-rdc-blue" />
                PDF Document
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-600">
                <FileWarning className="h-4 w-4" />
                No file attached
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            {title}
          </h1>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-rdc-blue" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[1fr_20rem]">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* DESCRIPTION CARD */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{t('about')}</h2>
            <p className="whitespace-pre-wrap leading-7 text-slate-700">{description}</p>
          </section>

          {/* PDF VIEWER (MAIN FOCUS) */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="text-xl font-bold text-slate-900">{t('document')}</h2>

              {pdfAsset && (
                <a
                  href={pdfAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-rdc-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-rdc-blue/90"
                >
                  <Download className="h-4 w-4" />
                  {t('download')}
                </a>
              )}
            </div>

            {pdfAsset ? (
              <div className="aspect-[8.5/11] bg-slate-100">
                <iframe
                  src={`${pdfAsset.url}#toolbar=1&view=FitH`}
                  className="h-full w-full"
                  title={title}
                />
              </div>
            ) : (
              <div className="p-10 text-center">
                <FileWarning className="mx-auto mb-3 h-10 w-10 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900">
                  {locale === 'fr' ? 'Document non disponible' : 'Document unavailable'}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {locale === 'fr'
                    ? 'Fichier absent de l’import HTTrack.'
                    : 'File missing from HTTrack import.'}
                </p>
              </div>
            )}

            {pdfAsset?.size && (
              <div className="border-t border-slate-100 p-4 text-center text-xs text-slate-500">
                {(pdfAsset.size / 1024 / 1024).toFixed(2)} MB
                {pdfAsset.originalFilename ? ` • ${pdfAsset.originalFilename}` : ''}
              </div>
            )}
          </section>

          {/* MORE PUBLICATIONS */}
          {morePublications.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {locale === 'fr' ? 'Autres publications' : 'More publications'}
                </h2>

                <Link
                  href={`/${locale}/publications`}
                  className="text-sm font-semibold text-rdc-blue hover:underline"
                >
                  {t('viewAll')}
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {morePublications.map((item) => {
                  const itemTitle = locale === 'fr' ? item.titleFr : item.titleEn;
                  const displayTitle = truncateText(itemTitle, 95);
                  const hasFile = Boolean(item.pdfFile?.asset?.url);

                  return (
                    <Link
                      key={item._id}
                      href={`/${locale}/publications/${item.slug}`}
                      className="group"
                    >
                      <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#CE1021]/20 hover:shadow-xl">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge className="border-0 bg-[#CE1021]/10 text-[#CE1021]">
                            {t(`types.${item.publicationType}`)}
                          </Badge>

                          {hasFile ? (
                            <FileText className="h-5 w-5 text-rdc-blue" />
                          ) : (
                            <FileWarning className="h-5 w-5 text-amber-500" />
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 transition group-hover:text-[#CE1021]">
                          {displayTitle}
                        </h3>

                        <p className="mt-3 text-xs text-slate-500">
                          {new Date(item.publishedAt).toLocaleDateString(
                            locale === 'fr' ? 'fr-FR' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </p>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR (STICKY UX) */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-6">
          <SharePanel
            title={title}
            description={description}
            path={`/${locale}/publications/${publication.slug}`}
            locale={locale}
          />

          {/* QUICK ACTIONS (UPGRADED) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
              {t('quickActions')}
            </h3>

            <div className="space-y-3">
              {pdfAsset ? (
                <>
                  <a
                    href={pdfAsset.url}
                    download
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                  >
                    <Download className="h-5 w-5 text-rdc-blue" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t('downloadPDF')}</p>
                      <p className="text-xs text-slate-500">
                        {pdfAsset.size ? `${(pdfAsset.size / 1024 / 1024).toFixed(2)} MB` : ''}
                      </p>
                    </div>
                  </a>

                  <a
                    href={pdfAsset.url}
                    target="_blank"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                  >
                    <FileText className="h-5 w-5 text-rdc-blue" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t('openInNewTab')}</p>
                    </div>
                  </a>
                </>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {locale === 'fr' ? 'Aucun fichier disponible' : 'No file available'}
                </div>
              )}
            </div>
          </div>

          {/* INFO CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
              {t('information')}
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <div>
                <p className="text-slate-500">{t('type')}</p>
                <p className="font-medium">{t(`types.${publication.publicationType}`)}</p>
              </div>

              <div>
                <p className="text-slate-500">{t('publishedDate')}</p>
                <p className="font-medium">{formattedDate}</p>
              </div>

              {pdfAsset?.originalFilename && (
                <div>
                  <p className="text-slate-500">{t('filename')}</p>
                  <p className="break-all font-medium">{pdfAsset.originalFilename}</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
