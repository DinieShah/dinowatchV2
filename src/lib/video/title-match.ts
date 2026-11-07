export interface NormalizedTitle {
  /** Lower-case alphanumeric tokens with the season marker removed. */
  base: string;
  /** Season number (defaults to 1 when no marker is present). */
  season: number;
}

const ROMAN: Record<string, number> = { ii: 2, iii: 3, iv: 4, v: 5, vi: 6 };
const WORD_ORDINALS: Record<string, number> = {
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
};

export function normalizeTitle(raw: string): NormalizedTitle {
  let s = raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  let season = 1;
  const take = (re: RegExp, pick: (m: RegExpMatchArray) => number): boolean => {
    const m = s.match(re);
    if (!m) return false;
    season = pick(m);
    s = s.replace(re, " ");
    return true;
  };

  if (!take(/\bseason (\d{1,2})\b/, (m) => Number(m[1]))) {
    if (!take(/\b(\d{1,2})(?:st|nd|rd|th) season\b/, (m) => Number(m[1]))) {
      if (!take(/\b(second|third|fourth|fifth|sixth) season\b/, (m) => WORD_ORDINALS[m[1]] ?? 1)) {
        if (!take(/\bs(\d{1,2})\b/, (m) => Number(m[1]))) {
          if (!take(/\b(ii|iii|iv|v|vi)$/, (m) => ROMAN[m[1]] ?? 1)) {
            take(/\b(\d{1,2})$/, (m) => Number(m[1]));
          }
        }
      }
    }
  }

  return { base: s.replace(/\s+/g, " ").trim(), season };
}

function tokenOverlap(a: string, b: string): number {
  const A = new Set(a.split(" ").filter(Boolean));
  const B = new Set(b.split(" ").filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function containsTokensInOrder(text: string, queryTokens: string[]): boolean {
  if (queryTokens.length === 0) return false;
  const words = text.split(" ").filter(Boolean);
  let qi = 0;
  for (const w of words) {
    if (w === queryTokens[qi] || w.startsWith(queryTokens[qi])) {
      qi++;
      if (qi === queryTokens.length) return true;
    }
  }
  return false;
}

/**
 * 4-tier search relevance score (0–100):
 *   1. Exact normalized title / altTitle match -> 100 (with season tie-break: S1=100, S2=99, S3=98)
 *   2. Title starts with normalized query -> 85
 *   3. Title contains all query tokens in order -> 70
 *   4. Fuzzy token overlap -> 0..50
 */
export function scoreSearchRelevance(
  query: string,
  title: string,
  altTitle?: string,
): number {
  const qNorm = normalizeTitle(query);
  if (!qNorm.base) return 0;
  const qTokens = qNorm.base.split(" ").filter(Boolean);

  const candidates = [title, altTitle ?? ""].filter(Boolean);
  let best = 0;

  for (const cand of candidates) {
    const cNorm = normalizeTitle(cand);
    if (!cNorm.base) continue;

    let score = 0;
    const seasonPenalty =
      cNorm.season === qNorm.season
        ? 0
        : Math.min(5, Math.abs(cNorm.season - qNorm.season));

    if (cNorm.base === qNorm.base) {
      score = 100 - seasonPenalty;
    } else if (cNorm.base.startsWith(`${qNorm.base} `) || cNorm.base.startsWith(qNorm.base)) {
      score = 85 - seasonPenalty * 0.5;
    } else if (containsTokensInOrder(cNorm.base, qTokens)) {
      score = 70 - seasonPenalty * 0.5;
    } else {
      score = tokenOverlap(qNorm.base, cNorm.base) * 50;
    }

    if (score > best) best = score;
  }

  return best;
}

export function rankBySearchRelevance<
  T extends { title: string; altTitle?: string },
>(query: string, items: T[]): T[] {
  const q = query.trim();
  if (!q) return items;

  return items
    .map((item, idx) => ({
      item,
      idx,
      score: scoreSearchRelevance(q, item.title, item.altTitle),
    }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map((entry) => entry.item);
}

export interface MatchTarget {
  titles: string[];
  subtype?: string | null;
  episodeCount?: number | null;
  episode: number;
}

export interface ProviderCandidate {
  id: string;
  title: string;
  japaneseTitle?: string;
  type?: string;
  episodes?: number;
}

function typeBucket(t?: string | null): "tv" | "movie" | "other" | null {
  if (!t) return null;
  const v = t.toLowerCase();
  if (v === "tv" || v === "ona") return "tv";
  if (v === "movie") return "movie";
  return "other";
}

export function scoreCandidate(target: MatchTarget, c: ProviderCandidate): number {
  const wanted = target.titles.filter(Boolean).map(normalizeTitle);
  const offered = [c.title, c.japaneseTitle ?? ""].filter(Boolean).map(normalizeTitle);

  let titleScore = 0;
  for (const w of wanted) {
    for (const o of offered) {
      const sameSeason = w.season === o.season;
      let s: number;
      if (w.base === o.base) s = sameSeason ? 100 : 20;
      else s = sameSeason ? tokenOverlap(w.base, o.base) * 70 : 0;
      titleScore = Math.max(titleScore, s);
    }
  }

  let score = titleScore;

  const wantType = typeBucket(target.subtype);
  const gotType = typeBucket(c.type);
  if (wantType && gotType) score += wantType === gotType ? 15 : -45;

  if (typeof c.episodes === "number" && c.episodes > 0) {
    if (c.episodes < target.episode) score -= 60;
    else if (target.episodeCount && c.episodes === target.episodeCount) score += 10;
  }

  return score;
}

export const MATCH_THRESHOLD = 55;

export function pickBestCandidate(
  target: MatchTarget,
  candidates: ProviderCandidate[],
): ProviderCandidate | null {
  let best: ProviderCandidate | null = null;
  let bestScore = -Infinity;
  for (const c of candidates) {
    const s = scoreCandidate(target, c);
    if (s > bestScore) {
      best = c;
      bestScore = s;
    }
  }
  return best && bestScore >= MATCH_THRESHOLD ? best : null;
}
