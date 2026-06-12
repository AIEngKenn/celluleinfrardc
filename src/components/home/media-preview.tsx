"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Film,
  FolderOpen,
  ImageIcon,
  Images,
  Play,
} from "lucide-react";
import type { HomeMediaPreviewData } from "@/lib/media/resolve-home-media-preview";
import { getAlbumTitle, getMediaTitle } from "@/lib/media/resolve-media";
import {
  mediathequeAlbumHref,
  mediathequeItemHref,
  mediathequeSectionHref,
  mediathequeSpotlightHref,
} from "@/lib/media/media-urls";
import { MediaProgressiveImage } from "@/components/media/media-progressive-image";
import CountUp from "@/components/ui/count-up";

const ease = [0.22, 1, 0.36, 1] as const;

interface MediaPreviewProps {
  preview: HomeMediaPreviewData;
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

function TricolourStripe() {
  return (
    <div className="flex h-[3px] w-full" aria-hidden="true">
      <span className="flex-1 bg-rdc-blue" />
      <span className="flex-1 bg-rdc-yellow" />
      <span className="flex-1 bg-rdc-red" />
    </div>
  );
}

export function MediaPreview({
  preview,
  titleFr,
  titleEn,
  descriptionFr,
  descriptionEn,
}: MediaPreviewProps) {
  const tSections = useTranslations("home.sections");
  const tMedia = useTranslations("media");
  const locale = useLocale();
  const isFr = locale === "fr";

  const { spotlight, tiles, albums, photoCount, videoCount, albumCount } = preview;
  const mosaicTiles = tiles.filter((item) => item.id !== spotlight?.id).slice(0, 4);

  const sectionTitle = (isFr ? titleFr : titleEn) || tSections("media");
  const sectionDescription =
    (isFr ? descriptionFr : descriptionEn) ||
    (isFr
      ? "Photos, vidéos et albums des chantiers — comme sur la médiathèque officielle."
      : "Photos, videos and albums from the field — just like the official media center.");

  const statLinks = [
    {
      value: photoCount,
      label: tMedia("photos"),
      icon: ImageIcon,
      href: mediathequeSectionHref(locale, "photos"),
    },
    {
      value: videoCount,
      label: tMedia("videos"),
      icon: Film,
      href: mediathequeSectionHref(locale, "videos"),
    },
    {
      value: albumCount,
      label: tMedia("albums"),
      icon: FolderOpen,
      href: mediathequeSectionHref(locale, "albums"),
    },
  ] as const;

  return (
    <section
      className="overflow-hidden bg-[#f9fafb] py-16 sm:py-20"
      aria-labelledby="home-media-heading"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">
              {tMedia("statsEyebrow")}
            </span>
            <h2 id="home-media-heading" className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              {sectionTitle}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">{sectionDescription}</p>
          </div>

          <Link
            href={mediathequeSectionHref(locale, "spotlight")}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-rdc-blue transition-all hover:gap-3"
          >
            {tMedia("viewGallery")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="overflow-hidden rounded-3xl bg-[#17418a] shadow-[0_16px_50px_rgba(10,37,64,0.18)] ring-1 ring-white/10">
              <TricolourStripe />

              <div className="p-6 sm:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow">
                  {tMedia("statsTitle")}
                </span>
                <p className="mt-3 text-lg font-bold leading-snug text-white sm:text-xl">
                  {isFr
                    ? "Explorez chantiers, inaugurations et reportages"
                    : "Explore sites, inaugurations and field reports"}
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  {isFr
                    ? "Diaporamas, galeries thématiques et vidéos en un seul espace."
                    : "Slideshows, thematic albums and videos in one place."}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10">
                  {statLinks.map((stat) => (
                    <Link
                      key={stat.label}
                      href={stat.href}
                      className="bg-[#17418a] px-2 py-3 text-center transition-colors hover:bg-[#1a4a9a] sm:px-3 sm:py-4"
                      aria-label={`${stat.label} — ${isFr ? "ouvrir la section" : "open section"}`}
                    >
                      <stat.icon className="mx-auto mb-1 h-4 w-4 text-rdc-yellow" aria-hidden="true" />
                      <div className="text-xl font-bold tabular-nums text-white sm:text-2xl">
                        <CountUp end={stat.value} duration={1.4} decimals={0} />
                      </div>
                      <p className="mt-0.5 text-[10px] text-blue-100 sm:text-xs">{stat.label}</p>
                    </Link>
                  ))}
                </div>

                {albums.length > 0 ? (
                  <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      {isFr ? "Albums récents" : "Recent albums"}
                    </p>
                    {albums.map((album) => (
                      <Link
                        key={album.id}
                        href={mediathequeAlbumHref(locale, album.slug)}
                        className="flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                      >
                        <Images className="h-3.5 w-3.5 shrink-0 text-rdc-yellow" aria-hidden="true" />
                        <span className="line-clamp-1">{getAlbumTitle(album, locale)}</span>
                        <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                ) : null}

                <Link
                  href={mediathequeSectionHref(locale, "spotlight")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-all hover:gap-3"
                >
                  {tMedia("viewGallery")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease, delay: 0.06 }}
          >
            <div className="ci-home-media-mosaic">
              {spotlight ? (
                <Link
                  href={mediathequeSpotlightHref(locale, spotlight)}
                  className="ci-home-media-mosaic__hero group relative overflow-hidden rounded-2xl bg-gray-900 sm:rounded-3xl"
                  aria-label={getMediaTitle(spotlight, locale)}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                    <div className="h-full w-full origin-center transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.04]">
                      <MediaProgressiveImage
                        src={spotlight.imageUrl}
                        alt={spotlight.imageAlt || getMediaTitle(spotlight, locale)}
                        width={960}
                        priority
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/25 to-transparent" />
                  {spotlight.type === "video" ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-rdc-blue shadow-xl transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-7 w-7" fill="currentColor" />
                      </span>
                    </span>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className="mb-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {isFr ? "À la une" : "Spotlight"}
                    </span>
                    <p className="line-clamp-2 text-base font-bold text-white sm:text-lg">
                      {getMediaTitle(spotlight, locale)}
                    </p>
                  </div>
                </Link>
              ) : null}

              {mosaicTiles.map((item, index) => (
                <Link
                  key={item.id}
                  href={mediathequeItemHref(locale, item)}
                  className={`ci-home-media-mosaic__tile group relative overflow-hidden rounded-2xl bg-gray-200 ${
                    index === 0 ? "ci-home-media-mosaic__tile--tall" : ""
                  }`}
                  aria-label={getMediaTitle(item, locale)}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                    <div className="h-full w-full origin-center transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                      <MediaProgressiveImage
                        src={item.imageUrl}
                        alt={item.imageAlt || getMediaTitle(item, locale)}
                        width={index === 0 ? 520 : 400}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 to-transparent opacity-90" />
                  {item.type === "video" ? (
                    <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rdc-blue shadow">
                      <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                    </span>
                  ) : null}
                  <p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-xs font-semibold text-white sm:text-sm">
                    {getMediaTitle(item, locale)}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 lg:hidden">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={mediathequeAlbumHref(locale, album.slug)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm"
                >
                  <Images className="h-3.5 w-3.5 text-rdc-blue" />
                  {getAlbumTitle(album, locale)}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
