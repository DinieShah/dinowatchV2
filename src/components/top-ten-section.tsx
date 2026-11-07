"use client";

import { useRef, useState } from "react";
import { AnimeCard } from "@/components/anime-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { AnimeSummary } from "@/lib/types";

type Period = "day" | "week" | "month";

const PERIODS: { key: Period; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

export function TopTenSection({
  data,
}: {
  data: Record<Period, AnimeSummary[]>;
}) {
  const [period, setPeriod] = useState<Period>("day");
  const items = data[period].slice(0, 10);
  const scrollerRef = useRef<HTMLOListElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const arrow =
    "grid h-9 w-9 place-items-center rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] font-mono text-sm text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] cursor-pointer";

  return (
    <section className="py-6 border-b border-white/[0.12]">
      <SectionHeader
        title="Top 10 Anime"
        action={
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-1">
              {PERIODS.map((p) => {
                const active = p.key === period;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPeriod(p.key)}
                    aria-pressed={active}
                    className={`rounded-[2px] px-3 py-1 font-mono text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                      active
                        ? "bg-ink text-paper"
                        : "text-ink-muted hover:scale-[1.02] hover:bg-white/[0.12] hover:text-ink"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            {items.length > 0 && (
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
            )}
          </div>
        }
      />

      {items.length === 0 ? (
        <p className="px-4 font-sans text-xs text-ink-muted sm:px-6">
          Top 10 isn’t available right now.
        </p>
      ) : (
        <ol
          ref={scrollerRef}
          className="no-scrollbar edge-fade flex scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6"
        >
          {items.map((anime, i) => (
            <li key={anime.id} className="flex shrink-0 items-end">
              <span
                aria-hidden
                className="-mr-2 select-none font-mono font-bold tabular-nums leading-[0.8] text-white/15 [font-size:3.5rem] sm:-mr-3 sm:[font-size:5rem]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="w-[128px] sm:w-[154px]">
                <AnimeCard anime={anime} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
