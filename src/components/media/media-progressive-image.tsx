"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOptimizedMediaUrl } from "@/lib/media/image-url";

interface MediaProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  quality?: number;
  priority?: boolean;
}

export function MediaProgressiveImage({
  src,
  alt,
  className,
  width = 800,
  quality = 72,
  priority = false,
}: MediaProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedSrc = getOptimizedMediaUrl(src, { width, quality });

  useEffect(() => {
    setIsLoaded(false);
  }, [optimizedSrc]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200/80">
      <div
        className={cn(
          "ci-media-image-skeleton absolute inset-0 transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
        aria-hidden="true"
      />
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={Math.round(width * 0.75)}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500 ease-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}
