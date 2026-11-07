import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpisodePanel } from "@/components/episode-panel";
import { FranchiseWatchOrder } from "@/components/franchise-watch-order";
import { SiteHeader } from "@/components/site-header";
import { WatchExperience } from "@/components/watch-experience";
import { getAnimeDetail } from "@/lib/anime/detail";
import { getFranchiseWatchOrder } from "@/lib/anime/kitsu";
import { getResumePoint } from "@/lib/db/history";
import { getCurrentUserId } from "@/lib/session";
import { getSyncedEpisodes } from "@/lib/video/stream";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeDetail(id);
  return { title: anime ? `Watch ${anime.title} — DinoWatch` : "Watch — DinoWatch" };
}

async function getNextAiring(title: string) {
  try {
    const query = `
      query ($search: String) {
        Media (search: $search, type: ANIME) {
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
        }
      }
    `;
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: title } }),
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data?.data?.Media?.nextAiringEpisode || null;
  } catch {
    return null;
  }
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = await params;
  const { ep } = await searchParams;

  const anime = await getAnimeDetail(id);
  if (!anime) notFound();

  const [episodes, franchiseItems, rawNextAiring, userId] = await Promise.all([
    getSyncedEpisodes(
      anime.id,
      anime.title,
      anime.title,
      anime.posterImage,
    ),
    getFranchiseWatchOrder(anime.id, anime),
    anime.status === "airing" ? getNextAiring(anime.title) : Promise.resolve(null),
    getCurrentUserId(),
  ]);

  const maxReleasedEp =
    episodes.length > 0 ? Math.max(...episodes.map((e) => e.number)) : 0;
  const nextAiring =
    rawNextAiring && rawNextAiring.episode > maxReleasedEp
      ? rawNextAiring
      : null;

  const currentEpisode = ep ? Number(ep) || 1 : 1;

  const resume = userId ? await getResumePoint(userId, anime.id) : null;
  const resumeSeconds =
    resume && resume.episodeNumber === currentEpisode
      ? resume.timestampSeconds
      : 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <WatchExperience
              anime={anime}
              currentEpisode={currentEpisode}
              resumeSeconds={resumeSeconds}
              nextAiring={nextAiring}
            />
            <FranchiseWatchOrder items={franchiseItems} />
          </div>

          <aside>
            <EpisodePanel
              animeId={anime.id}
              episodes={episodes}
              currentEpisode={currentEpisode}
              nextAiring={nextAiring}
            />
          </aside>
        </div>
      </main>
    </>
  );
}
