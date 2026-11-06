# minarepakistan.com

Independent, non-commercial English visitor guide for **Minar-e-Pakistan** in Lahore, Pakistan.
This is an unofficial third-party information site — not affiliated with the Government of Punjab,
the Parks & Horticulture Authority, or any official body.

## Stack

- **Astro 7** + **@astrojs/cloudflare 14.3.2**, deployed to **Cloudflare Workers**
- A custom **`src/worker.js`** wraps the Astro server entrypoint
  (`@astrojs/cloudflare/entrypoints/server`): it issues apex/www → `https` 308 redirects,
  attaches security headers (HSTS, CSP, X-Frame-Options, etc.), and serves a noindex 404 fallback.
  `wrangler.jsonc` uses `run_worker_first: true` and serves static assets from `./dist/client`.
- **Tailwind 4** via `@tailwindcss/vite` (only the base reset is used; component styling is
  hand-written in `src/styles/global.css`)
- **@astrojs/sitemap**
- **Google Analytics 4** (`G-HXM22WWPKP`) loaded only after the visitor accepts cookies

## Pages

- `src/pages/index.astro` — long-form home page (hero, facts, hours, tickets, transport, reviews, sources)
- `src/pages/[topic].astro` — 40 data-driven long-tail topic pages, content in `src/data/topics.ts`,
  rendered by `src/components/TopicPage.astro` (WebPage + BreadcrumbList + FAQPage JSON-LD)
- `src/pages/privacy.astro` / `terms.astro` / `cookies.astro` — legal pages, `noindex`,
  wrapped in `src/components/LegalLayout.astro`
- `src/pages/404.astro` — custom 404 page (`noindex`)
- `src/lib/weather.ts` — server-side Open-Meteo weather model (an estimate, not live on-site observation)

## Images

Real photographs live in `public/images/` (`minar.jpg`, `badshahi.jpg`, `wazir.jpg`); see
`IMAGE-CREDITS.md` for sources. The Open Graph image uses a local photo
(`/images/minar.jpg` via `OG_IMAGE` in `src/data/site.ts`).

## Facts & E-E-A-T

- All monument facts (name, coordinates, rating snapshot, maps link, sources) live in one place:
  `src/data/site.ts`.
- Reviews are an aggregate **snapshot mirrored from Google Maps**; no individual named reviews are
  fabricated. The sync month is `src/data/site.ts` → `syncMonth` and `src/data/topics.ts` → `VERIFIED`.
- Ticket / timings / transport details that change are labelled "confirm on site" where appropriate.

## Configuration

- `astro.config.mjs` sets `site` to `https://minarepakistan.com` (override with the `SITE_URL`
  environment variable if needed). This drives canonical URLs, absolute Open Graph tags, and the sitemap.

## Build & deploy

```bash
pnpm install
pnpm build          # astro build → dist/client + dist/server
wrangler deploy     # serves via worker.js + static assets
```
