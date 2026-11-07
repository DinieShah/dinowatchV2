"use client";

import { useEffect, useState } from "react";
import type { StreamManifest } from "@/lib/video/types";

interface StreamState {
  manifest: StreamManifest | null;
  isLoading: boolean;
  error: string | null;
}

// Client hook that loads the playback manifest for an episode from the internal
// video service (via /api/stream/:id). Accepts optional `server` ("anikoto" | "consumet").
// re-fetches when the anime/episode changes. When the service is unconfigured
// the route returns { data: null } → the player shows its fallback state.
//
// Loading/reset is derived at render time from whether the last resolved fetch
// matches the current params (avoids setState-in-effect / cascading renders).
export function useStream(
  animeId: string, 
  episode: number, 
  server: "anikoto" | "consumet" = "anikoto"
): StreamState {
  const key = `${animeId}:${episode}:${server}`;
  const [resolved, setResolved] = useState<{
    key: string;
    manifest: StreamManifest | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/stream/${encodeURIComponent(animeId)}?ep=${episode}&server=${server}`, {
      signal: controller.signal,
    })
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Request failed")),
      )
      .then((json: { data: StreamManifest | null }) => {
        setResolved({ key, manifest: json.data, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setResolved({
          key,
          manifest: null,
          error: err instanceof Error ? err.message : "Failed to load stream",
        });
      });

    return () => controller.abort();
  }, [animeId, episode, server, key]);

  // Fresh only when the resolved result is for the current params.
  const fresh = resolved?.key === key ? resolved : null;
  return {
    manifest: fresh?.manifest ?? null,
    isLoading: fresh === null,
    error: fresh?.error ?? null,
  };
}