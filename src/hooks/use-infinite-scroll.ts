"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  pageSize?: number;
  rootMargin?: string;
  resetKey?: string | number;
}

/**
 * Progressively reveals list items as the user scrolls near the sentinel.
 */
export function useInfiniteScroll<T>(
  items: T[],
  {
    pageSize = 8,
    rootMargin = "280px 0px",
    resetKey = "default",
  }: UseInfiniteScrollOptions = {}
) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadTimerRef = useRef<number | null>(null);

  const totalCount = items.length;
  const hasMore = visibleCount < totalCount;
  const visibleItems = items.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
  }, [items, pageSize, resetKey]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    setIsLoadingMore(true);
    loadTimerRef.current = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + pageSize, totalCount));
      setIsLoadingMore(false);
    }, 120);
  }, [hasMore, isLoadingMore, pageSize, totalCount]);

  useEffect(() => {
    return () => {
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, rootMargin, visibleCount]);

  return {
    visibleItems,
    sentinelRef,
    hasMore,
    isLoadingMore,
    loadedCount: visibleCount,
    totalCount,
  };
}
