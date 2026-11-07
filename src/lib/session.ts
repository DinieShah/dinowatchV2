import "server-only";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

// Mock session provider for frontend UI showcase
export async function getCurrentUser(): Promise<User | null> {
  return {
    id: "demo-user-1",
    name: "Anime Enthusiast",
    email: "demo@dinowatch.app",
    image: null,
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  return "demo-user-1";
}
