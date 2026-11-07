"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth-client";

const inputClass =
  "mt-1 w-full rounded-[2px] border border-white/[0.08] bg-white/[0.04] px-3 py-2 font-sans text-xs text-ink focus:border-white/25 focus:bg-white/[0.08] focus:outline-none transition";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = isSignup
        ? await signUp.email({ name, email, password })
        : await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Something went wrong.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-16 w-full max-w-sm rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.25] ring-1 ring-inset ring-white/[0.12] p-7 text-left shadow-none"
    >
      <h1 className="font-display text-xl font-bold text-ink">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-1 font-sans text-xs text-ink-muted">
        {isSignup
          ? "Track your anime and sync across devices."
          : "Sign in to your DinoWatch account."}
      </p>

      {isSignup && (
        <label className="mt-5 block font-mono text-xs">
          <span className="text-ink-muted">Display name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>
      )}

      <label className="mt-4 block font-mono text-xs">
        <span className="text-ink-muted">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
        />
      </label>

      <label className="mt-4 block font-mono text-xs">
        <span className="text-ink-muted">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className={inputClass}
        />
      </label>

      {error && (
        <p className="mt-3 rounded-[2px] border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" disabled={busy} className="mt-6 w-full">
        {busy ? "Please wait…" : isSignup ? "Sign up →" : "Sign in →"}
      </Button>

      <p className="mt-4 text-center font-sans text-xs text-ink-muted">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to DinoWatch?{" "}
            <Link href="/signup" className="font-semibold text-ink hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
