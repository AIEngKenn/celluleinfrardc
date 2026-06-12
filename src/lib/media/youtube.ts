/**
 * YouTube URL helpers for médiathèque video embeds and thumbnails.
 */

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

/**
 * Extracts a YouTube video ID from a standard watch, embed, shorts, or youtu.be URL.
 */
export function extractYoutubeId(url: string): string | null {
  if (!url) {
    return null;
  }
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match?.[1] ?? null;
}

/**
 * Builds a privacy-enhanced embed URL for inline playback.
 */
export function youtubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) {
    params.set("autoplay", "1");
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Returns a YouTube-hosted thumbnail URL for a given video ID.
 */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Returns a standard YouTube watch URL.
 */
export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
