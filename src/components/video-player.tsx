"use client";

import { useEffect, useRef, useState } from "react";
import { SUBTITLE_OFF } from "@/components/subtitle-selector";
import { QUALITY_AUTO } from "@/components/quality-selector";

export interface VideoSource {
  url: string;
  type: "hls" | "mp4" | "iframe" | "iframe-adblock";
}

interface PlayerSubtitle {
  lang: string;
  label: string;
  url?: string;
}

function mockVttUri(label: string): string {
  const vtt = `WEBVTT\n\n00:00:00.000 --> 00:05:00.000\n[${label} subtitles]`;
  return `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
}

export function VideoPlayer({
  source,
  poster,
  title,
  subtitles = [],
  activeSubtitle = SUBTITLE_OFF,
  activeQuality = QUALITY_AUTO,
  resumeSeconds = 0,
  onProgress,
}: {
  source?: VideoSource;
  poster?: string;
  title?: string;
  subtitles?: PlayerSubtitle[];
  activeSubtitle?: string;
  activeQuality?: string;
  resumeSeconds?: number;
  onProgress?: (seconds: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [erroredUrl, setErroredUrl] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const lastTimeRef = useRef(resumeSeconds);
  const lastReportRef = useRef(0);

  function report(seconds: number) {
    if (onProgress && seconds > 0) onProgress(Math.floor(seconds));
  }

  const hasPlayableSource = Boolean(source?.url);
  const errored = erroredUrl !== null && erroredUrl === source?.url;
  const isHls = source?.type === "hls";
  const canPlay = source?.type === "mp4" || isHls;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source || source.type !== "hls") return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source.url;
      return;
    }

    let destroyed = false;
    let hls: { destroy: () => void } | null = null;

    import("hls.js")
      .then(({ default: Hls }) => {
        if (destroyed || !videoRef.current) return;
        if (!Hls.isSupported()) {
          setErroredUrl(source.url);
          return;
        }
        const instance = new Hls({ enableWorker: true });
        hls = instance;
        instance.loadSource(source.url);
        instance.attachMedia(videoRef.current);
        instance.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) setErroredUrl(source.url);
        });
      })
      .catch(() => setErroredUrl(source.url));

    return () => {
      destroyed = true;
      hls?.destroy();
    };
  }, [source, reloadKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      track.mode =
        activeSubtitle !== SUBTITLE_OFF && track.language === activeSubtitle
          ? "showing"
          : "disabled";
    }
  }, [activeSubtitle, reloadKey, subtitles, activeQuality]);

  function retry() {
    setErroredUrl(null);
    setReloadKey((k) => k + 1);
  }

  if (!hasPlayableSource || errored || !canPlay) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-[2px] bg-black">
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div className="flex flex-col items-center gap-3 rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.45] ring-1 ring-inset ring-white/[0.12] p-6 shadow-none">
            <span className="rounded-[2px] border border-hairline bg-white/[0.06] px-2.5 py-1 font-mono text-xs font-semibold text-accent">
              STREAM STATUS
            </span>
            <div>
              <p className="font-sans text-sm font-medium text-ink">
                {errored
                  ? "This episode failed to load."
                  : "Resolving playable source…"}
              </p>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                {title ? `${title} — ` : ""}
                Select a provider node below if stream does not start.
              </p>
            </div>
            {(errored || hasPlayableSource) && (
              <button
                type="button"
                onClick={retry}
                className="rounded-[2px] border border-hairline bg-white/[0.08] px-4 py-1.5 font-mono text-xs font-medium text-ink transition hover:bg-white/[0.15] cursor-pointer"
              >
                Retry Stream →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-[2px] bg-black">
      <video
        key={`${source!.url}:${reloadKey}`}
        ref={videoRef}
        src={isHls ? undefined : source!.url}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        onError={() => setErroredUrl(source!.url)}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          lastTimeRef.current = t;
          const now = Date.now();
          if (now - lastReportRef.current > 10_000) {
            lastReportRef.current = now;
            report(t);
          }
        }}
        onPause={(e) => report(e.currentTarget.currentTime)}
        onEnded={(e) => report(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (lastTimeRef.current > 0) {
            e.currentTarget.currentTime = lastTimeRef.current;
          }
        }}
        className="h-full w-full"
      >
        {subtitles.map((track) => (
          <track
            key={track.lang}
            kind="subtitles"
            src={track.url ?? mockVttUri(track.label)}
            srcLang={track.lang}
            label={track.label}
          />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
