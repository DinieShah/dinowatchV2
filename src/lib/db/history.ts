import "server-only";

export interface WatchHistoryItem {
  animeId: string;
  title: string;
  posterImage: string | null;
  episodeNumber: number;
  timestampSeconds: number;
  lastWatched: string; // ISO timestamp
}

export interface UpsertHistoryInput {
  userId: string;
  animeId: string;
  title: string;
  posterImage?: string | null;
  episodeNumber: number;
  timestampSeconds: number;
}

const mockHistoryStore = new Map<string, WatchHistoryItem>();

export async function getHistory(
  userId: string,
  limit = 20,
): Promise<WatchHistoryItem[]> {
  return Array.from(mockHistoryStore.values()).slice(0, limit);
}

export async function getHistoryEntry(
  userId: string,
  animeId: string,
): Promise<WatchHistoryItem | null> {
  return mockHistoryStore.get(animeId) ?? null;
}

export async function getResumePoint(
  userId: string,
  animeId: string,
): Promise<{ episodeNumber: number; timestampSeconds: number } | null> {
  const entry = await getHistoryEntry(userId, animeId);
  return entry
    ? {
        episodeNumber: entry.episodeNumber,
        timestampSeconds: entry.timestampSeconds,
      }
    : null;
}

export async function upsertHistory(
  input: UpsertHistoryInput,
): Promise<WatchHistoryItem> {
  const item: WatchHistoryItem = {
    animeId: input.animeId,
    title: input.title,
    posterImage: input.posterImage ?? null,
    episodeNumber: input.episodeNumber,
    timestampSeconds: input.timestampSeconds,
    lastWatched: new Date().toISOString(),
  };
  mockHistoryStore.set(input.animeId, item);
  return item;
}
