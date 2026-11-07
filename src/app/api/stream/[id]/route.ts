import { NextResponse } from "next/server";
import { getStreamManifest } from "@/lib/video/stream";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const episode = Number(searchParams.get("ep") ?? "1") || 1;
  const server = (searchParams.get("server") as "anikoto" | "consumet") || "anikoto";

  try {
    const data = await getStreamManifest(id, episode, server);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Stream unavailable", data: null },
      { status: 502 },
    );
  }
}
