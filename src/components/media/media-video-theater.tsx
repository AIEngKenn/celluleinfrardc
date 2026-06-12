"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Play, X } from "lucide-react";
import type { ResolvedMediaItem } from "@/lib/media/types";
import {
  formatMediaDate,
  getMediaCaption,
  getMediaTitle,
} from "@/lib/media/resolve-media";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/media/youtube";
import { MediaProgressiveImage } from "@/components/media/media-progressive-image";
import { MediaInfiniteSentinel } from "@/components/media/media-infinite-sentinel";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface MediaVideoTheaterProps {
  locale: string;
  videos: ResolvedMediaItem[];
  initialVideoId?: string | null;
  labels: {
    watchOnYoutube: string;
    closePlayer: string;
    reelLabel: string;
    loadingLabel: string;
  };
}

const ease = [0.22, 1, 0.36, 1] as const;
const VIDEO_REEL_PAGE_SIZE = 4;

export function MediaVideoTheater({ locale, videos, initialVideoId, labels }: MediaVideoTheaterProps) {
  const isFr = locale === "fr";
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<ResolvedMediaItem | null>(() => {
    if (initialVideoId) {
      const match = videos.find((video) => video.id === initialVideoId);
      if (match) {
        return match;
      }
    }
    return videos[0] ?? null;
  });
  const [isPlaying, setIsPlaying] = useState(Boolean(initialVideoId));
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { visibleItems: visibleReelVideos, sentinelRef, hasMore, isLoadingMore, loadedCount, totalCount } =
    useInfiniteScroll(videos, {
      pageSize: VIDEO_REEL_PAGE_SIZE,
      resetKey: "videos-reel",
      rootMargin: "120px 0px",
    });

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  const scrollReel = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>("[data-video-card]");
    const amount = (card?.offsetWidth ?? 280) + 16;
    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, videos.length]);

  useEffect(() => {
    if (initialVideoId) {
      const match = videos.find((video) => video.id === initialVideoId);
      if (match) {
        setActiveVideo(match);
        setIsPlaying(true);
      }
    }
  }, [initialVideoId, videos]);

  if (!videos.length || !activeVideo) {
    return null;
  }

  const activeTitle = getMediaTitle(activeVideo, locale);
  const activeCaption = getMediaCaption(activeVideo, locale);

  return (
    <div className="space-y-6">
      <motion.article
        className="overflow-hidden rounded-3xl bg-[#0a2540] shadow-[0_20px_60px_rgba(10,37,64,0.25)] ring-1 ring-white/10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {isPlaying && activeVideo.youtubeId ? (
            <>
              <iframe
                title={activeTitle}
                src={youtubeEmbedUrl(activeVideo.youtubeId, true)}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute right-3 top-3 z-10 ci-media-icon-btn ci-media-icon-btn--on-dark"
                aria-label={labels.closePlayer}
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="group relative block h-full w-full"
              aria-label={`${isFr ? "Lire" : "Play"}: ${activeTitle}`}
            >
              <MediaProgressiveImage
                src={activeVideo.thumbnailUrl || activeVideo.imageUrl}
                alt={activeTitle}
                width={1280}
                quality={75}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/90 via-[#0a2540]/30 to-[#0a2540]/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-rdc-blue shadow-2xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-9 w-9" fill="currentColor" />
                </span>
              </div>
            </button>
          )}
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-7">
          <div className="text-left">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
              {activeVideo.date ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatMediaDate(activeVideo.date, locale, "long")}
                </span>
              ) : null}
            </div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">{activeTitle}</h3>
            {activeCaption ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">{activeCaption}</p> : null}
          </div>
          {activeVideo.youtubeId ? (
            <a
              href={youtubeWatchUrl(activeVideo.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-fit items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {labels.watchOnYoutube}
            </a>
          ) : null}
        </div>
      </motion.article>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">{labels.reelLabel}</h3>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollReel("left")}
              disabled={!canScrollLeft}
              className="ci-news-carousel-btn"
              aria-label={isFr ? "Vidéo précédente" : "Previous video"}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollReel("right")}
              disabled={!canScrollRight}
              className="ci-news-carousel-btn"
              aria-label={isFr ? "Vidéo suivante" : "Next video"}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="ci-media-carousel-track"
          role="region"
          aria-roledescription={isFr ? "carrousel" : "carousel"}
          aria-label={labels.reelLabel}
          tabIndex={0}
        >
          {visibleReelVideos.map((video) => {
            const title = getMediaTitle(video, locale);
            const isActive = activeVideo.id === video.id;
            return (
              <button
                key={video.id}
                type="button"
                data-video-card
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  setActiveVideo(video);
                  setIsPlaying(false);
                }}
                className={`ci-media-video-card group ${isActive ? "ci-media-video-card--active" : ""}`}
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-900">
                  <MediaProgressiveImage
                    src={video.thumbnailUrl || video.imageUrl}
                    alt={title}
                    width={480}
                    quality={70}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 line-clamp-2 text-left text-sm font-semibold text-white">
                    {title}
                  </span>
                  {!isActive ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                      <Play className="h-8 w-8 text-white" fill="currentColor" />
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <MediaInfiniteSentinel
          sentinelRef={sentinelRef}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadingLabel={labels.loadingLabel}
          loadedCount={loadedCount}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
