import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { getHistory, upsertHistory } from "@/lib/db/history";

// userId is always derived from the authenticated session.

// GET /api/history?limit=20 → { data: WatchHistoryItem[] }
export async function GET(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 50);

  try {
    return NextResponse.json({ data: await getHistory(userId, limit) });
  } catch {
    return NextResponse.json(
      { error: "Failed to load watch history" },
      { status: 500 },
    );
  }
}

// POST /api/history → upsert playback progress → { data: WatchHistoryItem }
export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const animeId = typeof b.animeId === "string" ? b.animeId.trim() : "";
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const episodeNumber = Number(b.episodeNumber);
  const timestampSeconds =
    b.timestampSeconds === undefined ? 0 : Number(b.timestampSeconds);
  const posterImage =
    typeof b.posterImage === "string" ? b.posterImage : null;

  const errors: string[] = [];
  if (!animeId) errors.push("animeId is required");
  if (!title) errors.push("title is required");
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1) {
    errors.push("episodeNumber must be a positive integer");
  }
  if (!Number.isFinite(timestampSeconds) || timestampSeconds < 0) {
    errors.push("timestampSeconds must be a non-negative number");
  }
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  try {
    const data = await upsertHistory({
      userId,
      animeId,
      title,
      posterImage,
      episodeNumber,
      timestampSeconds: Math.floor(timestampSeconds),
    });
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save watch history" },
      { status: 500 },
    );
  }
}
