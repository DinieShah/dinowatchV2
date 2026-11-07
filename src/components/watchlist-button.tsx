"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function WatchlistButton({
  animeId,
  title,
  posterImage,
  initialSaved,
}: {
  animeId: string;
  title: string;
  posterImage?: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      const res = next
        ? await fetch("/api/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, title, posterImage }),
          })
        : await fetch(
            `/api/watchlist?animeId=${encodeURIComponent(animeId)}`,
            { method: "DELETE" },
          );
      if (!res.ok) setSaved(!next);
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant={saved ? "primary" : "secondary"}
      size="lg"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
    >
      <span className="font-mono">{saved ? "✓" : "+"}</span>
      <span>{saved ? "In My List" : "Add to List"}</span>
    </Button>
  );
}
