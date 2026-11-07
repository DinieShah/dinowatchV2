import Link from "next/link";
import { Logo } from "@/components/logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Browse",
    links: [
      { href: "/", label: "Home" },
      { href: "/discover", label: "Discover" },
      { href: "/watchlist", label: "My List" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/profile", label: "Profile" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-hairline bg-paper px-4 py-10 text-left sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs font-sans text-xs leading-relaxed text-ink-muted">
            Discover and track anime. Browse seasonal shows, build your
            watchlist, and pick up right where you left off.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-xs font-semibold text-ink">
              {col.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-ink-muted transition hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-hairline pt-6 font-mono text-[11px] text-ink-faint">
        DinoWatch — discover &amp; track anime.
      </div>
    </footer>
  );
}
