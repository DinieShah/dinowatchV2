import { ContinueWatchingSection } from "@/components/continue-watching-section";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopTenSection } from "@/components/top-ten-section";
import { TrendingRow } from "@/components/trending-row";
import { sanitizeImageUrl } from "@/lib/anime/image-utils";
import {
  getCurrentlyAiringAnime,
  getHomeFeed,
  getSeasonTopAnime,
  getTopTenAnime,
} from "@/lib/anime/kitsu";
import { getFeaturedEpisode } from "@/lib/db/featured";
import { getTrending } from "@/lib/db/trending";
import { featuredAnime as mockFeatured } from "@/lib/mock-data";
import type { AnimeSummary, FeaturedAnime } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toSlide(
  anime: AnimeSummary,
  episode: number,
): HeroSlide {
  const posterImage = sanitizeImageUrl(anime.posterImage, undefined, anime.title);
  const bannerImage = sanitizeImageUrl(anime.bannerImage, posterImage, anime.title);
  return {
    id: anime.id,
    title: anime.title,
    bannerImage,
    posterImage,
    synopsis: anime.synopsis,
    score: anime.score,
    year: anime.year,
    episodeCount: anime.episodeCount,
    genres: anime.genres ?? [],
    status: anime.status,
    watchHref: `/watch/${anime.id}?ep=${episode}`,
    detailHref: `/anime/${anime.id}`,
  };
}

function buildSlides(
  featured: FeaturedAnime,
  spotlights: FeaturedAnime[],
  fallbackList: AnimeSummary[],
): HeroSlide[] {
  const slides: HeroSlide[] = [];
  const seen = new Set<string>();

  for (const s of spotlights) {
    if (!s.id || seen.has(s.id)) continue;
    seen.add(s.id);
    slides.push(toSlide(s, s.featuredEpisode || 1));
    if (slides.length >= 6) return slides;
  }

  if (!seen.has(featured.id)) {
    seen.add(featured.id);
    slides.unshift(toSlide(featured, featured.featuredEpisode || 1));
  }

  for (const item of fallbackList) {
    if (slides.length >= 5) break;
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    slides.push(toSlide(item, 1));
  }

  return slides.slice(0, 6);
}

export default async function HomePage() {
  const [
    homeFeed,
    featuredRes,
    trending,
    currentlyAiring,
    seasonTop,
    topTen,
  ] = await Promise.all([
    getHomeFeed(),
    getFeaturedEpisode(),
    getTrending(20),
    getCurrentlyAiringAnime(12),
    getSeasonTopAnime(12),
    getTopTenAnime(),
  ]);

  const featured = featuredRes ?? mockFeatured;
  const hasTopTen =
    topTen.day.length > 0 || topTen.week.length > 0 || topTen.month.length > 0;

  const slides = buildSlides(
    featured,
    homeFeed.spotlights,
    currentlyAiring.length > 0 ? currentlyAiring : trending,
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper text-ink">
        <HeroCarousel slides={slides} />

        <div className="mx-auto max-w-7xl">
          <ContinueWatchingSection />
          {hasTopTen && (
            <TopTenSection
              data={{
                day: topTen.day,
                week: topTen.week,
                month: topTen.month,
              }}
            />
          )}
          {currentlyAiring.length > 0 && (
            <TrendingRow title="Currently Airing" items={currentlyAiring} />
          )}
          {seasonTop.length > 0 && (
            <TrendingRow title="Most Popular" items={seasonTop} />
          )}
          <TrendingRow title="Trending Now" items={trending} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
