# Walled City of Lahore — Astro site

Single-page Urdu RTL tourism site for the Walled City of Lahore.

## Stack
- Astro 7.3.3
- Tailwind CSS 4.3.3 via `@tailwindcss/vite`
- TypeScript 6.0.3 (kept on 6.x because current `@astrojs/check` does not support TypeScript 7's native compiler API)
- `@astrojs/cloudflare` 14.3.2
- pnpm 12.4.2
- Node 22.23.2 LTS

## Domain / site URL
There is exactly one source of truth for the site's public URL in `astro.config.mjs`:

```js
const site = process.env.SITE_URL?.trim() || undefined;
```

Set `SITE_URL=https://your-real-domain.com` at build time. When it is absent:
- build is designed to continue;
- canonical / `og:url` / absolute JSON-LD URL are omitted;
- sitemap integration is not enabled;
- no placeholder domain is inserted.

## Commands
```bash
corepack enable
corepack prepare pnpm@12.4.2 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

## Cloudflare Workers
`wrangler.jsonc` targets `./dist/_worker.js/index.js` and serves static assets from `./dist`.

## GA4
Configured with `G-HXM22WWPKP`.

## Note about photos
The source page uses real Wikimedia Commons photographs. This runtime could not download image binaries due container egress/DNS restrictions, so the delivered source currently references Wikimedia thumbnail URLs. See `IMAGE-CREDITS.md` for exact files and licenses.
