import "server-only";

export interface WatchlistItem {
  animeId: string;
  title: string;
  posterImage: string | null;
  addedAt: string; // ISO timestamp
}

export interface AddWatchlistInput {
  userId: string;
  animeId: string;
  title: string;
  posterImage?: string | null;
}

// In-memory mock store for frontend showcase
const mockStore = new Map<string, WatchlistItem>();

export async function getWatchlist(
  userId: string,
  limit = 100,
): Promise<WatchlistItem[]> {
  return Array.from(mockStore.values()).slice(0, limit);
}

export async function isInWatchlist(
  userId: string,
  animeId: string,
): Promise<boolean> {
  return mockStore.has(animeId);
}

export async function addToWatchlist(
  input: AddWatchlistInput,
): Promise<WatchlistItem> {
  const item: WatchlistItem = {
    animeId: input.animeId,
    title: input.title,
    posterImage: input.posterImage ?? null,
    addedAt: new Date().toISOString(),
  };
  mockStore.set(input.animeId, item);
  return item;
}

export async function removeFromWatchlist(
  userId: string,
  animeId: string,
): Promise<void> {
  mockStore.delete(animeId);
}
