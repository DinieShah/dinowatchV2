// Playback contract for the internal video service (Source B).
//
// These types describe what the operator's OWN backend returns. They are
// deliberately generic — the app never assumes any particular provider. All
// URLs here must point ONLY to content the operator is licensed/authorized to
// distribute or self-host. No third-party/scraped stream links.

export interface StreamSource {
  /** Absolute URL to a playable rendition (from your own service/CDN). */
  url: string;
  /** "hls" for .m3u8 adaptive manifests, "mp4" for progressive files. */
  type: "hls" | "mp4";
  /** Optional label for the quality menu, e.g. "1080p". Omit for HLS "Auto". */
  quality?: string;
}

export interface StreamSubtitle {
  /** BCP-47-ish code, e.g. "en", "id", "ja". */
  lang: string;
  label: string;
  /** Absolute URL to a .vtt (or .srt converted) track from your own service. */
  url: string;
}

export interface StreamManifest {
  sources: StreamSource[];
  subtitles: StreamSubtitle[];
  /** Optional episode still/poster. */
  poster?: string;
  durationSeconds?: number;
}
