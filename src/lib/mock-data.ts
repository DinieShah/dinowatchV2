import type {
  AnimeSummary,
  ContinueWatchingItem,
  Episode,
  FeaturedAnime,
  WatchData,
} from "@/lib/types";

function svgTile(label: string, w: number, h: number): string {
  const safe = label
    .slice(0, 3)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#111113"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#8E8D8A" font-family="JetBrains Mono, monospace" font-size="${Math.round(Math.min(w, h) * 0.18)}">${safe || "DW"}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function poster(seed: string): string {
  return svgTile(seed, 300, 450);
}
function banner(seed: string): string {
  return svgTile(seed, 1280, 720);
}

export const featuredAnime: FeaturedAnime = {
  id: "frieren-beyond-journey-s-end-c6fbj",
  title: "Frieren: Beyond Journey's End",
  posterImage: poster("frieren"),
  bannerImage: banner("frieren-banner"),
  score: 9.36,
  genres: ["Adventure", "Drama", "Fantasy"],
  year: 2023,
  status: "completed",
  episodeCount: 28,
  synopsis:
    "After the demon king's defeat, the elf mage Frieren outlives her companions and sets out to understand what her journey — and the people in it — truly meant.",
  featuredEpisode: 1,
};

export const trendingAnime: AnimeSummary[] = [
  {
    id: "black-clover-season-2",
    title: "Black Clover Season 2",
    posterImage: poster("blackclover"),
    score: 7.84,
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2026,
    status: "airing",
    episodeCount: 5,
  },
  {
    id: "solo-leveling-season-2-arise-from-the-shadow-3eukp",
    title: "Solo Leveling Season 2: Arise from the Shadow",
    posterImage: poster("sololeveling"),
    score: 8.87,
    genres: ["Action", "Fantasy"],
    year: 2025,
    status: "completed",
    episodeCount: 13,
  },
  {
    id: "one-piece-odmau",
    title: "One Piece",
    posterImage: poster("onepiece"),
    score: 8.73,
    genres: ["Action", "Adventure"],
    year: 1999,
    status: "airing",
    episodeCount: 1180,
  },
  {
    id: "konosuba-god-s-blessing-on-this-wonderful-world-hqfwa",
    title: "KonoSuba: God's Blessing on This Wonderful World!",
    posterImage: poster("konosuba"),
    score: 8.1,
    genres: ["Adventure", "Comedy", "Fantasy"],
    year: 2016,
    status: "completed",
    episodeCount: 10,
  },
  {
    id: "sakamoto-days-sfdxz",
    title: "Sakamoto Days",
    posterImage: poster("sakamoto"),
    score: 7.71,
    genres: ["Action", "Comedy"],
    year: 2025,
    status: "completed",
    episodeCount: 11,
  },
  {
    id: "bleach-thousand-year-blood-war-the-calamity-752db",
    title: "Bleach: Thousand-Year Blood War - The Calamity",
    posterImage: poster("bleach"),
    score: 9.03,
    genres: ["Action", "Supernatural"],
    year: 2024,
    status: "completed",
    episodeCount: 10,
  },
  {
    id: "naruto-shippuden-c8gov",
    title: "Naruto: Shippuden",
    posterImage: poster("naruto"),
    score: 8.15,
    genres: ["Action", "Adventure"],
    year: 2007,
    status: "completed",
    episodeCount: 500,
  },
  {
    id: "frieren-beyond-journey-s-end-c6fbj",
    title: "Frieren: Beyond Journey's End",
    posterImage: poster("frieren"),
    score: 9.36,
    genres: ["Adventure", "Drama", "Fantasy"],
    year: 2023,
    status: "completed",
    episodeCount: 28,
  },
];

export const searchIndex: AnimeSummary[] = [featuredAnime, ...trendingAnime];

export function searchMock(query: string, limit = 6): AnimeSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .filter((a) => a.title.toLowerCase().includes(q))
    .slice(0, limit);
}

function buildEpisodes(
  seed: string,
  count: number,
  fillerEpisodes: number[] = [],
): Episode[] {
  const filler = new Set(fillerEpisodes);
  return Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    return {
      number,
      title: `Episode ${number}`,
      thumbnail: svgTile(`E${number}`, 240, 135),
      durationLabel: "24m",
      isFiller: filler.has(number),
      isAired: true,
    };
  });
}

const watchDataById: Record<string, WatchData> = {
  "frieren-beyond-journey-s-end-c6fbj": {
    anime: featuredAnime,
    currentEpisode: 1,
    episodes: buildEpisodes("frieren", 12, [5, 9]),
    subtitles: [
      { lang: "en", label: "English" },
      { lang: "id", label: "Indonesia" },
      { lang: "ja", label: "日本語" },
    ],
    qualities: [
      { height: 1080, label: "1080p" },
      { height: 720, label: "720p" },
      { height: 480, label: "480p" },
      { height: 360, label: "360p" },
    ],
  },
};

export function getWatchData(id: string, episode?: number): WatchData {
  const base =
    watchDataById[id] ??
    ({
      anime:
        searchIndex.find((a) => a.id === id) ??
        ({
          id,
          title: "Unknown Title",
          posterImage: poster(id),
          genres: [],
          status: "completed",
        } as AnimeSummary),
      currentEpisode: 1,
      episodes: buildEpisodes(id, 12),
    } satisfies WatchData);

  return { ...base, currentEpisode: episode ?? base.currentEpisode };
}

export const continueWatching: ContinueWatchingItem[] = [
  {
    anime: trendingAnime[0],
    episodeNumber: 5,
    progress: 0.62,
    lastWatchedLabel: "Yesterday",
  },
  {
    anime: trendingAnime[1],
    episodeNumber: 8,
    progress: 0.18,
    lastWatchedLabel: "2 days ago",
  },
  {
    anime: trendingAnime[2],
    episodeNumber: 1180,
    progress: 0.91,
    lastWatchedLabel: "Last week",
  },
];
