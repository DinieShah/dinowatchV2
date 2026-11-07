import { DiscoverResults } from "@/components/discover-results";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { searchAnime } from "@/lib/anime/search";
import { getTrending } from "@/lib/db/trending";
import type { AnimeSummary } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let results: AnimeSummary[];
  let heading: string;

  if (query.length >= 2) {
    const { data } = await searchAnime(query, 20);
    results = data;
    heading = `Results for “${query}”`;
  } else {
    results = await getTrending(20);
    heading = "Browse trending";
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper text-ink text-left">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="font-mono text-xs text-ink-muted">
            {query.length >= 2 ? "Search Index" : "Catalog"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h1>
          {results.length === 0 ? (
            <div className="mt-10 rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.25] ring-1 ring-inset ring-white/[0.12] p-12 text-center shadow-none">
              <p className="font-sans text-xs text-ink-muted">
                No anime found for “{query}”. Try a different search keyword.
              </p>
            </div>
          ) : (
            <DiscoverResults key={query} results={results} query={query} />
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
