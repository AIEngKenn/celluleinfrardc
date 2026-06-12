"use client";

import { motion } from "framer-motion";
import { Calendar, ZoomIn } from "lucide-react";
import type { ResolvedMediaItem } from "@/lib/media/types";
import {
  formatMediaDate,
  getMediaCaption,
  getMediaTitle,
} from "@/lib/media/resolve-media";
import { MediaLightboxTriggerIcon } from "@/components/media/media-lightbox";

interface MediaPhotoGridProps {
  locale: string;
  photos: ResolvedMediaItem[];
  onOpenPhoto: (index: number) => void;
  layoutLabel: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

const bentoPatterns = [
  "ci-media-bento-item--hero",
  "ci-media-bento-item--tall",
  "ci-media-bento-item--square",
  "ci-media-bento-item--wide",
  "ci-media-bento-item--square",
  "ci-media-bento-item--tall",
] as const;

export function MediaPhotoGrid({ locale, photos, onOpenPhoto, layoutLabel }: MediaPhotoGridProps) {
  const isFr = locale === "fr";

  if (!photos.length) {
    return null;
  }

  return (
    <div className="ci-media-bento" role="list" aria-label={layoutLabel}>
      {photos.map((photo, index) => {
        const pattern = bentoPatterns[index % bentoPatterns.length];
        const title = getMediaTitle(photo, locale);
        const caption = getMediaCaption(photo, locale);

        return (
          <motion.button
            key={photo.id}
            type="button"
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease, delay: (index % 6) * 0.04 }}
            onClick={() => onOpenPhoto(index)}
            className={`ci-media-bento-item group ${pattern}`}
            aria-label={`${isFr ? "Agrandir" : "Enlarge"}: ${title}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
              <div className="h-full w-full origin-center transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.05] group-focus-visible:scale-[1.03]">
                <img src={photo.imageUrl} alt={photo.imageAlt || title} className="h-full w-full object-cover" loading="lazy" />
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
  );
}
