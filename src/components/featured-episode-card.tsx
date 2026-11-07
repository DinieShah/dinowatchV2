import { Badge, StarRating } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { HeroSlide } from "@/components/hero-carousel";

export function FeaturedEpisodeCard({
  slide,
  rank,
}: {
  slide: HeroSlide;
  rank?: number;
}) {
  return (
    <div className="animate-panel-in max-w-xl rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-5 sm:p-6 text-left">
      <div className="mb-3 inline-flex items-center gap-2 rounded-[2px] border border-white/[0.12] bg-white/[0.08] ring-1 ring-inset ring-white/[0.08] px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-ink">
        <span className="h-1.5 w-1.5 rounded-[1px] bg-accent" aria-hidden />
        <span>{rank ? `Spotlight #${String(rank).padStart(2, "0")}` : "Featured"}</span>
      </div>

      <h1 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
        {slide.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        {typeof slide.score === "number" && (
          <StarRating score={slide.score} />
        )}
        {slide.year && <Badge>{slide.year}</Badge>}
        {slide.episodeCount && <Badge>{slide.episodeCount} eps</Badge>}
        {slide.status === "airing" && <Badge tone="live">Airing</Badge>}
      </div>

      {slide.genres.length > 0 && (
        <p className="mt-3 font-mono text-xs text-ink-muted">
          {slide.genres.slice(0, 4).join(" · ")}
        </p>
      )}

      {slide.synopsis && (
        <p className="mt-3 max-w-lg font-sans text-xs sm:text-sm leading-relaxed text-ink-muted line-clamp-3">
          {slide.synopsis}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ButtonLink href={slide.watchHref} size="lg">
          <span>Watch Now</span>
          <span aria-hidden className="font-mono">→</span>
        </ButtonLink>
        <ButtonLink href={slide.detailHref} variant="secondary" size="lg">
          More Info
        </ButtonLink>
      </div>
    </div>
  );
}
