import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { sanityFetch } from "@/lib/sanity/client";
import { mediaAlbumsQuery, mediaGalleryQuery } from "@/lib/sanity/queries";
import type { MediaAlbum, MediaItem } from "@/lib/sanity/types";
import { MediathequePageContent } from "@/components/media/mediatheque-page-content";
import { resolveMediaGallery } from "@/lib/media/resolve-media";
import { createSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "media" });

  return createSeoMetadata({
    locale,
    path: "/mediatheque",
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "médiathèque infrastructures RDC",
      "galerie photos projets RDC",
      "vidéos infrastructures Congo",
      "Cellule Infrastructures médiathèque",
    ],
  });
}

export default async function MediaCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [media, albums] = await Promise.all([
    sanityFetch<MediaItem[]>({
      query: mediaGalleryQuery,
      revalidate: 3600,
    }),
    sanityFetch<MediaAlbum[]>({
      query: mediaAlbumsQuery,
      revalidate: 3600,
    }),
  ]);

  const gallery = resolveMediaGallery(media, albums);

  return <MediathequePageContent locale={locale} gallery={gallery} />;
}
