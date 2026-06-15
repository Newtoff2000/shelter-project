# Technical Audit — Open Issues

> Tracking doc for unresolved findings from the technical audit of the Ericeira Paws site (Nuxt 4 + Sanity + Vercel).
>
> **Original audit date:** 2026-06-15 · **Stack:** Nuxt 4.4, Vue 3.5, Tailwind v4, Sanity Studio v5, Resend, Vercel (SSG)
>
> **Already fixed** — the 10 "quick wins" landed in [PR #36](https://github.com/Newtoff2000/shelter-project/pull/36): XSS escape in contact email, homepage SEO meta, Google Maps → OSM, animal `og:type`/sized `og:image`, FilterBar/search aria-labels, scroll-listener cleanup, branded `error.vue`, security headers, and the i18n "Featured" badge. Then: **sitemap module** (#38), **canonical/`og:url`/hreflang + JSON-LD** (#39), **contact-form email-format validation + length caps** (#41), **`/api/contact` CSRF same-origin check + rate limiting** (#47), and a **security pass** (CSP + HSTS + Permissions-Policy headers, YouTube → `nocookie`, `contactEmail` removed from the public API). Those are **not** repeated below (resolved entries are struck through and marked ✅).
>
> ⚠️ **Staleness caveat:** `main` moves fast via parallel branches. Since the original audit, the homepage was rewritten (a "Find Your Match" quiz, the browsable grid moved to `/animals`, the filter UI refactored into `FilterControls` + `SegmentedControl`, and `MARKETING.md` added). Re-verify each finding against current `main` before acting — some may already be resolved or no longer apply.

---

## Critical & High

### [CRITICAL] Sanity webhook → Vercel redeploy not wired
**Where:** Sanity Studio config / Vercel deploy hooks (no code artifact in repo) · originally audit finding C2; tracked in SSOT §14 step 20.

The site is SSG (`nuxt generate`). Animal data is frozen at build time. When the shelter owner marks a dog **adopted**, adds a **new dog**, or updates a **cover photo**, the live site does not change until someone manually redeploys. No Sanity webhook and no Vercel deploy hook are configured.

**Fix:** Sanity Studio → API → Webhooks → POST to Vercel's deploy hook URL (Vercel → Settings → Git → Deploy Hooks), filtered to `animal` + `siteSettings` documents. ~10 min. This is the #1 operational risk for a content-driven shelter site.

---

### ~~[HIGH] Contact form fields have no `<label>`~~ — ✅ RESOLVED
**Where:** [`web/app/pages/index.vue`](web/app/pages/index.vue) + [`web/app/pages/foster.vue`](web/app/pages/foster.vue).

Originally audit finding H1. The **FilterBar/search** half was resolved in PR #36; the **contact + foster form inputs** now each have a visually-hidden `<label class="sr-only" for="…">` with a matching `id` (reusing the existing `contact.*` / `foster.form.*` i18n strings). Violated WCAG 2.1 AA 1.3.1 / 3.3.2 — now compliant.

---

### [HIGH] No mobile site navigation
**Where:** [`web/app/layouts/default.vue`](web/app/layouts/default.vue) — on `<md`, the header nav collapses to a single "Donate" button.

Originally audit finding H2. On phones (the primary audience — Instagram/WhatsApp-driven, Portuguese), users can't reach the animal feed, Foster page, Contact, or language toggle from the nav. **Re-verify against current `main`** (the homepage rewrite may have touched nav).

**Fix:** Add a hamburger menu exposing the full nav on mobile. M effort.

---

### ~~[HIGH] No `sitemap.xml`~~ — ✅ RESOLVED
**Where:** [`web/nuxt.config.ts`](web/nuxt.config.ts) + [`web/server/api/__sitemap__/urls.ts`](web/server/api/__sitemap__/urls.ts).

Originally audit finding H4. `@nuxtjs/sitemap` is now registered in `modules`, configured with a custom `sources: ['/api/__sitemap__/urls']` endpoint, and `site.url` is set — so `/sitemap.xml` generates from the prerendered routes (verified 2026-06-15).

---

### ~~[HIGH] `@nuxtjs/sanity` module installed but bypassed~~ — ✅ RESOLVED
**Where:** [`web/nuxt.config.ts`](web/nuxt.config.ts) + [`web/package.json`](web/package.json) vs [`web/server/utils/sanity.ts`](web/server/utils/sanity.ts) (custom fetch).

Originally audit finding H6. The module was registered + configured but every fetch went through the custom `sanityFetch()`. Confirmed zero usages (`useSanityClient`/`useSanity`/`$sanity`/`#sanity` → none) and removed the dependency from `package.json` and the `modules` array + `sanity:{}` config block from `nuxt.config.ts`. The custom util (which has a `j0v2zcj0` fallback the module lacked) is now the single client.

---

## Medium / Low — by dimension

### Architecture & code quality
- **[Medium] Hand-rolled Portable Text renderer** — [`web/app/pages/animals/[slug].vue`](web/app/pages/animals/[slug].vue) `blocksToHtml()` only handles `block` nodes with `strong`/`em`. Lists, headings, or custom blocks render as silent empty output. Use `@portabletext/to-html` / `@portabletext/vue`.
- **[Medium] All Sanity data typed as `any`** — `useFetch<any[]>` throughout. Field-name typos produce no type error. Consider `sanity-typegen` or manual interfaces.
- **[Medium] ~~`useFetch('/api/site-settings')` duplicated~~ — ✅ RESOLVED.** Nuxt's `useFetch` already deduped these by URL key (no real double-fetch), but both callers now go through a shared, typed [`useSiteSettings()`](web/app/composables/useSiteSettings.ts) composable — one source of truth, no more `<any>`.
- **[Low] Foster page is a placeholder** — [`web/app/pages/foster.vue`](web/app/pages/foster.vue) "coming soon", yet linked from nav/footer/help-path → dead end.
- **[Low] ~~`filters.null` i18n warning~~ — ✅ RESOLVED.** [`AnimalCard.vue:33`](web/app/components/AnimalCard.vue) already guards: `animal.size ? t(\`filters.${animal.size}\`) : null` (verified 2026-06-15).

### Sanity integration
- **[Medium] Image transform helper assumes Sanity CDN URLs** — [`web/app/utils/sanity-image.ts`](web/app/utils/sanity-image.ts) appends `?w=…&fm=webp` blindly; non-Sanity URLs silently get no transform.
- **[Medium] No LQIP/blur-up placeholder** — cards pop in from a `🐾` emoji. Sanity supports `?w=10&blur=80` placeholders.
- **[Low] No draft/preview mode** — editors can't preview unpublished content.

### Performance
- **[Medium] Google Fonts stylesheet in the critical path** — [`web/nuxt.config.ts`](web/nuxt.config.ts) loads fonts via a blocking `<link rel="stylesheet">` (has `&display=swap`, so no FOIT, but still a serial round-trip). Consider self-hosting a subset or `font-display: optional`.
- **[Low] No `@nuxt/image`** — would add automatic blur placeholders + Vercel image CDN. Current manual `imgUrl()` approach already serves WebP, so low priority.

### SEO
- **[Medium] ~~No `og:url` / canonical~~ — ✅ RESOLVED (PR #39).** [`useAnimalSeo.ts`](web/app/composables/useAnimalSeo.ts) emits `og:url` + canonical + hreflang alternates (pt-PT / en-US / x-default) via `useLocaleHead()`.
- **[Medium] ~~No JSON-LD structured data~~ — ✅ RESOLVED (PR #39).** Site-wide `AnimalShelter` org JSON-LD on the homepage + per-animal `Product`/`Offer` JSON-LD on each profile.

### Accessibility
- **[Medium] ~~Muted text contrast fails WCAG AA~~ — ✅ RESOLVED.** `--color-muted` raised from `#888888` (3.54:1) to `#6b6b6b` in [`main.css`](web/app/assets/css/main.css) — ~5.1:1 on white, ~4.6:1 on `--color-sand`, passes AA on both. (All `text-muted` usages are on light backgrounds; dark surfaces use `text-white/NN`.)
- **[Medium] ~~Hover-only testimonial reveal~~ — ✅ RESOLVED.** [`SuccessCard.vue`](web/app/components/SuccessCard.vue) testimonial now also reveals on `group-focus-within` (keyboard) and is always shown on touch devices via `[@media(hover:none)]` — no longer hover-only (WCAG 2.1 AA 1.4.13). Desktop hover behavior unchanged.
- **[Low] ~~Language toggle lacks descriptive label~~ — ✅ RESOLVED.** Both the desktop + mobile "EN"/"PT" toggles in [`default.vue`](web/app/layouts/default.vue) now carry `:aria-label="t('nav.switchLanguage')"` (new bilingual i18n key).

### Security & dependencies
- **[Medium] ~~No rate limiting on `/api/contact`~~ — ✅ RESOLVED (PR #47).** Best-effort in-memory IP limiter (5 submits / 10 min / IP → 429) in [`request-guards.ts`](web/server/utils/request-guards.ts) `checkRateLimit()`. Per-instance only on serverless (documented as best-effort); honeypot + validation + same-origin are the layered defenses. A shared store (Vercel KV) was deliberately declined to keep zero-provisioning.
- **[Medium] ~~No CSRF protection on `/api/contact`~~ — ✅ RESOLVED (PR #47).** Same-origin enforcement (`assertSameOrigin()` → 403) compares the request's Origin/Referer host to its own host — no token, no client change, works across prod/preview/custom-domain/localhost.
- **[Medium] ~~No CSP / HSTS~~ — ✅ RESOLVED (security pass).** [`nuxt.config.ts`](web/nuxt.config.ts) `/**` headers now ship a pragmatic `Content-Security-Policy` (source-origin allowlist for GoFundMe / YouTube / OSM / Google Fonts; `'unsafe-inline'` kept — SSG can't nonce), `Strict-Transport-Security` (2yr + preload), and `Permissions-Policy`. Verified: zero CSP violations on home + animal pages; fonts/OSM/GoFundMe all load.
- **[Medium] ~~YouTube embed sets cookies without consent~~ — ✅ RESOLVED (security pass).** [`youTubeEmbedUrl()`](web/app/pages/animals/[slug].vue) emits `youtube-nocookie.com`, restoring the cookieless basis for shipping with no consent banner (SSOT §7).
- **[Low] ~~`contactEmail` leaked via public `/api/site-settings`~~ — ✅ RESOLVED (security pass).** Dropped from the GROQ projection in [`site-settings.get.ts`](web/server/api/site-settings.get.ts); the real recipient lives only in `process.env.CONTACT_EMAIL`.
- **[Medium] Email-sender domain auth (SPF/DKIM/DMARC)** — [`contact.post.ts`](web/server/api/contact.post.ts) sends `from: noreply@ericeirapaws.com`. When the domain is purchased/connected, configure SPF + DKIM + DMARC in Resend or enquiries land in spam and the domain is spoofable. Blocked on the domain decision.
- **[Low] Dependency vulns are build/editor-only, not shipped** — `npm audit`: 7 high / 10 moderate, but all traced to the **build chain** (esbuild/vite/nuxt builder; e.g. GHSA-g7r4-m6w7-qqqr — esbuild dev-server arbitrary file read on Windows, affects whoever runs `nuxt dev`) or **Sanity Studio's editor UI** (prismjs/refractor/uuid). None reach the static output served to visitors. `npm audit fix --force` would downgrade to Nuxt 2 — don't; wait for upstream. *(Supersedes the earlier esbuild-only note.)*
- **[Low] Third-party script supply chain (accepted)** — GoFundMe `embed.js` runs with full DOM access and can't be SRI-pinned (dynamic). The CSP `script-src` allowlist is the practical containment. Documented as an accepted dependency.
- **[Low] Sanity Project ID hardcoded** — `studio/sanity.config.ts` `projectId: 'j0v2zcj0'` (also in `.env.example` + SSOT). Semi-public, but redundant.

**Verified-safe (no action needed):** GROQ injection (parameterized `$slug`), stored XSS via the four `v-html` sinks (text escaped, only `<strong>`/`<em>` injected), JSON-LD injection (`jsonLdScript()` escapes `< > &` + U+2028/2029), email open-relay/header-injection (fixed recipient, no-whitespace email regex, Resend HTTPS API not SMTP), and secret hygiene (no committed `.env`, server-only keys not in `runtimeConfig.public`).

### Forms
- **[Medium] ~~No server-side email format validation~~ — ✅ RESOLVED (PR #41).** [`contact.post.ts`](web/server/api/contact.post.ts) now rejects malformed addresses with a 400 before reaching Resend.
- **[Low] ~~No `animalName` length cap~~ — ✅ RESOLVED (PR #41).** Field-length caps added (name ≤200, email ≤254, message ≤5000, animalName ≤100) → 400 on overflow.

### Testing & CI/CD
- **[High] Zero tests, no CI** — no test files, no `.github/workflows/`, no `lint`/`typecheck`/`test` scripts in `web/package.json`. Every push to `main` deploys with no automated gate (a broken build has already happened once — SSOT history). At minimum: add `nuxi typecheck` + ESLint to a GitHub Actions workflow on PRs.

---

## Recommended refactors (highest leverage)

| Refactor | Effort | Risk | Payoff |
|---|---|---|---|
| **Sanity webhook → Vercel deploy hook** | S | None | Critical — content freshness, the core SSG promise |
| ~~Rate-limit + email-validate `/api/contact`~~ ✅ #41/#47 | — | — | Done — inbox protected (validation, length caps, same-origin, rate limit) |
| ~~SEO: sitemap + canonical/`og:url` + JSON-LD~~ ✅ #38/#39 | — | — | Done — discoverability of individual dogs |
| **Accessibility: contact-form labels + mobile nav + contrast** | M | Low | Legal/ethical priority; serves the mobile audience |
| **Remove or adopt `@nuxtjs/sanity`** | S | Low | Cleaner deps; removes dual-client confusion |
| **Add CI (typecheck + lint on PRs)** | S | None | Catches broken builds before they reach `main` |

**No Nuxt 2→3/4 migration needed** — already on Nuxt 4. The `@nuxtjs/i18n` v9 → v10 bump is available (medium effort, possible breaking changes); not urgent.

---

## Production blocker (operational, not code)

Per SSOT top callout + agent memory: the production domain (`shelter-project.vercel.app`) does **not auto-promote** on green builds. A successful Vercel build ≠ live. **Hugo** must promote the latest deployment in the Vercel dashboard and confirm the domain follows Production. Until then, none of the merged work — including these audit fixes — reaches users.
