import "server-only";

import { searchAnime as kitsuSearch } from "@/lib/anime/kitsu";
import { searchMock } from "@/lib/mock-data";
import type { AnimeSummary } from "@/lib/types";

export interface SearchResult {
  data: AnimeSummary[];
  source: "kitsu" | "fallback";
}

// Anime search — powered by Kitsu (public metadata). If Kitsu is unavailable
// or returns nothing, degrades gracefully to a local title match instead of
// showing nothing. Returns empty for short/empty queries.
export async function searchAnime(
  query: string,
  limit = 20,
): Promise<SearchResult> {
  const q = query.trim();
  if (q.length < 2) return { data: [], source: "kitsu" };

  const data = await kitsuSearch(q, limit);
  if (data.length > 0) return { data, source: "kitsu" };

  // Offline/outage fallback: match against the small local title index.
  return { data: searchMock(q, limit), source: "fallback" };
}
