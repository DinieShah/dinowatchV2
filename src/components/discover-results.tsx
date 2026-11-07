"use client";

import { useMemo, useState } from "react";
import { AnimeCard } from "@/components/anime-card";
import { MenuSelect } from "@/components/menu-select";
import { Button } from "@/components/ui/button";
import { rankBySearchRelevance } from "@/lib/video/title-match";
import type { AnimeSummary } from "@/lib/types";

type SortKey = "relevance" | "score" | "year" | "title";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "score", label: "Top rated" },
  { value: "year", label: "Newest" },
  { value: "title", label: "A–Z" },
];

const PAGE_SIZE = 20;

export function DiscoverResults({
  results,
  query = "",
}: {
  results: AnimeSummary[];
  query?: string;
}) {
  const [items, setItems] = useState<AnimeSummary[]>(results);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(results.length >= PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("relevance");

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    items.forEach((a) => a.genres.forEach((g) => set.add(g)));
    return [...set].sort();
  }, [items]);

  const shown = useMemo(() => {
    let list = items;
    if (selectedGenres.size > 0) {
      list = list.filter((a) => a.genres.some((g) => selectedGenres.has(g)));
    }
    const sorted = [...list];
    if (sort === "relevance") {
      return query.trim() ? rankBySearchRelevance(query, sorted) : sorted;
    }
    if (sort === "score") {
      sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    } else if (sort === "year") {
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    } else if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [items, selectedGenres, sort, query]);

  function toggleGenre(g: string) {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (query) params.set("q", query);
      const res = await fetch(`/api/discover?${params.toString()}`);
      const json = (await res.json()) as { data?: AnimeSummary[] };
      const incoming = json.data ?? [];

      setItems((prev) => {
        const seen = new Set(prev.map((a) => a.id));
        return [...prev, ...incoming.filter((a) => !seen.has(a.id))];
      });
      setPage(nextPage);
      setHasMore(incoming.length >= PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  const sortLabel =
    SORTS.find((s) => s.value === sort)?.label ?? "Relevance";

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-white/[0.12] pb-4">
        <span className="font-mono text-xs tabular-nums text-ink-muted">
          {shown.length} {shown.length === 1 ? "title" : "titles"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <label className="font-mono text-xs text-ink-muted">Sort</label>
          <MenuSelect
            buttonLabel={sortLabel}
            value={sort}
            options={SORTS}
            onChange={(v) => setSort(v as SortKey)}
          />
        </div>
      </div>

      {allGenres.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {allGenres.map((g) => {
            const active = selectedGenres.has(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                aria-pressed={active}
                className={`rounded-[2px] border px-2.5 py-1 font-mono text-xs transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] cursor-pointer ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-ink-muted hover:bg-white/[0.12] hover:text-ink"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="mt-10 text-center font-sans text-xs text-ink-muted">
          No anime match these filters.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {shown.map((anime) => (
            <div key={anime.id} className="w-full">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : "View more →"}
          </Button>
        </div>
      )}
    </div>
  );
}
