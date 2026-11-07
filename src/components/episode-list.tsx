"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import type { Episode } from "@/lib/types";

export function EpisodeList({
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
  const [filter, setFilter] = useState("");
  const [hideFiller, setHideFiller] = useState(false);

  // Filter episodes BEFORE rendering: strictly keep only released/aired episodes
  const airedEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      if (!ep || !Number.isFinite(ep.number) || ep.number <= 0) return false;
      if (ep.isAired === false) return false;
      const titleText = (ep.title ?? "").trim();
      if (/^(tba|unreleased|upcoming|preview)$/i.test(titleText)) return false;
      if (nextAiring?.episode && ep.number >= nextAiring.episode) return false;
      return true;
    });
  }, [episodes, nextAiring]);

  const hasFiller = useMemo(
    () => airedEpisodes.some((e) => e.isFiller),
    [airedEpisodes],
  );

  // Accurate "LATEST" badge: only attaches to the highest released episode number
  const latestEpNumber = useMemo(() => {
    return airedEpisodes.length > 0
      ? Math.max(...airedEpisodes.map((e) => e.number))
      : -1;
  }, [airedEpisodes]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return airedEpisodes.filter((e) => {
      if (hideFiller && e.isFiller) return false;
      if (!q) return true;
      return (
        String(e.number).includes(q) ||
        (e.title ?? "").toLowerCase().includes(q)
      );
    });
  }, [airedEpisodes, filter, hideFiller]);

  return (
    <div className="animate-panel-in rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden text-left">
      <div className="border-b border-white/[0.12] px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-ink">Episodes</h2>
          <span className="font-mono text-xs tabular-nums text-ink-muted">
            {airedEpisodes.length} total
          </span>
        </div>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter episodes…"
          aria-label="Filter episodes"
          className="mt-2 w-full rounded-[2px] border border-white/[0.12] bg-white/[0.08] ring-1 ring-inset ring-white/[0.08] px-3 py-1.5 font-sans text-xs text-ink placeholder:text-ink-muted focus:border-white/25 focus:bg-white/[0.12] focus:outline-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
        />
        {hasFiller && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 font-mono text-[11px] text-ink-muted">
            <input
              type="checkbox"
              checked={hideFiller}
              onChange={(e) => setHideFiller(e.target.checked)}
              className="accent-accent"
            />
            Hide filler episodes
          </label>
        )}
      </div>

      <ul className="max-h-[70vh] divide-y divide-white/[0.08] overflow-y-auto">
        {filtered.length === 0 && (
          <li className="px-4 py-6 text-center font-sans text-xs text-ink-muted">
            {filter ? `No episodes match “${filter}”.` : "No released episodes available yet."}
          </li>
        )}
        {filtered.map((episode) => {
          const isCurrent = episode.number === currentEpisode;
          const isLatest = episode.number === latestEpNumber;

          return (
            <li key={episode.number}>
              <Link
                href={`/watch/${animeId}?ep=${episode.number}`}
                prefetch={false}
                aria-current={isCurrent ? "true" : undefined}
                className={`flex items-center gap-3 px-3 py-2 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] ${
                  isCurrent ? "bg-white/[0.12]" : ""
                }`}
              >
                <span className="relative h-12 w-20 shrink-0 overflow-hidden rounded-[2px] bg-white/[0.06] backdrop-blur-md border border-white/[0.12]">
                  <SafeImage
                    src={episode.thumbnail}
                    fallbackLabel={`E${episode.number}`}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {isCurrent && (
                    <span className="absolute inset-0 grid place-items-center backdrop-blur-md bg-black/[0.45] font-mono text-[10px] font-semibold uppercase text-accent">
                      Live
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`flex items-center gap-2 truncate text-xs ${
                      isCurrent
                        ? "font-semibold text-ink"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="truncate">{episode.title || `Episode ${episode.number}`}</span>
                    {isLatest && (
                      <span className="shrink-0 rounded-[2px] border border-accent/40 bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-normal text-accent font-medium">
                        Latest
                      </span>
                    )}
                    {episode.isFiller && (
                      <span className="shrink-0 rounded-[2px] border border-white/[0.12] bg-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-normal text-ink-muted">
                        Filler
                      </span>
                    )}
                  </span>
                  <span className="block font-mono text-[10px] tabular-nums text-ink-muted">
                    Ep {episode.number} · {episode.durationLabel || "24m"}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
