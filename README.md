# minarepakistan.com

Independent, non-commercial English travel guide for **Minar-e-Pakistan** in Lahore, Pakistan.
This is an unofficial third-party information site — it is not affiliated with the Government of
Punjab, the Parks & Horticulture Authority, or any official body.

## Stack

- **Astro 7** (static, prerendered pages)
- **@astrojs/cloudflare 14.3.2** deployed to **Cloudflare Workers**
  (`wrangler.jsonc`: `main` is the adapter entrypoint, static assets resolve from `./dist/client`)
- **Tailwind 4** via `@tailwindcss/vite` (only the base reset is used; component styling is hand-written in `src/styles/global.css`)
- **@astrojs/sitemap** (enabled once `site` is set)
- **Google Analytics 4** (`G-HXM22WWPKP`) loaded only after the visitor accepts cookies

## Pages

- `src/pages/index.astro` — single long-form home page (hero, facts, hours, tickets, transport,
  weather, reviews, sources, and a long-tail topic cluster).
- `src/pages/[topic].astro` — 40 data-driven long-tail topic pages, content in `src/data/topics.ts`,
  rendered by `src/components/TopicPage.astro` (WebPage + BreadcrumbList + FAQPage JSON-LD).
- `src/pages/privacy.astro` / `terms.astro` / `cookies.astro` — legal pages, `noindex`, wrapped in
  `src/components/LegalLayout.astro`.

## Localization & language

The site is **single-language (English)**. All visible copy lives in `src/pages/*`,
`src/data/site.ts`, and `src/data/topics.ts`. Do not mix other-language strings into the source.

## Facts & E-E-A-T

- All monument facts (name, coordinates, rating snapshot, maps link, sources) live in one place:
  `src/data/site.ts`.
- Reviews are an aggregate **snapshot mirrored from Google Maps**; no individual named reviews are
  fabricated. The sync month is `src/data/site.ts` → `syncMonth` and `src/data/topics.ts` →
  `VERIFIED`.
- Ticket / timings / transport details that change are labelled "confirm on site" where appropriate.

## Images

Image **binaries cannot be bundled** in this repo (the build container has no egress to download
them), so all photographs are referenced from **Wikimedia Commons** thumbnail URLs. The Open Graph
image (`OG_IMAGE` in `src/data/site.ts`) is a stable Wikimedia thumbnail of the monument.

## Configuration

- `astro.config.mjs` sets `site` to `https://minarepakistan.com` (override with the `SITE_URL`
  environment variable if needed). This drives canonical URLs, absolute Open Graph tags, and the
  sitemap.
- `src/data/site.ts` exports `DOMAIN` and `OG_IMAGE`.

## Build & deploy

```bash
pnpm install
pnpm build          # astro build (Cloudflare adapter → dist/client + dist/server)
wrangler deploy
```

Set `SITE_URL` in the deploy environment if you need a non-default domain.
