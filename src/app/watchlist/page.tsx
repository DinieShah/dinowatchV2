import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WatchlistGrid } from "@/components/watchlist-grid";
import { ButtonLink } from "@/components/ui/button";
import { getWatchlist } from "@/lib/db/watchlist";
import { getCurrentUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 bg-paper text-ink">
          <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
            <div className="rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.25] ring-1 ring-inset ring-white/[0.12] p-10 shadow-none">
              <h1 className="font-display text-2xl font-bold text-ink">My List</h1>
              <p className="mt-2 font-sans text-xs text-ink-muted">
                Sign in to save anime and track your list across devices.
              </p>
              <ButtonLink href="/login" size="lg" className="mt-6">
                Sign in →
              </ButtonLink>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const items = await getWatchlist(userId);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper text-ink text-left">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            My List
          </h1>
          <p className="mt-1 font-mono text-xs tabular-nums text-ink-muted">
            {items.length} saved {items.length === 1 ? "title" : "titles"}
          </p>
          <WatchlistGrid initialItems={items} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
