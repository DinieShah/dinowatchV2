"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { SectionHeader } from "@/components/ui/section-header";
import { useSession } from "@/lib/auth-client";
import type { WatchHistoryItem } from "@/lib/db/history";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;
  return "Last week";
}

export function ContinueWatchingSection() {
  const { data: sessionData, isPending } = useSession();
  const [items, setItems] = useState<WatchHistoryItem[] | null>(null);

  const isAuthed = Boolean(sessionData?.user);

  useEffect(() => {
    if (!isAuthed) return;
    let active = true;
    fetch("/api/history?limit=12")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => {
        if (active) setItems(j.data ?? []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [isAuthed]);

  if (isPending) return null;

  if (!isAuthed) {
    return (
      <section className="px-4 py-6 sm:px-6 border-b border-white/[0.12]">
        <div className="animate-panel-in flex flex-col items-start gap-4 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">
              Continue Watching
            </h2>
            <p className="mt-1 font-sans text-xs text-ink-muted">
              Sign in to pick up right where you left off across devices.
            </p>
          </div>
          <ButtonLink href="/login" size="sm">
            Sign in →
          </ButtonLink>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 border-b border-white/[0.12]">
      <SectionHeader title="Continue Watching" />
      <div className="no-scrollbar edge-fade flex gap-4 overflow-x-auto px-4 pb-2 sm:gap-5 sm:px-6">
        {items.map((item) => (
          <Link
            key={item.animeId}
            href={`/watch/${item.animeId}?ep=${item.episodeNumber}`}
            className="group block w-[260px] shrink-0 text-left transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02]"
          >
            <div className="relative aspect-video overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:border-white/[0.22] group-hover:bg-white/[0.12]">
              <SafeImage
                src={item.posterImage}
                fallbackLabel={item.title}
                alt={item.title}
                fill
                sizes="260px"
                className="object-cover transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.45] ring-1 ring-inset ring-white/[0.08] px-2 py-0.5 font-mono text-[10px] text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100">
                Resume →
              </span>
              <span className="absolute bottom-2.5 left-3 font-mono text-xs font-medium tabular-nums text-ink">
                Episode {item.episodeNumber}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15">
                <div className="h-full w-1/3 bg-accent" />
              </div>
            </div>
            <h3 className="mt-2 truncate font-sans text-xs font-medium text-ink">
              {item.title}
            </h3>
            <p className="font-mono text-[11px] text-ink-muted">
              {relativeTime(item.lastWatched)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
