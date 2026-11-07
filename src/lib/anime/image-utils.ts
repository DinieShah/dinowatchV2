export function buildMonogramDataUri(
  label = "DW",
  w = 300,
  h = 450,
): string {
  const safe = String(label || "DW")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const text = safe || "DW";
  const fontSize = Math.round(Math.min(w, h) * 0.18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#111113"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#8E8D8A" font-family="JetBrains Mono, monospace" font-size="${fontSize}">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const INVALID_TOKENS = new Set([
  "",
  "null",
  "undefined",
  "n/a",
  "na",
  "none",
  "false",
  "#",
  "about:blank",
  "?",
]);

export function validateImageUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;

  // Strip surrounding whitespace and stray single/double quotes (e.g. "'" from empty url('') scrapes)
  let cleaned = raw.trim().replace(/^['"`\s]+|['"`\s]+$/g, "").trim();
  if (!cleaned || cleaned.length < 5) return null;
  if (INVALID_TOKENS.has(cleaned.toLowerCase())) return null;

  if (cleaned.startsWith("data:image/")) {
    return cleaned;
  }

  // Fix protocol-relative URLs (//cdn.example.com/... -> https://cdn.example.com/...)
  if (cleaned.startsWith("//")) {
    cleaned = `https:${cleaned}`;
  }

  // Encode unescaped spaces if present
  if (/\s/.test(cleaned)) {
    cleaned = encodeURI(cleaned);
  }

  try {
    const parsed = new URL(cleaned);
    if (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      parsed.hostname &&
      parsed.hostname.includes(".")
    ) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Universal image URL sanitizer.
 * Validates `url`; if invalid, validates `fallbackUrl`; if both fail, returns a
 * deterministic `data:image/svg+xml;utf8,...` monogram placeholder so `next/image`
 * never receives a malformed URL string on any route.
 */
export function sanitizeImageUrl(
  url: unknown,
  fallbackUrl?: unknown,
  label = "DW",
): string {
  const primary = validateImageUrl(url);
  if (primary) return primary;

  const secondary = validateImageUrl(fallbackUrl);
  if (secondary) return secondary;

  return buildMonogramDataUri(label);
}
