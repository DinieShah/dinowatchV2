import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import type { AnimeSummary } from "@/lib/types";

export function AnimeCard({ anime }: { anime: AnimeSummary }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group block w-full text-left transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:border-white/[0.22] group-hover:bg-white/[0.12]">
        <SafeImage
          src={anime.posterImage}
          fallbackLabel={anime.title}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 40vw, 180px"
          className="object-cover transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-90"
        />

        {/* Bottom glass overlay revealed on hover */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.12] backdrop-blur-[40px] bg-black/[0.55] ring-1 ring-inset ring-white/[0.08] p-2.5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100">
          <p className="truncate font-sans text-xs font-semibold text-ink">
            {anime.title}
          </p>
          {anime.genres.length > 0 && (
            <p className="truncate font-mono text-[10px] text-ink-muted">
              {anime.genres.slice(0, 2).join(" · ")}
            </p>
          )}
        </div>

        {typeof anime.score === "number" && (
          <span className="absolute left-2 top-2">
            <Badge tone="star">★ {anime.score.toFixed(1)}</Badge>
          </span>
        )}
        {anime.status === "airing" && (
          <span className="absolute right-2 top-2">
            <Badge tone="live">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-accent" aria-hidden />
              Airing
            </Badge>
          </span>
        )}
      </div>

      <h3 className="mt-2 truncate font-sans text-xs sm:text-sm font-medium text-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-accent">
        {anime.title}
      </h3>
      {anime.genres.length > 0 ? (
        <p className="truncate font-mono text-[11px] text-ink-muted">
          {anime.genres.slice(0, 2).join(" · ")}
        </p>
      ) : anime.episodeCount ? (
        <p className="truncate font-mono text-[11px] text-ink-muted tabular-nums">
          {anime.episodeCount} episodes
        </p>
      ) : null}
    </Link>
  );
}
