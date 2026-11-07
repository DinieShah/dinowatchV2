"use client";

import { useRef } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import type { FranchiseItem } from "@/lib/types";

interface FranchiseWatchOrderProps {
  items: FranchiseItem[];
}

export function FranchiseWatchOrder({ items }: FranchiseWatchOrderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!items || items.length <= 1) return null;

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: "smooth" });
  }

  const arrow =
    "grid h-7 w-7 place-items-center rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-white/[0.08] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-ink text-xs transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] cursor-pointer select-none";

  return (
    <section
      className="animate-panel-in mt-6 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 text-left"
      aria-label="Franchise Watch Order"
      data-testid="franchise-watch-order"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-[2px] bg-accent" aria-hidden />
          <div>
            <h2 className="font-display text-sm font-semibold text-ink sm:text-base">
              Franchise Watch Order
            </h2>
            <p className="font-mono text-[11px] text-ink-muted">
              Chronological release order · {items.length} titles
            </p>
          </div>
        </div>

        <div className="hidden gap-1.5 sm:flex">
          <button
            type="button"
            aria-label="Scroll franchise left"
            onClick={() => scrollBy(-1)}
            className={arrow}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll franchise right"
            onClick={() => scrollBy(1)}
            className={arrow}
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar edge-fade flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-1 pb-2 pt-1"
      >
        {items.map((item, index) => {
          const stepIndex = String(index + 1).padStart(2, "0");
          const cardContent = (
            <div
              className={`flex h-full w-[210px] shrink-0 snap-start flex-col rounded-[2px] border p-2.5 backdrop-blur-[40px] ring-1 ring-inset shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] ${
                item.isCurrent
                  ? "border-accent/80 bg-accent/[0.15] ring-accent/30"
                  : "border-white/[0.12] bg-white/[0.08] ring-white/[0.08]"
              }`}
            >
              {/* Header: Entry Index & Relationship Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] tabular-nums text-ink-muted">
                  #{stepIndex}
                </span>
                <span
                  className={`inline-flex items-center rounded-[2px] border px-1.5 py-0.5 font-mono text-[9px] uppercase tabular-nums tracking-normal ${
                    item.isCurrent
                      ? "border-accent text-accent font-medium bg-accent/20 ring-1 ring-inset ring-accent/30"
                      : "border-white/[0.12] bg-white/[0.08] text-ink-muted ring-1 ring-inset ring-white/[0.08]"
                  }`}
                >
                  {item.roleLabel}
                </span>
              </div>

              {/* Body: Poster Thumbnail & Meta */}
              <div className="mt-2.5 flex gap-2.5">
                <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-[2px] bg-white/[0.06] backdrop-blur-md border border-white/[0.12]">
                  <SafeImage
                    src={item.posterImage}
                    fallbackLabel={item.title}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`line-clamp-2 font-sans text-xs font-medium leading-snug ${
                      item.isCurrent ? "text-ink font-semibold" : "text-ink"
                    }`}
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-ink-muted">
                    {item.year && <span>{item.year}</span>}
                    {item.subtype && (
                      <>
                        <span>·</span>
                        <span>{item.subtype}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer status indicator */}
              <div className="mt-auto pt-2">
                {item.isCurrent ? (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-accent font-medium">
                    <span className="h-1.5 w-1.5 rounded-[1px] bg-accent" aria-hidden />
                    Currently Watching
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-ink-muted hover:text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Watch Episode 1 →
                  </span>
                )}
              </div>
            </div>
          );

          if (item.isCurrent) {
            return (
              <div key={item.id} aria-current="page" className="shrink-0">
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={`/watch/${item.id}?ep=1`}
              className="shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
