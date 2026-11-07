import { ProfileForm } from "@/components/profile-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper text-ink text-left">
        <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          <h1 className="mb-6 font-display text-3xl font-bold tracking-tight text-ink">
            Profile settings
          </h1>
          {user ? (
            <ProfileForm user={{ name: user.name, email: user.email }} />
          ) : (
            <div className="rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.25] ring-1 ring-inset ring-white/[0.12] p-10 text-center shadow-none">
              <p className="font-sans text-xs text-ink-muted">
                Sign in to manage your profile.
              </p>
              <ButtonLink href="/login" size="lg" className="mt-5">
                Sign in →
              </ButtonLink>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
