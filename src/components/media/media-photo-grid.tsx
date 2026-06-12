"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { ResolvedMediaItem } from "@/lib/media/types";
import {
  formatMediaDate,
  getMediaCaption,
  getMediaTitle,
} from "@/lib/media/resolve-media";
import { MediaLightboxTriggerIcon } from "@/components/media/media-lightbox";
import { MediaProgressiveImage } from "@/components/media/media-progressive-image";
import { MediaInfiniteSentinel } from "@/components/media/media-infinite-sentinel";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface MediaPhotoGridProps {
  locale: string;
  photos: ResolvedMediaItem[];
  onOpenPhoto: (index: number) => void;
  layoutLabel: string;
  resetKey?: string;
  loadingLabel: string;
}

const ease = [0.22, 1, 0.36, 1] as const;
const PHOTOS_PAGE_SIZE = 8;

const bentoPatterns = [
  "ci-media-bento-item--hero",
  "ci-media-bento-item--tall",
  "ci-media-bento-item--square",
  "ci-media-bento-item--wide",
  "ci-media-bento-item--square",
  "ci-media-bento-item--tall",
] as const;

const bentoWidths = [960, 720, 640, 880, 640, 720] as const;

export function MediaPhotoGrid({
  locale,
  photos,
  onOpenPhoto,
  layoutLabel,
  resetKey = "all",
  loadingLabel,
}: MediaPhotoGridProps) {
  const isFr = locale === "fr";
  const { visibleItems, sentinelRef, hasMore, isLoadingMore, loadedCount, totalCount } =
    useInfiniteScroll(photos, {
      pageSize: PHOTOS_PAGE_SIZE,
      resetKey,
    });

  if (!photos.length) {
    return null;
  }

  return (
    <>
      <div className="ci-media-bento" role="list" aria-label={layoutLabel}>
        {visibleItems.map((photo, index) => {
          const pattern = bentoPatterns[index % bentoPatterns.length];
          const imageWidth = bentoWidths[index % bentoWidths.length];
          const title = getMediaTitle(photo, locale);
          const caption = getMediaCaption(photo, locale);
          const isPriority = index < 2;

          return (
            <motion.button
              key={photo.id}
              type="button"
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, ease, delay: Math.min(index % PHOTOS_PAGE_SIZE, 4) * 0.03 }}
              onClick={() => onOpenPhoto(index)}
              className={`ci-media-bento-item group ${pattern}`}
              aria-label={`${isFr ? "Agrandir" : "Enlarge"}: ${title}`}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="h-full w-full origin-center transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.05] group-focus-visible:scale-[1.03]">
                  <MediaProgressiveImage
                    src={photo.imageUrl}
                    alt={photo.imageAlt || title}
                    width={imageWidth}
                    priority={isPriority}
                  />
                </div>
              </div>

              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-gray-900/85 via-gray-900/15 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
                {photo.date ? (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {formatMediaDate(photo.date, locale)}
                  </span>
                ) : null}
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">{title}</h3>
                {caption ? <p className="mt-1 line-clamp-2 text-xs text-white/75 sm:text-sm">{caption}</p> : null}
              </div>

              <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 group-focus-visible:opacity-100">
                <MediaLightboxTriggerIcon />
              </span>
            </motion.button>
          );
        })}
      </div>

      <MediaInfiniteSentinel
        sentinelRef={sentinelRef}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        loadingLabel={loadingLabel}
        loadedCount={loadedCount}
        totalCount={totalCount}
      />
    </>
  );
}
