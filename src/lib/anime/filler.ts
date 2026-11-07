import "server-only";

// Fetches filler episode numbers for an anime from a community animefillerlist
// API. Metadata only. Fails soft to [] so the episode list still renders when
// the API is unconfigured or unreachable. Configure ANIMEFILLERLIST_API_BASE to
// enable; the returned numbers are merged into the episode list as `isFiller`.
const BASE = process.env.ANIMEFILLERLIST_API_BASE;

export async function getFillerEpisodes(slug: string): Promise<number[]> {
  if (!BASE || !slug) return [];
  try {
    const res = await fetch(
      `${BASE}/${encodeURIComponent(slug)}`,
      { signal: AbortSignal.timeout(6000), cache: "no-store" },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      episodes?: { number: number; type?: string }[];
      fillerEpisodes?: number[];
    };
    if (Array.isArray(json.fillerEpisodes)) return json.fillerEpisodes;
    return (json.episodes ?? [])
      .filter((e) => e.type === "filler" || e.type === "mixed")
      .map((e) => e.number);
  } catch {
    return [];
  }
}
