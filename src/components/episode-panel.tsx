"use client";

import { useEffect, useState } from "react";
import { EpisodeList } from "@/components/episode-list";
import type { Episode } from "@/lib/types";

export function EpisodePanel({
  animeId,
  episodes,
  currentEpisode,
  nextAiring,
}: {
  animeId: string;
  episodes: Episode[];
  currentEpisode: number;
  nextAiring?: { airingAt: number; timeUntilAiring: number; episode: number } | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block animate-panel-in">
        <EpisodeList
          animeId={animeId}
          episodes={episodes}
          currentEpisode={currentEpisode}
          nextAiring={nextAiring}
        />
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-3 font-sans text-xs font-medium text-ink lg:hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12]"
      >
        <span>Episodes</span>
        <span className="font-mono text-xs text-ink-muted">
          Ep {currentEpisode} of {episodes.length} ›
        </span>
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal>
          <button
            type="button"
            aria-label="Close episodes"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/[0.45] backdrop-blur-md"
          />
          <div className="animate-panel-in absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between border-b border-white/[0.12] px-4 py-3">
              <h2 className="font-display text-sm font-semibold text-ink">
                Episodes
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-7 w-7 place-items-center rounded-[2px] border border-white/[0.12] bg-white/[0.08] ring-1 ring-inset ring-white/[0.08] text-ink-muted transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:text-ink hover:bg-white/[0.12] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <EpisodeList
                animeId={animeId}
                episodes={episodes}
                currentEpisode={currentEpisode}
                nextAiring={nextAiring}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
