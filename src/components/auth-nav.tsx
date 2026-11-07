"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export function AuthNav() {
  const { data, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <span className="h-9 w-16 shrink-0 animate-pulse rounded-[2px] border border-hairline bg-white/[0.06]" />
    );
  }

  if (!data?.user) {
    return (
      <ButtonLink href="/login" size="sm" className="shrink-0">
        Sign in
      </ButtonLink>
    );
  }

  const name = data.user.name || data.user.email;

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/profile"
        className="hidden max-w-[8rem] truncate font-mono text-xs text-ink-muted transition hover:text-ink sm:inline"
      >
        {name}
      </Link>
      <Button variant="secondary" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
