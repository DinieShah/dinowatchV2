"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth-client";

interface StatusMessage {
  kind: "ok" | "error";
  text: string;
}

export function ProfileForm({
  user,
}: {
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [nameStatus, setNameStatus] = useState<StatusMessage | null>(null);
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<StatusMessage | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameStatus(null);
    setSavingName(true);
    try {
      const res = await authClient.updateUser({ name: name.trim() });
      if (res.error) {
        setNameStatus({ kind: "error", text: res.error.message ?? "Failed." });
      } else {
        setNameStatus({ kind: "ok", text: "Display name updated." });
        router.refresh();
      }
    } finally {
      setSavingName(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus(null);
    setSavingPw(true);
    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (res.error) {
        setPwStatus({ kind: "error", text: res.error.message ?? "Failed." });
      } else {
        setPwStatus({ kind: "ok", text: "Password changed." });
        setCurrentPassword("");
        setNewPassword("");
      }
    } finally {
      setSavingPw(false);
    }
  }

  const field =
    "mt-1 w-full rounded-[2px] border border-white/[0.08] bg-white/[0.04] px-3 py-2 font-sans text-xs text-ink focus:border-white/25 focus:bg-white/[0.08] focus:outline-none transition";

  const panelClass =
    "rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.25] ring-1 ring-inset ring-white/[0.12] p-5 shadow-none text-left";

  return (
    <div className="space-y-6">
      <section className={panelClass}>
        <h2 className="font-display text-sm font-semibold text-ink">Account</h2>
        <p className="mt-1 font-mono text-xs text-ink-muted">{user.email}</p>
      </section>

      <form onSubmit={saveName} className={panelClass}>
        <h2 className="font-display text-sm font-semibold text-ink">Display name</h2>
        <label className="mt-3 block font-mono text-xs">
          <span className="text-ink-muted">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={field}
          />
        </label>
        {nameStatus && (
          <p
            className={`mt-2 font-mono text-xs ${nameStatus.kind === "ok" ? "text-emerald-400" : "text-red-400"}`}
          >
            {nameStatus.text}
          </p>
        )}
        <Button type="submit" disabled={savingName} size="sm" className="mt-4">
          {savingName ? "Saving…" : "Save"}
        </Button>
      </form>

      <form onSubmit={changePassword} className={panelClass}>
        <h2 className="font-display text-sm font-semibold text-ink">Password</h2>
        <label className="mt-3 block font-mono text-xs">
          <span className="text-ink-muted">Current password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={field}
          />
        </label>
        <label className="mt-3 block font-mono text-xs">
          <span className="text-ink-muted">New password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={field}
          />
        </label>
        {pwStatus && (
          <p
            className={`mt-2 font-mono text-xs ${pwStatus.kind === "ok" ? "text-emerald-400" : "text-red-400"}`}
          >
            {pwStatus.text}
          </p>
        )}
        <Button type="submit" disabled={savingPw} size="sm" className="mt-4">
          {savingPw ? "Updating…" : "Change password"}
        </Button>
      </form>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={async () => {
          await signOut();
          router.push("/");
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
