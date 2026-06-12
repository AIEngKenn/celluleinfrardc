import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { sanityFetch } from "@/lib/sanity/client";
import { albumBySlugQuery } from "@/lib/sanity/queries";
import type { MediaAlbum, MediaItem } from "@/lib/sanity/types";
import { AlbumDetailContent } from "@/components/media/album-detail-content";
import { getFallbackAlbumSlugs } from "@/lib/media/media-fallback";
import { resolveMediaAlbumBySlug } from "@/lib/media/resolve-media";
import { createSeoMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getFallbackAlbumSlugs();
  const locales = ["fr", "en"];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "media" });
  const isFr = locale === "fr";

  const cmsAlbum = await sanityFetch<MediaAlbum | null>({
    query: albumBySlugQuery,
    params: { slug },
    revalidate: 3600,
  });

  const album = resolveMediaAlbumBySlug(slug, cmsAlbum, cmsAlbum?.items ?? null);
  if (!album) {
    return createSeoMetadata({
      locale,
      path: "/mediatheque",
      title: isFr ? "Album introuvable" : "Album not found",
      description: isFr ? "Cet album n'existe pas." : "This album does not exist.",
    });
  }

  const title = isFr ? album.titleFr : album.titleEn;
  const description = isFr ? album.descriptionFr : album.descriptionEn;

  return createSeoMetadata({
    locale,
    path: `/mediatheque/${slug}`,
    title: `${title} — ${t("title")}`,
    description: description || t("meta.description"),
    keywords: ["médiathèque RDC", "album photo", title],
  });
}

export default async function AlbumDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cmsAlbum = await sanityFetch<MediaAlbum | null>({
    query: albumBySlugQuery,
    params: { slug },
    revalidate: 3600,
  });

  const album = resolveMediaAlbumBySlug(slug, cmsAlbum, cmsAlbum?.items ?? null);
  if (!album) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <AlbumDetailContent locale={locale} album={album} />
    </Suspense>
  );
}
