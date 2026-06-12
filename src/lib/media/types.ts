/**
 * Client-safe resolved media types for médiathèque pages.
 */

export type ResolvedMediaType = "image" | "video";

export interface ResolvedMediaItem {
  id: string;
  type: ResolvedMediaType;
  titleFr: string;
  titleEn: string;
  captionFr?: string;
  captionEn?: string;
  imageUrl: string;
  imageAlt: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  youtubeId?: string;
  date?: string;
  featured?: boolean;
  projectSlug?: string;
  projectTitleFr?: string;
  projectTitleEn?: string;
  albumSlug?: string;
  albumTitleFr?: string;
  albumTitleEn?: string;
}

export interface ResolvedMediaAlbum {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
  coverUrl: string;
  coverAlt: string;
  date?: string;
  itemCount: number;
  featured?: boolean;
  items: ResolvedMediaItem[];
}

export interface ResolvedMediaGallery {
  media: ResolvedMediaItem[];
  albums: ResolvedMediaAlbum[];
  photos: ResolvedMediaItem[];
  videos: ResolvedMediaItem[];
  featured: ResolvedMediaItem[];
  isDemoContent: boolean;
}

export type MediaSectionId = "spotlight" | "photos" | "videos" | "albums";
