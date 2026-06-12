import type { MediaAlbum, MediaItem } from "@/lib/sanity/types";
import {
  FALLBACK_ALBUMS,
  FALLBACK_MEDIA,
  getFallbackAlbumBySlug,
} from "@/lib/media/media-fallback";
import type {
  ResolvedMediaAlbum,
  ResolvedMediaGallery,
  ResolvedMediaItem,
} from "@/lib/media/types";
import { extractYoutubeId, youtubeThumbnailUrl } from "@/lib/media/youtube";

const PLACEHOLDER = "/images/placeholders/RDC-Drapeau-CUA.jpg";

function resolveImageUrl(image?: MediaItem["image"], fallbackAlt = ""): {
  url: string;
  alt: string;
} {
  const url = image?.asset?.url;
  if (url) {
    return { url, alt: image?.alt || fallbackAlt };
  }
  return { url: PLACEHOLDER, alt: fallbackAlt };
}

function mapSanityMediaItem(item: MediaItem): ResolvedMediaItem {
  const titleFr = item.title?.fr || "";
  const titleEn = item.title?.en || titleFr;
  const captionFr = item.caption?.fr;
  const captionEn = item.caption?.en;
  const image = resolveImageUrl(item.image, titleFr);
  const thumb = item.thumbnail?.asset?.url
    ? { url: item.thumbnail.asset.url, alt: item.thumbnail.alt || titleFr }
    : null;
  const youtubeId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;
  const videoThumb = youtubeId ? youtubeThumbnailUrl(youtubeId) : null;

  return {
    id: item._id,
    type: item.type,
    titleFr,
    titleEn,
    captionFr,
    captionEn,
    imageUrl:
      item.type === "video"
        ? thumb?.url || videoThumb || image.url
        : image.url,
    imageAlt: item.type === "video" ? thumb?.alt || titleFr : image.alt,
    thumbnailUrl: thumb?.url || videoThumb || undefined,
    videoUrl: item.videoUrl,
    youtubeId: youtubeId || undefined,
    date: item.date,
    featured: item.featured,
    projectSlug: item.project?.slug,
    projectTitleFr: item.project?.titleFr,
    projectTitleEn: item.project?.titleEn,
    albumSlug: undefined,
    albumTitleFr: item.album?.titleFr,
    albumTitleEn: item.album?.titleEn,
  };
}

function mapSanityAlbum(album: MediaAlbum, items: ResolvedMediaItem[]): ResolvedMediaAlbum {
  const cover = resolveImageUrl(album.coverImage, album.title?.fr || "");
  return {
    id: album._id,
    slug: album.slug,
    titleFr: album.title?.fr || "",
    titleEn: album.title?.en || album.title?.fr || "",
    descriptionFr: album.description?.fr,
    descriptionEn: album.description?.en,
    coverUrl: cover.url,
    coverAlt: cover.alt,
    date: album.date,
    itemCount: album.itemCount ?? items.length,
    items,
  };
}

function dedupeMedia(items: ResolvedMediaItem[]): ResolvedMediaItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function buildFeatured(items: ResolvedMediaItem[]): ResolvedMediaItem[] {
  const featured = items.filter((item) => item.featured);
  if (featured.length >= 4) {
    return featured.slice(0, 6);
  }
  return dedupeMedia([...featured, ...items]).slice(0, 6);
}

/**
 * Resolves médiathèque content from Sanity, falling back to demo data when CMS is empty.
 */
export function resolveMediaGallery(
  cmsMedia: MediaItem[] | null | undefined,
  cmsAlbums: MediaAlbum[] | null | undefined
): ResolvedMediaGallery {
  const hasCmsMedia = Boolean(cmsMedia?.length);
  const hasCmsAlbums = Boolean(cmsAlbums?.length);

  if (hasCmsMedia || hasCmsAlbums) {
    const media = hasCmsMedia ? cmsMedia?.map(mapSanityMediaItem) ?? [] : [];
    const albums = hasCmsAlbums
      ? (cmsAlbums ?? []).map((album) => {
          const albumItems = media.filter((item) => item.albumTitleFr === album.title?.fr);
          return mapSanityAlbum(album, albumItems);
        })
      : [];

    const photos = media.filter((item) => item.type === "image");
    const videos = media.filter((item) => item.type === "video");

    return {
      media,
      albums,
      photos,
      videos,
      featured: buildFeatured(media),
      isDemoContent: false,
    };
  }

  const media = FALLBACK_MEDIA;
  const photos = media.filter((item) => item.type === "image");
  const videos = media.filter((item) => item.type === "video");

  return {
    media,
    albums: FALLBACK_ALBUMS,
    photos,
    videos,
    featured: buildFeatured(media),
    isDemoContent: true,
  };
}

/**
 * Resolves a single album by slug from Sanity payload or demo fallback.
 */
export function resolveMediaAlbumBySlug(
  slug: string,
  cmsAlbum: MediaAlbum | null | undefined,
  _cmsMedia: MediaItem[] | null | undefined
): ResolvedMediaAlbum | null {
  if (cmsAlbum) {
    const items = (cmsAlbum.items ?? []).map(mapSanityMediaItem);
    return mapSanityAlbum(cmsAlbum, items);
  }

  return getFallbackAlbumBySlug(slug) ?? null;
}

/**
 * Returns localized title for a resolved media item.
 */
export function getMediaTitle(item: ResolvedMediaItem, locale: string): string {
  return locale === "fr" ? item.titleFr : item.titleEn;
}

/**
 * Returns localized caption for a resolved media item.
 */
export function getMediaCaption(item: ResolvedMediaItem, locale: string): string | undefined {
  return locale === "fr" ? item.captionFr : item.captionEn;
}

/**
 * Returns localized album title.
 */
export function getAlbumTitle(album: ResolvedMediaAlbum, locale: string): string {
  return locale === "fr" ? album.titleFr : album.titleEn;
}

/**
 * Returns localized album description.
 */
export function getAlbumDescription(album: ResolvedMediaAlbum, locale: string): string | undefined {
  return locale === "fr" ? album.descriptionFr : album.descriptionEn;
}

/**
 * Formats a media date for display.
 */
export function formatMediaDate(date: string | undefined, locale: string, style: "short" | "long" = "short"): string {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: style === "long" ? "numeric" : undefined,
  });
}
