"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "@/components/auth-nav";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/watchlist", label: "My List" },
];

export function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-3 sm:gap-4 sm:px-5 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
        <Link href="/" aria-label="DinoWatch home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[2px] px-3 py-1.5 font-sans text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] ${
                isActive(item.href)
                  ? "border border-white/[0.12] bg-white/[0.12] ring-1 ring-inset ring-white/[0.08] text-ink"
                  : "border border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto w-full max-w-xs">
          <SearchBar />
        </div>
        <AuthNav />
      </div>

      {/* Mobile nav row */}
      <nav
        className="mx-auto mt-2 flex max-w-7xl items-center gap-1 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 py-1 md:hidden"
        aria-label="Mobile navigation"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-[2px] px-3 py-1 font-sans text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] hover:bg-white/[0.12] ${
              isActive(item.href)
                ? "border border-white/[0.12] bg-white/[0.12] text-ink"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
