"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ZoomIn,
} from "lucide-react";
import type { ResolvedMediaItem } from "@/lib/media/types";
import {
  formatMediaDate,
  getMediaCaption,
  getMediaTitle,
} from "@/lib/media/resolve-media";

interface MediaLightboxProps {
  items: ResolvedMediaItem[];
  initialIndex: number;
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: {
    previous: string;
    next: string;
    close: string;
    of: string;
    download: string;
  };
}

const SWIPE_THRESHOLD = 48;

export function MediaLightbox({
  items,
  initialIndex,
  locale,
  open,
  onOpenChange,
  labels,
}: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const isFr = locale === "fr";

  const photoItems = items.filter((item) => item.type === "image");
  const current = photoItems[index];
  const total = photoItems.length;

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
    }
  }, [open, initialIndex]);

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      setIndex((prev) => {
        if (direction === "prev") {
          return prev <= 0 ? total - 1 : prev - 1;
        }
        return prev >= total - 1 ? 0 : prev + 1;
      });
    },
    [total]
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo("prev");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo("next");
      }
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, goTo, onOpenChange]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }
    goTo(delta > 0 ? "prev" : "next");
  };

  if (!current || total === 0) {
    return null;
  }

  const title = getMediaTitle(current, locale);
  const caption = getMediaCaption(current, locale);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[101] flex flex-col outline-none"
          aria-describedby="media-lightbox-caption"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>

          <header className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
              <p className="text-xs text-white/60">
                {index + 1} {labels.of} {total}
                {current.date ? ` · ${formatMediaDate(current.date, locale)}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={current.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="ci-media-icon-btn"
                aria-label={labels.download}
              >
                <Download className="h-5 w-5" aria-hidden="true" />
              </a>
              <DialogPrimitive.Close className="ci-media-icon-btn" aria-label={labels.close}>
                <X className="h-5 w-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
          </header>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-10">
            <button
              type="button"
              onClick={() => goTo("prev")}
              className="ci-media-lightbox-nav ci-media-lightbox-nav--prev hidden sm:inline-flex"
              aria-label={labels.previous}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-2xl sm:rounded-3xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.id}
                  src={current.imageUrl}
                  alt={current.imageAlt || title}
                  className="ci-media-lightbox-image"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => goTo("next")}
              className="ci-media-lightbox-nav ci-media-lightbox-nav--next hidden sm:inline-flex"
              aria-label={labels.next}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <footer
            id="media-lightbox-caption"
            className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6"
          >
            {caption ? (
              <p className="mx-auto max-w-3xl text-center text-sm leading-6 text-white/80">{caption}</p>
            ) : null}
            {current.projectSlug ? (
              <p className="mt-2 text-center text-xs text-white/50">
                {isFr ? "Projet lié" : "Related project"} ·{" "}
                {locale === "fr" ? current.projectTitleFr : current.projectTitleEn}
              </p>
            ) : null}

            <div className="mt-4 flex justify-center gap-2 sm:hidden">
              <button type="button" onClick={() => goTo("prev")} className="ci-media-pill-btn" aria-label={labels.previous}>
                <ChevronLeft className="h-4 w-4" />
                {labels.previous}
              </button>
              <button type="button" onClick={() => goTo("next")} className="ci-media-pill-btn" aria-label={labels.next}>
                {labels.next}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label={isFr ? "Miniatures" : "Thumbnails"}>
              {photoItems.map((item, thumbIndex) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={thumbIndex === index}
                  aria-label={getMediaTitle(item, locale)}
                  onClick={() => setIndex(thumbIndex)}
                  className={`ci-media-lightbox-thumb ${thumbIndex === index ? "ci-media-lightbox-thumb--active" : ""}`}
                >
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function MediaLightboxTriggerIcon() {
  return <ZoomIn className="h-4 w-4" aria-hidden="true" />;
}
