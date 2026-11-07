import "server-only";

import {
  getAnimeDetail as kitsuDetail,
  getRelatedAnime,
} from "@/lib/anime/kitsu";
import { getTrending } from "@/lib/db/trending";
import { searchIndex } from "@/lib/mock-data";
import type { AnimeDetail, AnimeSummary } from "@/lib/types";

// Resolves full anime detail: Kitsu first, falling back to local mock data by
// id so the page still renders when the external API is unavailable.
export async function getAnimeDetail(id: string): Promise<AnimeDetail | null> {
  const detail = await kitsuDetail(id);
  if (detail) return detail;

  const local = searchIndex.find((a) => a.id === id);
  if (local) return { ...local };
  return null;
}

// "More Like This": Kitsu franchise relations (padded with popular titles),
// falling back to trending (minus the current title) so the rail always has
// something to show.
export async function getSimilarAnime(
  id: string,
  limit = 12,
): Promise<AnimeSummary[]> {
  const related = await getRelatedAnime(id, limit);
  if (related.length > 0) return related;

  const source = await getTrending(limit + 1);
  return source.filter((a) => a.id !== id).slice(0, limit);
}
