/**
 * Returns a bandwidth-friendly image URL for grid, hero, or thumbnail contexts.
 */
export function getOptimizedMediaUrl(
  url: string,
  options: { width?: number; quality?: number } = {}
): string {
  const { width = 800, quality = 72 } = options;

  if (!url) {
    return url;
  }

  if (url.includes("images.unsplash.com")) {
    const base = url.split("?")[0] ?? url;
    return `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  if (url.includes("cdn.sanity.io")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=${width}&q=${quality}&auto=format`;
  }

  if (url.includes("img.youtube.com") && width <= 640) {
    return url.replace("maxresdefault.jpg", "hqdefault.jpg");
  }

  return url;
}

/**
 * Preloads an image in the background (for hero carousel transitions).
 */
export function preloadMediaImage(url: string, width = 1400): void {
  if (typeof window === "undefined" || !url) {
    return;
  }
  const img = new window.Image();
  img.decoding = "async";
  img.src = getOptimizedMediaUrl(url, { width, quality: 75 });
}
