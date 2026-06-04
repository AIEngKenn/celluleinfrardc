/**
 * Self-hosted placeholder images served from /public.
 * Used for demo content and as fallbacks when CMS assets are missing.
 */
export const PLACEHOLDER_IMAGES = {
  hero: [
    '/images/placeholders/hero-1.svg',
    '/images/placeholders/hero-2.svg',
    '/images/placeholders/hero-3.svg',
  ],
  projectFeatured: '/images/placeholders/project-1.svg',
  projectRoad: '/images/placeholders/project-1.svg',
  projectEnergy: '/images/placeholders/project-2.svg',
  projectAirport: '/images/placeholders/project-3.svg',
  newsFeatured: '/images/placeholders/news-1.svg',
  newsFinancing: '/images/placeholders/news-2.svg',
  media: [
    '/images/placeholders/media-1.svg',
    '/images/placeholders/media-2.svg',
    '/images/placeholders/media-3.svg',
    '/images/placeholders/media-4.svg',
    '/images/placeholders/media-5.svg',
    '/images/placeholders/media-6.svg',
  ],
  defaultCover: '/images/placeholders/default-cover.svg',
} as const;

type SanityImageRef = { asset?: { url?: string | null } | null } | null | undefined;

/** Returns a CMS image URL or a local placeholder when missing. */
export function sanityImageUrl(
  image: SanityImageRef,
  fallback: string = PLACEHOLDER_IMAGES.defaultCover
): string {
  const url = image?.asset?.url;
  return url && url.length > 0 ? url : fallback;
}
