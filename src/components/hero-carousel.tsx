"use client";

import { useCallback, useEffect, useState } from "react";
import { FeaturedEpisodeCard } from "@/components/featured-episode-card";
import { SafeImage } from "@/components/ui/safe-image";
import type { AnimeStatus } from "@/lib/types";

export interface HeroSlide {
  id: string;
  title: string;
  bannerImage: string;
  posterImage: string;
  synopsis?: string;
  score?: number;
  year?: number;
  episodeCount?: number;
  genres: string[];
  status: AnimeStatus;
  watchHref: string;
  detailHref: string;
}

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(
      () => setActive((i) => (i + 1) % count),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [count, paused]);

  const current = slides[active];
  if (!current) return null;

  const arrowClass =
    "grid h-11 w-11 place-items-center rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] font-mono text-base text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] cursor-pointer";

  return (
    <section
      className="relative min-h-[560px] w-full overflow-hidden border-b border-white/[0.12] bg-white/[0.06] backdrop-blur-md sm:h-[78vh] sm:min-h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Crossfading banners */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <SafeImage
            src={slide.bannerImage}
            fallbackSrc={slide.posterImage}
            fallbackLabel={slide.title}
            alt=""
            fill
            priority={i === 0}
            quality={90}
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      ))}

      {/* Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
        <FeaturedEpisodeCard slide={current} rank={active + 1} />

        {count > 1 && (
          <div className="mt-6 flex items-end justify-between gap-4">
            {/* Arrows + counter */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => go(-1)}
                  className={arrowClass}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => go(1)}
                  className={arrowClass}
                >
                  ›
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-3 py-2 font-mono text-xs font-medium tabular-nums text-ink-muted">
                <span className="text-ink">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-12 bg-white/20">
                  <span
                    className="block h-px bg-accent transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ width: `${((active + 1) / count) * 100}%` }}
                  />
                </span>
                <span>{String(count).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Thumbnail strip (desktop) */}
            <div className="hidden items-center gap-2.5 lg:flex">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${slide.title}`}
                  aria-current={i === active}
                  className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-[2px] border bg-white/[0.06] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] cursor-pointer ${
                    i === active
                      ? "border-accent ring-1 ring-inset ring-accent/50 opacity-100 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                      : "border-white/[0.12] opacity-60 hover:opacity-100"
                  }`}
                >
                  <SafeImage
                    src={slide.bannerImage}
                    fallbackSrc={slide.posterImage}
                    fallbackLabel={slide.title}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
