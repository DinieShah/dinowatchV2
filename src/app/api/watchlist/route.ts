import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "@/lib/db/watchlist";

// userId is always derived from the authenticated session; client-supplied ids
// are ignored.

// GET /api/watchlist → { data: WatchlistItem[] }
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    return NextResponse.json({ data: await getWatchlist(userId) });
  } catch {
    return NextResponse.json(
      { error: "Failed to load watchlist" },
      { status: 500 },
    );
  }
}

// POST /api/watchlist → add → { data: WatchlistItem }
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
  const posterImage =
    typeof b.posterImage === "string" ? b.posterImage : null;

  const errors: string[] = [];
  if (!animeId) errors.push("animeId is required");
  if (!title) errors.push("title is required");
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  try {
    const data = await addToWatchlist({ userId, animeId, title, posterImage });
    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 },
    );
  }
}

// DELETE /api/watchlist?animeId=... → { ok: true }
export async function DELETE(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("animeId");
  if (!animeId) {
    return NextResponse.json({ error: "animeId is required" }, { status: 400 });
  }
  try {
    await removeFromWatchlist(userId, animeId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 },
    );
  }
}
