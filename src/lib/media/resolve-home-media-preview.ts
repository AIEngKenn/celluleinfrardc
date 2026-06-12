import type { MediaAlbum, MediaItem } from "@/lib/sanity/types";
import { resolveMediaGallery } from "@/lib/media/resolve-media";
import type { ResolvedMediaAlbum, ResolvedMediaItem } from "@/lib/media/types";

export interface HomeMediaPreviewData {
  spotlight: ResolvedMediaItem | null;
  tiles: ResolvedMediaItem[];
  albums: ResolvedMediaAlbum[];
  photoCount: number;
  videoCount: number;
  albumCount: number;
}

function dedupeItems(items: ResolvedMediaItem[], limit: number): ResolvedMediaItem[] {
  const seen = new Set<string>();
  const result: ResolvedMediaItem[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    result.push(item);
    if (result.length >= limit) {
      break;
    }
  }

  return result;
}

/**
 * Builds homepage médiathèque teaser content from CMS data or demo fallback.
 */
export function resolveHomeMediaPreview(
  cmsMedia: MediaItem[] | null | undefined,
  cmsAlbums: MediaAlbum[] | null | undefined
): HomeMediaPreviewData {
  const gallery = resolveMediaGallery(cmsMedia, cmsAlbums);
  const pool = [...gallery.featured, ...gallery.photos, ...gallery.videos];
  const tiles = dedupeItems(pool, 5);
  const spotlight = gallery.featured[0] ?? tiles[0] ?? null;

  return {
    spotlight,
    tiles,
    albums: gallery.albums.slice(0, 2),
    photoCount: gallery.photos.length,
    videoCount: gallery.videos.length,
    albumCount: gallery.albums.length,
  };
}
