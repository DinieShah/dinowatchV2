# DinoWatch v2 — Modern Editorial Anime Platform (Frontend & Design System)

A fast, editorial anime discovery and streaming web application built with **Next.js 16 (Turbopack)**, **React 19**, and **Tailwind CSS v4**.

Features a refined, bespoke design system with clean modern typography (*Geist* & *Geist Mono*), zero-elevation hairline borders, and deep frosted glass surfaces.

---

## Highlights

- **Deep Frosted Glass UI**: Custom backdrop filter textures (`backdrop-blur-2xl`, inner specular highlights `ring-1 ring-inset ring-white/[0.12]`, and hairline borders).
- **Clean Modern Typography**:
  - *Geist* for clean, legible modern headings and body text
  - *Geist Mono* for timestamps, badges, and metadata tags
- **Responsive Media Player**: Custom video container supporting HLS.js streaming, subtitles, quality selectors, and keyboard navigation.
- **Franchise Watch Order Rail**: Chronological franchise timeline (Prequels, Sequels, OVAs, Side Stories) directly underneath playback.
- **Top 10 Trends**: Dynamic tabbed horizontal carousel (Day / Week / Month) with smooth edge fade and custom scroll rails.
- **Self-Contained & Instant Dev**: Zero database or external API dependencies required out of the box—clone and run in seconds.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Actions)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Streaming**: [HLS.js](https://github.com/video-dev/hls.js/)
- **Icons & Media**: Custom SVG branding & Next.js Image optimization

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm run start
```

---

## Architecture Overview

```text
src/
├── app/                  # Next.js App Router pages
│   ├── anime/[id]/       # Anime detail page & franchise views
│   ├── discover/         # Search & filter discovery experience
│   ├── watch/[id]/       # Episode player & watch order timeline
│   ├── layout.tsx        # Global shell with font providers
│   └── page.tsx          # Homepage (Hero carousel, Top 10, rails)
├── components/           # Reusable UI & layout components
│   ├── hero-carousel.tsx # Floating hero carousel
│   ├── top-ten-section.tsx# Tabbed top-ten scroller
│   ├── video-player.tsx  # HLS video player interface
│   ├── franchise-watch-order.tsx # Watch order timeline
│   └── ui/               # Core design system primitives (buttons, badges, images)
└── lib/                  # Utilities, mock data, and types
    ├── mock-data.ts      # Standalone data fixtures
    └── types.ts          # Core domain models
```

---

## License

MIT License. Crafted for modern anime and donghua enthusiasts.
