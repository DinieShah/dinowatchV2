import { NextResponse } from "next/server";
import {
  getTrendingAnime,
  searchAnime,
  KITSU_PAGE_LIMIT,
} from "@/lib/anime/kitsu";
import type { AnimeSummary } from "@/lib/types";

// GET /api/discover?q=&page=N → { data: AnimeSummary[] }
// Paginated Discover results used by the "View more" button. Search page when
// `q` is present, otherwise the trending/popular page. Kitsu caps collection
// pages at 20 items. Fails soft to [].
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const results =
    q.length >= 2
      ? await searchAnime(q, KITSU_PAGE_LIMIT, page)
      : await getTrendingAnime(KITSU_PAGE_LIMIT, page);

  // Dedupe by id defensively (providers can repeat entries across pages).
  const seen = new Set<string>();
  const data: AnimeSummary[] = results.filter((a) =>
    seen.has(a.id) ? false : seen.add(a.id),
  );
  return NextResponse.json({ data });
}
