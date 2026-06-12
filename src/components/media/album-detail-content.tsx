"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Home,
  LayoutGrid,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ResolvedMediaAlbum, ResolvedMediaItem } from "@/lib/media/types";
import {
  formatMediaDate,
  getAlbumDescription,
  getAlbumTitle,
  getMediaCaption,
  getMediaTitle,
} from "@/lib/media/resolve-media";
import { MediaLightbox } from "@/components/media/media-lightbox";

interface AlbumDetailContentProps {
  locale: string;
  album: ResolvedMediaAlbum;
}

const ease = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 48;

function TricolourStripe() {
  return (
    <div className="flex h-[3px] w-full" aria-hidden="true">
      <span className="flex-1 bg-rdc-blue" />
      <span className="flex-1 bg-rdc-yellow" />
      <span className="flex-1 bg-rdc-red" />
    </div>
  );
}

export function AlbumDetailContent({ locale, album }: AlbumDetailContentProps) {
  const t = useTranslations("media");
  const isFr = locale === "fr";
  const photos = album.items.filter((item) => item.type === "image");
  const [viewMode, setViewMode] = useState<"slideshow" | "grid">("slideshow");
  const [slideIndex, setSlideIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const title = getAlbumTitle(album, locale);
  const description = getAlbumDescription(album, locale);
  const current = photos[slideIndex];

  const goToSlide = useCallback(
    (direction: "prev" | "next") => {
      setSlideIndex((prev) => {
        if (direction === "prev") {
          return prev <= 0 ? photos.length - 1 : prev - 1;
        }
        return prev >= photos.length - 1 ? 0 : prev + 1;
      });
    },
    [photos.length]
  );

  useEffect(() => {
    if (viewMode !== "slideshow") {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToSlide("prev");
      }
      if (event.key === "ArrowRight") {
        goToSlide("next");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode, goToSlide]);

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
    goToSlide(delta > 0 ? "prev" : "next");
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <TricolourStripe />

      <header className="relative overflow-hidden bg-[#0a2540]">
        <div className="absolute inset-0">
          <img src={album.coverUrl} alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540] via-[#0a2540]/85 to-[#0a2540]/70" />
        </div>

        <div className="relative mx-auto max-w-[1360px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            <Link href={`/${locale}`} className="hover:text-white" aria-label={isFr ? "Accueil" : "Home"}>
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRightIcon className="h-4 w-4 opacity-50" aria-hidden="true" />
            <Link href={`/${locale}/mediatheque`} className="hover:text-white">
              {t("title")}
            </Link>
            <ChevronRightIcon className="h-4 w-4 opacity-50" aria-hidden="true" />
            <span className="font-medium text-white">{title}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow">{t("albums")}</span>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
              {description ? <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">{description}</p> : null}
              {album.date ? (
                <p className="mt-4 text-sm text-white/55">{formatMediaDate(album.date, locale, "long")}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/mediatheque`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("backToMediatheque")}
              </Link>
              <div className="inline-flex rounded-full bg-white/10 p-1 backdrop-blur-sm" role="group" aria-label={t("viewMode")}>
                <ViewModeButton
                  active={viewMode === "slideshow"}
                  onClick={() => setViewMode("slideshow")}
                  label={t("slideshow")}
                  icon={<LayoutGrid className="h-4 w-4" />}
                />
                <ViewModeButton
                  active={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  label={t("gridView")}
                  icon={<Grid3X3 className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {viewMode === "slideshow" && current ? (
          <section
            aria-roledescription={isFr ? "diaporama" : "slideshow"}
            aria-label={title}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative overflow-hidden rounded-3xl bg-black shadow-[0_20px_60px_rgba(10,37,64,0.2)]">
              <AnimatePresence mode="wait">
                <motion.button
                  key={current.id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  onClick={() => openLightbox(slideIndex)}
                  className="relative block aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[16/9]"
                  aria-label={`${isFr ? "Agrandir" : "Enlarge"}: ${getMediaTitle(current, locale)}`}
                >
                  <img
                    src={current.imageUrl}
                    alt={current.imageAlt || getMediaTitle(current, locale)}
                    className="h-full w-full object-contain bg-black"
                  />
                </motion.button>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => goToSlide("prev")}
                className="ci-media-lightbox-nav ci-media-lightbox-nav--prev absolute left-3 top-1/2 z-10 -translate-y-1/2"
                aria-label={t("lightbox.previous")}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => goToSlide("next")}
                className="ci-media-lightbox-nav ci-media-lightbox-nav--next absolute right-3 top-1/2 z-10 -translate-y-1/2"
                aria-label={t("lightbox.next")}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">{getMediaTitle(current, locale)}</p>
                {getMediaCaption(current, locale) ? (
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">{getMediaCaption(current, locale)}</p>
                ) : null}
              </div>
              <p className="text-sm font-medium text-gray-500">
                {slideIndex + 1} {t("lightbox.of")} {photos.length}
              </p>
            </div>

            <div
              className="ci-media-carousel-track mt-6"
              role="tablist"
              aria-label={isFr ? "Photos de l'album" : "Album photos"}
            >
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  role="tab"
                  aria-selected={index === slideIndex}
                  onClick={() => setSlideIndex(index)}
                  className={`ci-media-album-thumb ${index === slideIndex ? "ci-media-album-thumb--active" : ""}`}
                >
                  <img src={photo.imageUrl} alt={getMediaTitle(photo, locale)} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <motion.button
                key={photo.id}
                type="button"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease, delay: (index % 8) * 0.03 }}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                aria-label={getMediaTitle(photo, locale)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.imageAlt || getMediaTitle(photo, locale)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <MediaLightbox
        items={photos}
        initialIndex={lightboxIndex}
        locale={locale}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        labels={{
          previous: t("lightbox.previous"),
          next: t("lightbox.next"),
          close: t("lightbox.close"),
          of: t("lightbox.of"),
          download: t("lightbox.download"),
        }}
      />
    </div>
  );
}

function ViewModeButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-white text-[#0a2540]" : "text-white/80 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
