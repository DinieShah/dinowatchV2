"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import type { WatchlistItem } from "@/lib/db/watchlist";

export function WatchlistGrid({
  initialItems,
}: {
  initialItems: WatchlistItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [pending, setPending] = useState<string | null>(null);

  async function remove(animeId: string) {
    setPending(animeId);
    try {
      const res = await fetch(
        `/api/watchlist?animeId=${encodeURIComponent(animeId)}`,
      { method: "DELETE" },
      );
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.animeId !== animeId));
      }
    } finally {
      setPending(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-12 text-center">
        <p className="font-sans text-xs text-ink-muted">
          Your list is empty. Add anime from any details page to see it here.
        </p>
        <ButtonLink href="/discover" className="mt-5">
          Browse anime →
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.animeId} className="group relative w-full text-left">
          <Link href={`/anime/${item.animeId}`} className="block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02] group-hover:border-white/[0.22]">
              <SafeImage
                src={item.posterImage}
                fallbackLabel={item.title}
                alt={item.title}
                fill
                sizes="170px"
                className="object-cover transition-opacity duration-200 group-hover:opacity-90"
              />
            </div>
            <h3 className="mt-2 truncate font-sans text-xs font-medium text-ink transition group-hover:text-accent">
              {item.title}
            </h3>
          </Link>
          <button
            type="button"
            onClick={() => remove(item.animeId)}
            disabled={pending === item.animeId}
            aria-label={`Remove ${item.title} from list`}
            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.65] ring-1 ring-inset ring-white/[0.08] font-mono text-xs text-ink opacity-0 transition hover:bg-red-500/80 group-hover:opacity-100 disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
