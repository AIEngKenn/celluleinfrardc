"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, ImageIcon, Film } from "lucide-react";
import type { ResolvedMediaItem } from "@/lib/media/types";
import {
  formatMediaDate,
  getMediaCaption,
  getMediaTitle,
} from "@/lib/media/resolve-media";
import { youtubeEmbedUrl } from "@/lib/media/youtube";
import { preloadMediaImage } from "@/lib/media/image-url";
import { MediaProgressiveImage } from "@/components/media/media-progressive-image";

interface MediaHeroShowcaseProps {
  locale: string;
  items: ResolvedMediaItem[];
  initialItemId?: string | null;
  onOpenPhoto: (index: number) => void;
  onSelectVideo: (item: ResolvedMediaItem) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function MediaHeroShowcase({
  locale,
  items,
  initialItemId,
  onOpenPhoto,
  onSelectVideo,
}: MediaHeroShowcaseProps) {
  const isFr = locale === "fr";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const showcaseItems = items.slice(0, 6);
  const current = showcaseItems[activeIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setPlayingVideo(false);
  }, [activeIndex]);

  useEffect(() => {
    if (!initialItemId) {
      return;
    }
    const index = showcaseItems.findIndex((item) => item.id === initialItemId);
    if (index < 0) {
      return;
    }
    setActiveIndex(index);
    const item = showcaseItems[index];
    if (item?.type === "video") {
      setPlayingVideo(true);
    }
  }, [initialItemId, showcaseItems]);

  useEffect(() => {
    const nextItem = showcaseItems[(activeIndex + 1) % showcaseItems.length];
    if (nextItem && nextItem.type === "image") {
      preloadMediaImage(nextItem.imageUrl, 1400);
    }
  }, [activeIndex, showcaseItems]);

  useEffect(() => {
    if (showcaseItems.length <= 1 || isPaused || prefersReducedMotion) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [showcaseItems.length, isPaused, prefersReducedMotion]);

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      setActiveIndex((prev) => {
        if (direction === "prev") {
          return prev <= 0 ? showcaseItems.length - 1 : prev - 1;
        }
        return prev >= showcaseItems.length - 1 ? 0 : prev + 1;
      });
    },
    [showcaseItems.length]
  );

  if (!current) {
    return null;
  }

  const title = getMediaTitle(current, locale);
  const caption = getMediaCaption(current, locale);
  const isVideo = current.type === "video";

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription={isFr ? "carrousel principal" : "main carousel"}
      aria-label={isFr ? "Sélection à la une" : "Featured selection"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative min-h-[58vh] sm:min-h-[68vh] lg:min-h-[72vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            {isVideo && playingVideo && current.youtubeId ? (
              <iframe
                title={title}
                src={youtubeEmbedUrl(current.youtubeId, true)}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0">
                <MediaProgressiveImage
                  src={current.imageUrl}
                  alt={current.imageAlt || title}
                  width={1400}
                  quality={75}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/45 to-gray-900/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-transparent" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex h-full min-h-[58vh] max-w-[1360px] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[68vh] sm:px-6 sm:pb-10 lg:min-h-[72vh] lg:px-8 lg:pb-12">
          <div className="max-w-3xl text-left">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {isVideo ? <Film className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                {isVideo ? (isFr ? "Vidéo" : "Video") : isFr ? "Photo" : "Photo"}
              </span>
              {current.date ? (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                  {formatMediaDate(current.date, locale, "long")}
                </span>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease }}
              >
                <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
                {caption ? (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">{caption}</p>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap gap-3">
              {isVideo ? (
                <button
                  type="button"
                  onClick={() => {
                    if (current.youtubeId) {
                      setPlayingVideo(true);
                      onSelectVideo(current);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-rdc-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rdc-blue/90"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                  {isFr ? "Lire la vidéo" : "Play video"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const photoIndex = items.findIndex((item) => item.id === current.id);
                    if (photoIndex >= 0) {
                      onOpenPhoto(photoIndex);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
                >
                  {isFr ? "Ouvrir en plein écran" : "Open fullscreen"}
                </button>
              )}
              {current.projectSlug ? (
                <Link
                  href={`/${locale}/projets/${current.projectSlug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {isFr ? "Voir le projet" : "View project"}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {showcaseItems.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`${getMediaTitle(item, locale)} (${dotIndex + 1}/${showcaseItems.length})`}
                  aria-current={dotIndex === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(dotIndex)}
                  className={`h-2 rounded-full transition-all ${
                    dotIndex === activeIndex ? "w-8 bg-rdc-yellow" : "w-2 bg-white/35 hover:bg-white/55"
                  }`}
                />
              ))}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button type="button" onClick={() => goTo("prev")} className="ci-media-icon-btn ci-media-icon-btn--on-dark" aria-label={isFr ? "Précédent" : "Previous"}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => goTo("next")} className="ci-media-icon-btn ci-media-icon-btn--on-dark" aria-label={isFr ? "Suivant" : "Next"}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
