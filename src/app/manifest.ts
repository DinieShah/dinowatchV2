import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DinoWatch — Discover & Stream Anime & Donghua",
    short_name: "DinoWatch",
    description:
      "A fast, editorial anime and donghua discovery and streaming platform. Browse trending series, explore franchise watch orders, and track your watchlist.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#d97706",
    categories: ["entertainment"],
    icons: [
      {
        src: "/icon.svg?v=2",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg?v=2",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
