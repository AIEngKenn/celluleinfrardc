import type { MediaSectionId, ResolvedMediaItem } from "@/lib/media/types";

/** Builds a médiathèque URL targeting a page section (hash scroll). */
export function mediathequeSectionHref(locale: string, section: MediaSectionId): string {
  return `/${locale}/mediatheque#media-section-${section}`;
}

/** Builds the médiathèque album detail URL. */
export function mediathequeAlbumHref(locale: string, slug: string): string {
  return `/${locale}/mediatheque/${slug}`;
}

/** Resolves the best destination for a media item from the homepage teaser. */
export function mediathequeItemHref(locale: string, item: ResolvedMediaItem): string {
  if (item.type === "video") {
    return `/${locale}/mediatheque?video=${encodeURIComponent(item.id)}#media-section-videos`;
  }

  if (item.albumSlug) {
    return `/${locale}/mediatheque/${item.albumSlug}?photo=${encodeURIComponent(item.id)}`;
  }

  return `/${locale}/mediatheque?photo=${encodeURIComponent(item.id)}#media-section-photos`;
}

/** Spotlight hero tile — featured section, with item context when relevant. */
export function mediathequeSpotlightHref(locale: string, item: ResolvedMediaItem): string {
  if (item.type === "video") {
    return `/${locale}/mediatheque?video=${encodeURIComponent(item.id)}#media-section-spotlight`;
  }

  return `/${locale}/mediatheque?photo=${encodeURIComponent(item.id)}#media-section-spotlight`;
}
