"use client";

import { useState } from "react";

export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export function useSession() {
  const [data] = useState<SessionData>({
    user: {
      id: "demo-user-1",
      name: "Anime Enthusiast",
      email: "demo@dinowatch.app",
    },
  });
  const [isPending] = useState(false);

  return { data, isPending };
}

export const authClient = {
  updateUser: async ({ name }: { name: string }) => {
    return {
      data: { success: true, name },
      error: null as { message?: string } | null,
    };
  },
  changePassword: async (_params: {
    currentPassword?: string;
    newPassword?: string;
    revokeOtherSessions?: boolean;
  }) => {
    return {
      data: { success: true },
      error: null as { message?: string } | null,
    };
  },
};

export const signIn = {
  email: async ({ email }: { email: string; password?: string }) => {
    return {
      data: { user: { id: "demo-user-1", email } },
      error: null as { message?: string } | null,
    };
  },
};

export const signUp = {
  email: async ({
    name,
    email,
  }: {
    name: string;
    email: string;
    password?: string;
  }) => {
    return {
      data: { user: { id: "demo-user-1", name, email } },
      error: null as { message?: string } | null,
    };
  },
};

export async function signOut() {
  return { success: true };
}
