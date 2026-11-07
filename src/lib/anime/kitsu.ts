import "server-only";

import type {
  AnimeDetail,
  AnimeSummary,
  Episode,
  FeaturedAnime,
  FranchiseItem,
} from "@/lib/types";
import { sanitizeImageUrl, validateImageUrl } from "@/lib/anime/image-utils";
import {
  featuredAnime,
  trendingAnime,
  searchIndex,
  getWatchData,
} from "@/lib/mock-data";

export { sanitizeImageUrl, validateImageUrl };

export const KITSU_PAGE_LIMIT = 20;

export function cleanSlug(raw?: string | number | null): string {
  if (raw === null || raw === undefined) return "";
  return String(raw)
    .trim()
    .replace(/^['"`\s]+|['"`\s]+$/g, "")
    .replace(/\/ep-\d+$/i, "")
    .replace(/^\/+|\/+$/g, "");
}

export async function getHomeFeed(): Promise<{
  spotlights: FeaturedAnime[];
  trending: AnimeSummary[];
  latestEpisodes: AnimeSummary[];
}> {
  return {
    spotlights: [
      featuredAnime,
      {
        ...trendingAnime[1],
        bannerImage: trendingAnime[1].posterImage,
        featuredEpisode: 1,
      },
      {
        ...trendingAnime[0],
        bannerImage: trendingAnime[0].posterImage,
        featuredEpisode: 5,
      },
    ],
    trending: trendingAnime,
    latestEpisodes: trendingAnime.slice(0, 6),
  };
}

export async function getTopTenAnime(): Promise<{
  day: AnimeSummary[];
  week: AnimeSummary[];
  month: AnimeSummary[];
}> {
  return {
    day: trendingAnime.slice(0, 8),
    week: [...trendingAnime.slice(2), ...trendingAnime.slice(0, 2)],
    month: [...trendingAnime.slice(4), ...trendingAnime.slice(0, 4)],
  };
}

export async function getTrendingAnime(limit = 20, _page = 1): Promise<AnimeSummary[]> {
  return trendingAnime.slice(0, limit);
}

export async function getCurrentlyAiringAnime(limit = 12): Promise<AnimeSummary[]> {
  return trendingAnime.filter((a) => a.status === "airing").slice(0, limit);
}

export async function getSeasonTopAnime(limit = 12): Promise<AnimeSummary[]> {
  return [...trendingAnime].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, limit);
}

export async function searchAnime(
  query: string,
  limit = 20,
  _page = 1,
): Promise<AnimeSummary[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .filter((a) => a.title.toLowerCase().includes(q))
    .slice(0, limit);
}

export async function getAnimeDetail(slug: string): Promise<AnimeDetail | null> {
  const clean = cleanSlug(slug);
  const found = searchIndex.find((a) => a.id === clean);
  if (!found) return null;

  return {
    ...found,
    synopsis:
      found.synopsis ??
      `${found.title} is a critically acclaimed series featured on DinoWatch. Follow the protagonist on an unforgettable journey full of emotion and adventure.`,
    studios: ["Madhouse", "Mappa"],
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  };
}

export async function getEpisodes(
  slug: string,
  fallbackThumbnail?: string,
): Promise<Episode[]> {
  const watchData = getWatchData(cleanSlug(slug));
  return watchData.episodes.map((ep) => ({
    ...ep,
    thumbnail: fallbackThumbnail || ep.thumbnail,
  }));
}

export async function getFranchiseWatchOrder(
  slug: string,
  _anime?: any,
): Promise<FranchiseItem[]> {
  const currentSlug = cleanSlug(slug);
  return [
    {
      id: "frieren-beyond-journey-s-end-c6fbj",
      title: "Frieren: Beyond Journey's End (Season 1)",
      role: "prequel",
      roleLabel: "PREQUEL",
      year: 2023,
      posterImage: featuredAnime.posterImage,
      subtype: "TV",
      isCurrent: currentSlug === "frieren-beyond-journey-s-end-c6fbj",
    },
    {
      id: "frieren-season-2",
      title: "Frieren: Beyond Journey's End (Season 2)",
      role: "sequel",
      roleLabel: "SEQUEL",
      year: 2026,
      posterImage: featuredAnime.posterImage,
      subtype: "TV",
      isCurrent: currentSlug === "frieren-season-2",
    },
    {
      id: "frieren-special",
      title: "Frieren: Journey's Memories (OVA)",
      role: "side_story",
      roleLabel: "OVA",
      year: 2024,
      posterImage: featuredAnime.posterImage,
      subtype: "OVA",
      isCurrent: currentSlug === "frieren-special",
    },
  ];
}

export async function getRelatedAnime(
  slug: string,
  limit = 12,
): Promise<AnimeSummary[]> {
  const clean = cleanSlug(slug);
  return trendingAnime.filter((a) => a.id !== clean).slice(0, limit);
}
