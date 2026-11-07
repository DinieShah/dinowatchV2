import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit, JetBrains_Mono } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://dinowatch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DinoWatch — Discover & Stream Anime & Donghua",
    template: "%s | DinoWatch",
  },
  description:
    "A fast, editorial anime and donghua discovery and streaming platform. Browse trending series, explore franchise watch orders, and track your watchlist.",
  applicationName: "DinoWatch",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DinoWatch",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
      { url: "/icon", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.svg?v=2",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "DinoWatch — Discover & Stream Anime & Donghua",
    description:
      "A fast, editorial anime and donghua discovery and streaming platform.",
    url: SITE_URL,
    type: "website",
    siteName: "DinoWatch",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DinoWatch — Discover & Stream Anime & Donghua",
    description:
      "A fast, editorial anime and donghua discovery and streaming platform.",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DinoWatch",
  url: SITE_URL,
  description:
    "A fast, editorial anime and donghua discovery and streaming platform.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/discover?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const safeJsonLd = JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c");
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans overflow-x-clip selection:bg-accent/20 selection:text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd }}
        />
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
