# SSOT — Ericeira Paws Website

> The single source of truth for **what we're building, why, and what's left to do.** Architecture, decisions, project context, and standing to-dos live here. The **craft** — design, UX, voice — lives in [VIBE.md](./VIBE.md). The **values** — colors, fonts, schema fields, component inventory — live in code (map in [CLAUDE.md](./CLAUDE.md)); this doc points at them rather than copying them, because copies drift. History lives in git, not in a changelog.

---

## 1. What we're building

A warm, bilingual (PT-PT primary, EN) website for a dog and cat shelter in **Mafra/Ericeira, Portugal**. The shelter has no website today — only Instagram. The site:

- Showcases adoptable animals and drives adoption/foster/donation inquiries
- Lets the non-technical shelter owner manage animal profiles herself (via Sanity, from her phone)
- Operates as a stable, searchable destination for the existing Instagram audience and for people who arrive via search

The two active workstreams: **(1) real animal data** from [@ericeira.paws](https://www.instagram.com/ericeira.paws/) into Sanity, and **(2) the frontend** built around the six user journeys (see [VIBE.md §2](./VIBE.md)).

---

## 2. The shelter (context)

**Ericeira Paws is not a private rescue** — it's a group of international, English-speaking volunteers operating *inside* the **Mafra municipal public shelter (CROAMM)**. The animals live in government-run cages under austere public-sector conditions; the volunteers show up to a hard environment and make it less hard. This distinction shapes the whole tone of the site.

**How it started:** a personal project — a love for the animals living in small cages at the Mafra shelter — that came together through a "lucky meeting" with **Patrícia**, a local Portuguese woman devoted to animals who is the on-the-ground anchor and the connection to the shelter. A team of volunteers now shows up three times a week. This founding narrative is the trust-building spine of the site (told in the [origin reel](https://www.instagram.com/reels/C5eEQShMEF1/), self-hosted as `web/public/our-story.mp4`).

| Fact | Detail |
|---|---|
| Animals | ~45 dogs, ~10 cats |
| Volunteer days | Mon / Wed / Fri, 9am–1pm (maintained on 3horas, not the site — §9) |
| Instagram | [@ericeira.paws](https://www.instagram.com/ericeira.paws/) (~1,650 followers) — primary discovery channel |
| GoFundMe | ~€2,042 of €3,000 from ~33 donors (research-date) |
| Partnerships | **3Horas** (expat↔cause platform, hosts volunteering) · **apets** (runs the adoption events) |

**Why Ericeira matters for the site:** a coastal surf/expat hub 40 min north of Lisbon. Many potential adopters, fosters, donors, and volunteers are **international and transient** — which makes **fostering** as important an outcome as adoption, and means much of the audience reads EN first and arrives via Instagram, not a PT-language search.

**Adoption in Portugal (for "what happens next" / foster copy):** small donation (~€40–150); animal must be microchipped + SIAC-registered; rabies vaccination required; pet passport for EU travel (~€20–50); rental restrictions are a real obstacle for expats (landlord's written permission). Fostering costs less upfront — the foster covers food and basic care during the period, with team support throughout.

---

## 3. Team

| Member | GitHub | Vercel | Sanity | Role |
|---|---|---|---|---|
| **Hugo** (Newtoff2000) | owner | owner | owner | Main author — full access everywhere |
| **Jan** (hellojanpacan) | collaborator | — | access | Collaborator — deploys via GitHub autodeploy only |
| Shelter owner | — | — | editor | Non-technical, manages content via Sanity on mobile |

Some actions are **Hugo-only** because they need Vercel or Studio-deploy access — flagged in §8.

---

## 4. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | **Nuxt** (SSG, `nuxt generate`) | `web/`. ~50 animals → ~10s build. Sanity webhook → Vercel redeploy. |
| CMS | **Sanity** Studio v3, Sanity Cloud | `studio/`. Project `j0v2zcj0`, dataset `production`. Mobile-usable for the non-technical editor. |
| Hosting | **Vercel** (free tier) | Auto-deploys from `main` — but see the promotion caveat in §8. |
| i18n | `@nuxtjs/i18n` | PT-PT default (unprefixed) + EN (`/en/`); `prefix_except_default`. |
| Forms | **Resend** | Server route; contact + "I'm interested". |
| Donations | **GoFundMe** embed | Official widget iframe. |
| Analytics | **Umami Cloud** (cookieless) | Env-gated; pending Vercel config (§8). |

**Ruled out:** NuxtContent (poor media handling for media-heavy profiles); Directus (not mobile-usable for the editor); Instagram live-feed embeds, Facebook widget, cookie banner (we stay cookieless — see decisions in §7).

---

## 5. Data model

The **authoritative schema is `studio/schemaTypes/animal.ts`** (and `siteSettings.ts`) — don't restate fields here; read them there. What matters at the SSOT level is the *shape* and the *modelling decisions*:

- **An animal record** carries: identity + status (`status`: available / reserved / adopted, `featured`), feed attributes (species, gender, `ageYears`, size, `dateJoined`, neutered), media (`coverPhoto`, `photos`, `videoUrl`), `personalityTraits` (multi-select enum → chips + filters), and **bilingual** content (`shortQuote`, `quickFacts`, `personality`, `history`, `health`, `interestingFacts`).
- **Bilingual pattern:** content fields are `{ pt, en }` objects, side-by-side in Studio. Rich text uses a shared `blockContent` (bold + italic only — kept simple for a non-technical editor).
- **Success stories extend the animal type, not a separate doc type** (decision): an adopted record gains `adopterNames`, `dateAdopted`, `testimonial`, `instagramUrl` (hidden in Studio until `status = adopted`). This keeps the profile page, OG meta, and Instagram deep-links working for adopted animals.
- **Feed attributes are required only when not adopted** (`requiredUnlessAdopted` in the schema) — so success-only pets that were never in the feed validate without placeholder data.
- **Derived fields are computed frontend-only, never stored:** `age_group` (young/middle/senior from `ageYears`), `time_at_shelter` (bucketed from `dateJoined`). Logic in `web/app/composables/useAnimalHelpers.ts`.
- A **`siteSettings` singleton** holds hero headline + photo, contact email, Instagram URL.

**Feed filters** (all client-side, ~50 animals load at once): species, gender, age group, size, time at shelter, status (adopted hidden by default). Filter + match logic lives in `useAnimalHelpers.ts`.

---

## 6. Architecture notes

- **Rendering: SSG.** `nuxt generate`; content changes a few times a week. A Sanity webhook triggers a Vercel redeploy (~30–60s to live). Zero server cost, CDN edge, and perfect OG meta for animal shares. The webhook is load-bearing for the build-time match-quiz faces — confirm it's connected (§8).
- **SEO is implemented in code** (PR #35): `AnimalShelter` JSON-LD in `web/app/layouts/default.vue`, per-locale sitemaps with `_i18nTransform` for animal routes, hreflang via `useLocaleHead`, OG tags on animal profiles. Reads `NUXT_PUBLIC_SITE_URL`. See §9 for the post-launch checklist.
- **Error page** (`web/app/error.vue`) renders outside the i18n context, so its strings fall back to EN regardless of locale. Cosmetic; fix when convenient by deriving locale from the URL prefix.

---

## 7. Decisions (resolved)

| Decision | Resolution |
|---|---|
| CMS | **Sanity** — mobile-usable, hosts everything, clean editor UI |
| Email delivery | **Resend** — generous free tier, clean Nuxt server-route fit |
| Rendering | **SSG** (`nuxt generate`) + Sanity webhook → Vercel redeploy |
| Hero visual | **Transparent-cutout split** — text+CTAs left, background-removed PNG animal right; no text on image ([VIBE §3](./VIBE.md)) |
| Hero source | **CMS-editable** (`siteSettings.heroHeadline` + `heroPhoto`, i18n fallbacks) |
| Success Stories | **Homepage section**, auto-populated from `status = adopted` (no standalone gallery) |
| Instagram | **Deep link only** — no live-feed embed; prominent topbar + footer + "follow" section |
| GoFundMe | **Embed** the official widget |
| Maps | **Cookieless OpenStreetMap** iframe in footer; "view larger" links to Google |
| Analytics | **Umami Cloud** — cookieless, free tier; dashboard embedded in Studio |
| Cookie consent | **No banner** — Umami cookieless, GoFundMe lazy-loaded, maps via OSM, YouTube via nocookie |
| Brand | Coral `#ff5757`, sand `#f5f0eb`; Nunito / DM Serif Display / Inter — **values live in `web/app/assets/css/main.css` + `nuxt.config.ts`** |

**Still open:** **domain name** (not purchased) — see §8.

---

## 8. Current status & standing to-dos

> The forward-looking, fastest-moving part of this doc. Keep it honest: delete items when done, don't let it become a log.

### 🚨 Blocking — needs Hugo (dashboard access)

- **Production is frozen / not auto-promoting.** `main` builds **green** on Vercel, but the production domain (`shelter-project.vercel.app`) is pinned to an old deployment and isn't advancing — so *no merged work reaches users*. Likely cause: a past failed build (PR #11) pinned the alias. **Fix:** in Vercel → Deployments → open the newest Ready Production build → **Promote to Production**; then Settings → Domains confirm the domain *follows Production* (not pinned), and Settings → Git confirm Production Branch = `main` with auto-deploys on. *(Lesson: green build ≠ live here — promote manually.)*
- **Umami env vars** (unblocks analytics; PR #15 ships inert until set): Vercel → `NUXT_PUBLIC_UMAMI_WEBSITE_ID = a765f609-725e-4fd6-8d37-29bb7eefcb23`, then redeploy. Studio → `SANITY_STUDIO_UMAMI_SHARE_URL = https://cloud.umami.is/share/2fBpWdDQmXdeArsJ`, then `npm run deploy`. (Website ID is not secret; custom events need no setup.)
- **Studio `npm run deploy`** — needed for the editor fields added in code (`instagramUrl`, success-story fields) to appear in the editor. Frontend already uses the data.

### Frontend — remaining build items

Foundation (Tailwind v4, tokens, fonts) and core components (cards, filters, homepage sections, profile page) are **built** — inventory is in `web/app/components/`. What's left before launch:

- OG meta tags on the **homepage** and non-profile pages (animal profiles already have them)
- Confirm the **Sanity → Vercel webhook** triggers a production rebuild on a Studio edit
- Domain purchased + connected
- Shelter-owner onboarding session on Sanity Studio (mobile) — capture the owner-only data below

### Animal data gaps (Sanity)

**28 records:** 24 available + 4 adopted success stories (§10). Cover photos are essentially done (27/28 — only **Tobias** lacks one). Still missing, mostly owner-sourced:

- **Portuguese translations on all bilingual fields** — the IG-sourced content is EN-only. **PT-locale launch blocker.**
- **Owner-only fields:** `neutered`, `health`, `interestingFacts`, most `dateJoined`.
- **12 live records lack gender/size/age** (Kenny, Casper, Lenny & Oslo, Leo, Drako, Avelã, Snow, Tobias + the 4 success pets). Display degrades gracefully (missing values are dropped, not defaulted), but the data gap is real.
- `ageYears` for Taxi; `photos` galleries empty across the board.

*(Cover photos were recovered from the @ericeira.paws feed via HAR extraction of carousel slides. Four photoless records with no IG presence — Amelia, Hans, Kaiser, Thor — were deleted on an 80/20 call: build on solid real data, not an exhaustive roster.)*

---

## 9. Discoverability (SEO / channels)

**The marketing job:** turn the existing Instagram audience into adopters/fosters/donors, and give the org a discoverable presence for people who haven't found the Instagram yet. The site is the credible, stable destination; Instagram does the emotional work. Optimise for two audiences: **local PT residents** (PT-language search, trust) and **expats/internationals** (Instagram, EN search, fostering info).

**Implemented in code** (see §6 for files): `AnimalShelter` JSON-LD with `sameAs`/`address`/`geo`, per-locale sitemaps with `_i18nTransform`, hreflang, OG tags on profiles. This is the high-confidence set — schema + sitemap + answer-first content structure are the only verifiable SEO/AEO moves; specific "AEO tactics" with proprietary stats are noise.

**Post-launch checklist** (blocked until a domain is live + promoted):

| Priority | Action |
|---|---|
| Critical | Set `NUXT_PUBLIC_SITE_URL` in Vercel (updates JSON-LD/sitemap/hreflang to the real domain) |
| Critical | Submit PT + EN sitemaps to Google Search Console (`/__sitemap__/pt-PT.xml`, `/en-US.xml`) |
| High | Google Business Profile as `AnimalShelter`, backlinking the site |
| High | Run Google Rich Results Test on the AnimalShelter JSON-LD |
| High | Add OG meta to homepage + other pages |
| Medium | Add Facebook + GoFundMe URLs to JSON-LD `sameAs` (entity signals) once confirmed |
| Low | Local directories (Páginas Amarelas, Município de Mafra, local/expat directories) |

**Channel notes:** keep the IG bio link pointing at the site and use each animal's exact name in captions (so visitors can name-search). Confirm the GoFundMe description and the 3horas listing link back to the site once the domain is live. **NAP consistency** (name/address/phone) across site JSON-LD, GBP, and directories once a phone is public.

**Open questions:** Facebook page URL? Does GoFundMe / 3horas link back yet? Does apets have a site worth a mutual mention? A "How to adopt a dog in Portugal" FAQ is the highest-value future content for the expat audience — deferred, not for launch.

---

## 10. Volunteering — external source of truth

Volunteering and dog-walking are **not** described on this site. All of it — schedule, hours, sign-up — lives on the actively maintained **[3horas.org/paws](https://3horas.org/paws/)**, the single source of truth. **Why:** the site must be low-maintenance; operational details like walking hours would quietly go stale here, where animal profiles are what must stay current.

Wired as: `/volunteer` + `/en/volunteer` **307-redirect** to 3horas (`routeRules` in `web/nuxt.config.ts`); every Volunteer/Walk link (nav, footer, Help-path card) points there in a new tab; **no hardcoded days/hours** anywhere in the frontend or i18n.

---

## 11. Success stories

The @ericeira.paws weekly "Adoption Success Story" series is a steady supply of real stories (family + pet, short narrative). These are **animal records with `status = adopted`** (§5), surfaced in the homepage Success Stories section and as `SuccessCard.vue` (links to the IG post when `instagramUrl` is set). All four current records have **rights/consent cleared** (photo use + publication). Covers are IG `og:image` (640×640) — fine for now, replace with families' originals later.

| Story | People | Pet(s) | Slug | Post |
|---|---|---|---|---|
| #1 | Eibhilin & William | Blu & Pablo | `blu-pablo` | [DPBlr4tikyQ](https://www.instagram.com/p/DPBlr4tikyQ/) |
| — | Caroline & David | Naga | `naga` | [DOqSxB4DbQA](https://www.instagram.com/p/DOqSxB4DbQA/) |
| — | Susanne | Finn | `finn` | [DOYnxykCD3o](https://www.instagram.com/p/DOYnxykCD3o/) |
| — | Iria & Mirco | Pido | `pido` | [DOGmmxpCMrh](https://www.instagram.com/p/DOGmmxpCMrh/) |

Still need: galleries, attributes, PT translations. (Backfill scripts live in `studio/scripts/`.)

---

## 12. Scope

**Out of scope (for now):** user accounts / login; online adoption applications beyond the email form; payment processing (GoFundMe only); a blog/news section; an admin dashboard beyond the CMS; paid advertising; a newsletter; international adoption marketing beyond PT/EN.

**Parked ideas** (captured, not being built): a CMS-driven "News & Updates" type for volunteer announcements (impact/fundraiser/event posts that have no home in the animal-only model); volunteer first-person stories (fold into `personality`/`history` instead); off-site/international-adoption animals (the model assumes animals are at this shelter). For any reposted third-party media, **confirm reuse rights or get fresh photos before publishing** — the website is a higher bar than an Instagram repost.
