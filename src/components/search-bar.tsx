"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { searchMock } from "@/lib/mock-data";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => searchMock(query), [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(href: string) {
    setOpen(false);
    setActive(-1);
    router.push(href);
  }

  function submitQuery() {
    const q = query.trim();
    if (q) go(`/discover?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") submitQuery();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) go(`/anime/${suggestions[active].id}`);
      else submitQuery();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitQuery();
        }}
        role="search"
      >
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search anime…"
          aria-label="Search anime"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          role="combobox"
          className="h-9 w-full rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-white/[0.08] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-1.5 pl-8 pr-3 font-sans text-xs text-ink placeholder:text-ink-muted focus:border-white/[0.22] focus:bg-white/[0.12] focus:outline-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
        />
      </form>

      {open && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="animate-panel-in absolute z-50 mt-2 w-full overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.75] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] divide-y divide-white/[0.08]"
        >
          {suggestions.map((anime, i) => (
            <li key={anime.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(`/anime/${anime.id}`)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  i === active ? "bg-white/[0.12]" : "hover:bg-white/[0.12]"
                }`}
              >
                <span className="relative h-11 w-8 shrink-0 overflow-hidden rounded-[2px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-md">
                  <SafeImage
                    src={anime.posterImage}
                    fallbackLabel={anime.title}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-sans text-xs font-medium text-ink">
                    {anime.title}
                  </span>
                  <span className="block truncate font-mono text-[10px] text-ink-muted tabular-nums">
                    {anime.year} · {anime.genres.slice(0, 2).join(", ")}
                  </span>
                </span>
                {typeof anime.score === "number" && (
                  <span className="ml-auto font-mono text-[11px] font-semibold text-star tabular-nums">
                    ★ {anime.score.toFixed(1)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
