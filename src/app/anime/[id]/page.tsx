import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrendingRow } from "@/components/trending-row";
import { WatchlistButton } from "@/components/watchlist-button";
import { Badge, StarRating } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { getAnimeDetail, getSimilarAnime } from "@/lib/anime/detail";
import { sanitizeImageUrl } from "@/lib/anime/image-utils";
import { isInWatchlist } from "@/lib/db/watchlist";
import { getCurrentUserId } from "@/lib/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeDetail(id);
  if (!anime) return { title: "Not found — DinoWatch" };
  const description =
    anime.synopsis?.slice(0, 160) ||
    `Watch and track ${anime.title} on DinoWatch.`;
  const poster = sanitizeImageUrl(anime.posterImage, undefined, anime.title);
  return {
    title: `${anime.title} — DinoWatch`,
    description,
    alternates: {
      canonical: `/anime/${encodeURIComponent(anime.id)}`,
    },
    openGraph: {
      title: `${anime.title} — DinoWatch`,
      description,
      url: `/anime/${encodeURIComponent(anime.id)}`,
      type: "video.tv_show",
      images: poster.startsWith("http") ? [{ url: poster }] : undefined,
    },
  };
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anime = await getAnimeDetail(id);
  if (!anime) notFound();

  const userId = await getCurrentUserId();
  const saved = userId ? await isInWatchlist(userId, anime.id) : false;
  const similar = await getSimilarAnime(anime.id);
  const poster = sanitizeImageUrl(anime.posterImage, undefined, anime.title);
  const backdrop = sanitizeImageUrl(anime.bannerImage, poster, anime.title);
  const tvSeriesJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: anime.title,
    description: anime.synopsis,
    image: poster.startsWith("http") ? poster : undefined,
    genre: anime.genres,
    numberOfEpisodes: anime.episodeCount,
    datePublished: anime.year ? String(anime.year) : undefined,
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: tvSeriesJsonLd }}
      />
      <SiteHeader />
      <main className="flex-1 bg-paper text-ink text-left">
        {/* Banner */}
        <section className="relative h-[44vh] min-h-[300px] w-full overflow-hidden border-b border-white/[0.12] bg-white/[0.06] backdrop-blur-md">
          <SafeImage
            src={backdrop}
            fallbackSrc={poster}
            fallbackLabel={anime.title}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        </section>

        <div className="mx-auto -mt-24 grid max-w-7xl gap-8 px-4 pb-14 sm:-mt-28 sm:px-6 md:grid-cols-[240px_1fr]">
          {/* Poster */}
          <div className="animate-panel-in relative aspect-[2/3] w-40 overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:w-full">
            <SafeImage
              src={poster}
              fallbackLabel={anime.title}
              alt={anime.title}
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="pt-2">
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              {anime.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              {typeof anime.score === "number" && (
                <StarRating score={anime.score} />
              )}
              {anime.year && <Badge>{anime.year}</Badge>}
              {anime.episodeCount && <Badge>{anime.episodeCount} episodes</Badge>}
              <Badge className="capitalize">{anime.status}</Badge>
            </div>

            {anime.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {anime.genres.map((g) => (
                  <Badge key={g}>{g}</Badge>
                ))}
              </div>
            )}

            {anime.studios && anime.studios.length > 0 && (
              <p className="mt-4 font-mono text-xs text-ink-muted">
                Studio: {anime.studios.join(", ")}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/watch/${anime.id}?ep=1`} size="lg">
                <span>Watch Episode 1</span>
                <span aria-hidden className="font-mono">→</span>
              </ButtonLink>
              {userId ? (
                <WatchlistButton
                  animeId={anime.id}
                  title={anime.title}
                  posterImage={poster}
                  initialSaved={saved}
                />
              ) : (
                <ButtonLink href="/login" variant="secondary" size="lg">
                  + Sign in to save
                </ButtonLink>
              )}
              <ButtonLink href="/discover" variant="secondary" size="lg">
                Find similar
              </ButtonLink>
            </div>

            {anime.synopsis && (
              <div className="animate-panel-in mt-8 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-5">
                <h2 className="mb-2 font-display text-base font-semibold text-ink">
                  Synopsis
                </h2>
                <p className="max-w-3xl font-sans text-xs sm:text-sm leading-relaxed text-ink-muted">
                  {anime.synopsis}
                </p>
              </div>
            )}

            {anime.trailerUrl && (
              <div className="mt-8">
                <h2 className="mb-2 font-display text-base font-semibold text-ink">
                  Trailer
                </h2>
                <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <iframe
                    src={anime.trailerUrl}
                    title={`${anime.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mx-auto max-w-7xl pb-10">
            <TrendingRow title="More Like This" items={similar} />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
