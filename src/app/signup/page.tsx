import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper px-4 pb-16 text-ink">
        <AuthForm mode="signup" />
      </main>
      <SiteFooter />
    </>
  );
}
