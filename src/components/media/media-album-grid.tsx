"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Images } from "lucide-react";
import type { ResolvedMediaAlbum } from "@/lib/media/types";
import {
  formatMediaDate,
  getAlbumDescription,
  getAlbumTitle,
} from "@/lib/media/resolve-media";
import { MediaProgressiveImage } from "@/components/media/media-progressive-image";
import { MediaInfiniteSentinel } from "@/components/media/media-infinite-sentinel";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { getOptimizedMediaUrl } from "@/lib/media/image-url";

interface MediaAlbumGridProps {
  locale: string;
  albums: ResolvedMediaAlbum[];
  photosLabel: string;
  openAlbumLabel: string;
  loadingLabel: string;
}

const ease = [0.22, 1, 0.36, 1] as const;
const ALBUMS_PAGE_SIZE = 4;

export function MediaAlbumGrid({
  locale,
  albums,
  photosLabel,
  openAlbumLabel,
  loadingLabel,
}: MediaAlbumGridProps) {
  const isFr = locale === "fr";
  const { visibleItems, sentinelRef, hasMore, isLoadingMore, loadedCount, totalCount } =
    useInfiniteScroll(albums, {
      pageSize: ALBUMS_PAGE_SIZE,
      resetKey: "albums",
    });

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {visibleItems.map((album, index) => {
          const title = getAlbumTitle(album, locale);
          const description = getAlbumDescription(album, locale);
          const previewItems = album.items.filter((item) => item.type === "image").slice(0, 3);

          return (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, ease, delay: Math.min(index % ALBUMS_PAGE_SIZE, 3) * 0.04 }}
            >
              <Link
                href={`/${locale}/mediatheque/${album.slug}`}
                className="group block overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(10,37,64,0.08)] ring-1 ring-gray-200/80 transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(10,37,64,0.14)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <div className="absolute inset-0">
                    <MediaProgressiveImage
                      src={album.coverUrl}
                      alt={album.coverAlt || title}
                      width={880}
                      priority={index < 2}
                    />
                  </div>

                  {previewItems.length > 1 ? (
                    <div className="absolute bottom-4 right-4 flex -space-x-3" aria-hidden="true">
                      {previewItems.slice(1).map((item, stackIndex) => (
                        <div
                          key={item.id}
                          className="h-16 w-12 overflow-hidden rounded-lg border-2 border-white shadow-lg sm:h-20 sm:w-14"
                          style={{ transform: `rotate(${(stackIndex + 1) * 4}deg)` }}
                        >
                          <img
                            src={getOptimizedMediaUrl(item.imageUrl, { width: 240, quality: 70 })}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-gray-900">
                      <Images className="h-3.5 w-3.5 text-rdc-blue" />
                      {album.itemCount} {photosLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-rdc-blue sm:text-xl">
                    {title}
                  </h3>
                  {description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{description}</p>
                  ) : null}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    {album.date ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatMediaDate(album.date, locale, "long")}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-rdc-blue transition-all group-hover:gap-3">
                      {openAlbumLabel}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
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
