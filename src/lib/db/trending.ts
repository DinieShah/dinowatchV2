import "server-only";

import { getTrendingAnime } from "@/lib/anime/kitsu";
import { trendingAnime as mockTrending } from "@/lib/mock-data";
import type { AnimeSummary } from "@/lib/types";

// Trending list — sourced from catalog feed, Next-cached at
// the fetch layer. Falls back to mock data if upstream is unreachable so the
// grid and hero always render.
export async function getTrending(limit = 20): Promise<AnimeSummary[]> {
  const data = await getTrendingAnime(limit);
  if (data.length > 0) return data;
  return mockTrending.slice(0, limit);
}
