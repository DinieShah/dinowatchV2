import { NextResponse } from "next/server";
import { getFeaturedEpisode } from "@/lib/db/featured";

// GET /api/featured → { data: FeaturedAnime | null }
// Serves the editorial featured episode for the Home Page hero from local DB.
export async function GET() {
  try {
    const data = await getFeaturedEpisode();
    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "public, s-maxage=60" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load featured episode" },
      { status: 500 },
    );
  }
}
