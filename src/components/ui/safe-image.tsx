"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import {
  buildMonogramDataUri,
  sanitizeImageUrl,
  validateImageUrl,
} from "@/lib/anime/image-utils";

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: unknown;
  fallbackSrc?: unknown;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  fallbackSrc,
  fallbackLabel,
  alt = "",
  unoptimized,
  onError,
  ...rest
}: SafeImageProps) {
  const label = fallbackLabel || (typeof alt === "string" && alt ? alt : "DW");
  const sanitizedPrimary = sanitizeImageUrl(src, fallbackSrc, label);
  const [currentSrc, setCurrentSrc] = useState<string>(sanitizedPrimary);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(sanitizeImageUrl(src, fallbackSrc, label));
    setHasFailed(false);
  }, [src, fallbackSrc, label]);

  const isDataUri = currentSrc.startsWith("data:");

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      unoptimized={unoptimized ?? isDataUri}
      onError={(e) => {
        if (!hasFailed) {
          setHasFailed(true);
          const validFallback = validateImageUrl(fallbackSrc);
          if (validFallback && validFallback !== currentSrc) {
            setCurrentSrc(validFallback);
          } else {
            setCurrentSrc(buildMonogramDataUri(label));
          }
        }
        onError?.(e);
      }}
    />
  );
}
