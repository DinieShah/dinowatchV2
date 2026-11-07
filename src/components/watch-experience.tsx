"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { QUALITY_AUTO, QualitySelector } from "@/components/quality-selector";
import { SUBTITLE_OFF, SubtitleSelector } from "@/components/subtitle-selector";
import { VideoPlayer, type VideoSource } from "@/components/video-player";
import { useSession } from "@/lib/auth-client";
import { usePersistentState } from "@/lib/use-persistent-state";
import { useStream } from "@/lib/video/use-stream";
import type { AnimeSummary, QualityOption } from "@/lib/types";

export function WatchExperience({
  anime,
  currentEpisode,
  resumeSeconds = 0,
  nextAiring,
}: {
  anime: AnimeSummary;
  currentEpisode: number;
  resumeSeconds?: number;
  nextAiring?: { airingAt: number; timeUntilAiring: number; episode: number } | null;
}) {
  const { data: sessionData } = useSession();
  const isAuthed = Boolean(sessionData?.user);

  const [activeServer, setActiveServer] = useState<"anikoto" | "consumet">("anikoto");
  const { manifest, isLoading } = useStream(anime.id, currentEpisode, activeServer);

  const reportProgress = useCallback(
    (seconds: number) => {
      if (!isAuthed) return;
      void fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          animeId: anime.id,
          title: anime.title,
          posterImage: anime.posterImage,
          episodeNumber: currentEpisode,
          timestampSeconds: seconds,
        }),
      }).catch(() => {
        // Progress saves are best-effort.
      });
    },
    [isAuthed, anime.id, anime.title, anime.posterImage, currentEpisode],
  );

  const qualities = useMemo<QualityOption[]>(() => {
    const sources = manifest?.sources ?? [];
    return sources
      .filter((s) => s.quality)
      .map((s) => ({ height: parseInt(s.quality ?? "", 10) || 0, label: s.quality! }));
  }, [manifest]);

  const subtitles = manifest?.subtitles ?? [];

  const [activeSubtitle, setActiveSubtitle] = usePersistentState(
    "dinowatch:subtitle",
    SUBTITLE_OFF,
  );
  const [activeQuality, setActiveQuality] = usePersistentState(
    "dinowatch:quality",
    QUALITY_AUTO,
  );

  const activeSource = useMemo<VideoSource | undefined>(() => {
    const sources = manifest?.sources ?? [];
    if (sources.length === 0) return undefined;
    const chosen =
      activeQuality !== QUALITY_AUTO
        ? sources.find((s) => s.quality === activeQuality)
        : undefined;
    const src = chosen ?? sources[0];
    return { url: src.url, type: src.type };
  }, [manifest, activeQuality]);

  return (
    <div className="animate-panel-in text-left">
      <div className="overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Embedded Video Player */}
        {activeSource?.type === "iframe" || activeSource?.type === "iframe-adblock" ? (
          <iframe
            src={activeSource.url}
            className="w-full aspect-video border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <VideoPlayer
            source={activeSource}
            poster={manifest?.poster ?? anime.bannerImage ?? anime.posterImage}
            title={`${anime.title} — Episode ${currentEpisode}`}
            subtitles={subtitles}
            activeSubtitle={activeSubtitle}
            activeQuality={activeQuality}
            resumeSeconds={resumeSeconds}
            onProgress={reportProgress}
          />
        )}
      </div>

      <div className="mt-4">
        {/* CONDITIONALLY RENDERED AD-BLOCK NOTICE */}
        {activeSource?.type === "iframe-adblock" && (
          <div className="mb-4 flex flex-col gap-3 rounded-[2px] border border-red-500/30 backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-red-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="shrink-0 rounded-[2px] border border-red-500/40 bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-red-400">
                Fallback
              </span>
              <div>
                <h4 className="font-sans text-xs font-semibold text-ink sm:text-sm">
                  Backup Stream Relay Active
                </h4>
                <p className="mt-0.5 max-w-xl font-sans text-xs leading-relaxed text-ink-muted">
                  Primary HLS streams were unavailable for this episode. Enable an ad-blocker extension if using the external embed relay.
                </p>
              </div>
            </div>
            <a
              href="https://chromewebstore.google.com/detail/lgblnfidahcdcjddiepkckcfdhpknnjh?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full shrink-0 text-center rounded-[2px] border border-red-500/50 bg-red-500/20 px-3.5 py-1.5 font-mono text-xs font-medium text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-red-500/30 sm:w-auto"
            >
              AdBlock Extension →
            </a>
          </div>
        )}

        {/* NEXT EPISODE COUNTDOWN BANNER */}
        {nextAiring && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2.5 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-3 text-xs text-ink-muted">
            <span className="w-fit shrink-0 rounded-[2px] border border-accent/40 bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-accent">
              Schedule
            </span>
            <p className="font-sans text-xs text-ink-muted">
              Next episode (<strong className="font-mono text-ink">Episode {nextAiring.episode}</strong>) airs{" "}
              <strong className="font-mono text-ink">
                <span suppressHydrationWarning>
                  {new Date(nextAiring.airingAt * 1000).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </strong>
              .
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-muted">
          <Link
            href={`/anime/${anime.id}`}
            className="hover:text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] underline underline-offset-2"
          >
            {anime.title}
          </Link>
          <span>·</span>
          <span>Episode {currentEpisode}</span>
        </div>
        <h1 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
          {anime.title} — Episode {currentEpisode}
        </h1>
        {anime.genres.length > 0 && (
          <p className="mt-1 font-mono text-xs text-ink-muted">
            {anime.genres.join(" · ")}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Dual API Server Switcher */}
          <div className="flex items-center gap-1 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveServer("anikoto")}
              className={`rounded-[2px] px-2.5 py-1 font-medium transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                activeServer === "anikoto"
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:scale-[1.02] hover:text-ink hover:bg-white/[0.12]"
              }`}
            >
              Server 1 (Primary)
            </button>
            <button
              type="button"
              onClick={() => setActiveServer("consumet")}
              className={`rounded-[2px] px-2.5 py-1 font-medium transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                activeServer === "consumet"
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:scale-[1.02] hover:text-ink hover:bg-white/[0.12]"
              }`}
            >
              Server 2 (Backup)
            </button>
          </div>

          {subtitles.length > 0 && (
            <SubtitleSelector
              tracks={subtitles}
              value={activeSubtitle}
              onChange={setActiveSubtitle}
            />
          )}
          {qualities.length > 0 && (
            <QualitySelector
              qualities={qualities}
              value={activeQuality}
              onChange={setActiveQuality}
            />
          )}
          {isLoading && (
            <span className="font-mono text-xs text-ink-muted">
              Resolving stream…
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
