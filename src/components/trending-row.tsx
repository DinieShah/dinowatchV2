"use client";

import { useRef } from "react";
import Link from "next/link";
import { AnimeCard } from "@/components/anime-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AnimeSummary } from "@/lib/types";

export function TrendingRow({
  title = "Trending Now",
  items,
  seeAllHref = "/discover",
}: {
  title?: string;
  items: AnimeSummary[];
  seeAllHref?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const arrow =
    "grid h-9 w-9 place-items-center rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] font-mono text-sm text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] cursor-pointer";

  return (
    <section className="py-6 border-b border-white/[0.12] last:border-b-0">
      <SectionHeader
        title={title}
        action={
          <div className="flex items-center gap-3">
            <Link
              href={seeAllHref}
              className="font-mono text-xs text-ink-muted transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:text-ink"
            >
              View all →
            </Link>
            <div className="hidden gap-1.5 sm:flex">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollBy(-1)}
                className={arrow}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollBy(1)}
                className={arrow}
              >
                ›
              </button>
            </div>
          </div>
        }
      />

      <div
        ref={scrollerRef}
        className="no-scrollbar edge-fade flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:gap-5 sm:px-6"
      >
        {items.map((anime) => (
          <div
            key={anime.id}
            className="w-[150px] shrink-0 snap-start sm:w-[178px]"
          >
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </section>
  );
}
