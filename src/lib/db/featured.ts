import "server-only";

import { getHomeFeed, getTrendingAnime } from "@/lib/anime/kitsu";
import { featuredAnime as mockFeatured } from "@/lib/mock-data";
import type { AnimeSummary, FeaturedAnime } from "@/lib/types";

function toFeatured(anime: AnimeSummary): FeaturedAnime {
  return {
    ...anime,
    bannerImage: anime.bannerImage ?? anime.posterImage,
    featuredEpisode: 1,
  };
}

export async function getFeaturedEpisode(): Promise<FeaturedAnime | null> {
  const home = await getHomeFeed();
  if (home.spotlights.length > 0) {
    return home.spotlights[0];
  }

  const trending = await getTrendingAnime(20);
  const withBanner = trending.find((a) => a.bannerImage) ?? trending[0];
  if (withBanner) return toFeatured(withBanner);
  return mockFeatured;
}
