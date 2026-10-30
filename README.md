# Minar-e-Pakistan independent visitor guide

The existing English single-page guide includes the Urdu place name with language/direction markup. It does not have a separate Urdu translation route. Astro server output, Cloudflare adapter, Tailwind Vite integration and server-side model weather remain.

Use Node22.23.2 and pnpm12.4.2 with the committed frozen lock/workspace allowances. Dependencies are unchanged.

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
npx wrangler dev --ip 127.0.0.1
```

Observed production build/deploy commands are pnpm run build and npx wrangler deploy. Local validation is not publication approval. The root config and generated entry must include the canonical/error guard before asset serving; Worker-first delivery is required.

Current gate hours, ordinary admission, tower ascent and facility access are not established by historical park descriptions. Maps rating is a dated third-party snapshot, excluded from rating markup. Construction began in1960; the Lahore Resolution is1940. See the public source section and IMAGE-CREDITS.md.

Weather is an Open-Meteo model estimate, retrieved server-side with a bounded timeout and fifteen-minute memory cache; HTML is not cached, and failure displays an unavailable state. It is not air-quality data or live on-site observation. The retired service worker clears only this site's old mep-* caches and stops intercepting traffic.

Privacy describes automatic legacy Google Analytics loading, hosting, embedded map and server weather requests. No page analytics toggle is claimed. Production policy and browser settings may restrict measurement requests.
