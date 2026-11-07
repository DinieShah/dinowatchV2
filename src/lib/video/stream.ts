import "server-only";

import type { StreamManifest } from "@/lib/video/types";
import type { Episode } from "@/lib/types";
import { getEpisodes as getMockEpisodes } from "@/lib/anime/kitsu";

/**
 * Demo Stream Manifest Provider for Frontend UI Showcase
 * Returns a high-performance open HLS stream to demonstrate the custom player UI
 */
export async function getStreamManifest(
  animeId: string,
  episode: number,
  server: "anikoto" | "consumet" = "anikoto",
): Promise<StreamManifest | null> {
  return {
    sources: [
      {
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        type: "hls",
      },
    ],
    subtitles: [
      {
        lang: "en",
        label: "English",
        url: "",
      },
      {
        lang: "ja",
        label: "Japanese",
        url: "",
      },
    ],
  };
}

export async function getSyncedEpisodes(
  animeSlug: string,
  titleEn: string | undefined,
  titleRomaji: string | undefined,
  fallbackThumbnail: string,
): Promise<Episode[]> {
  return await getMockEpisodes(animeSlug, fallbackThumbnail);
}
