"use client";

import type { RefObject } from "react";
import { useTranslations } from "next-intl";

interface MediaInfiniteSentinelProps {
  sentinelRef: RefObject<HTMLDivElement>;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadingLabel: string;
  loadedCount: number;
  totalCount: number;
}

export function MediaInfiniteSentinel({
  sentinelRef,
  hasMore,
  isLoadingMore,
  loadingLabel,
  loadedCount,
  totalCount,
}: MediaInfiniteSentinelProps) {
  const t = useTranslations("media");

  return (
    <div ref={sentinelRef} className="ci-media-infinite-sentinel" aria-live="polite">
      {hasMore ? (
        <div className={`ci-media-infinite-loader ${isLoadingMore ? "ci-media-infinite-loader--active" : ""}`}>
          <span className="ci-media-infinite-loader__dot" aria-hidden="true" />
          <span className="ci-media-infinite-loader__dot" aria-hidden="true" />
          <span className="ci-media-infinite-loader__dot" aria-hidden="true" />
          <span className="sr-only">{loadingLabel}</span>
        </div>
      ) : totalCount > 0 ? (
        <p className="ci-media-infinite-complete">
          {t("allContentLoaded", { loaded: loadedCount, total: totalCount })}
        </p>
      ) : null}
    </div>
  );
}
