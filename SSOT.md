# Shelter Project — Single Source of Truth

> This document is the authoritative reference for the architecture, content structure, and product decisions of the shelter website. Update it as decisions evolve.
>
> **See also:** [SHELTER.md](./SHELTER.md) — shelter research, community context, and the six key user journeys the website is designed for.
>
> **See also:** [DESIGN.md](./DESIGN.md) — color palette, typography, homepage IA, animal card spec, component list, embed decisions.
> **See also:** [UX.md](./UX.md) — detailed UX journeys, interaction flows, design patterns, and competitive analogies.
> **See also:** [VOICE.md](./VOICE.md) — tone of voice, CTA language, copy patterns, and bilingual voice decisions.
> **See also:** [MARKETING.md](./MARKETING.md) — SEO/AEO state, channel strategy (Instagram, Facebook, 3horas, GoFundMe), content strategy, post-launch discoverability checklist.

---

## ⚠️ CRITICAL — Production not updating (action required: **Hugo**, in Vercel)

**As of 2026-06-14, the live site (`shelter-project.vercel.app`) shows none of the recent work** — not the frontend redesign, not the "Our Story" section, not analytics. Everything is correctly merged to `main` and **builds green on Vercel**, but the public production domain is **frozen on an old deployment** and is not auto-promoting to new successful builds.

**What's verified:**
- The redesign + later PRs are all in `main`; Vercel reports **build success** for the latest commits.
- Yet the production domain serves a stale build (`X-Vercel-Cache: HIT`, `Age` ~3h — the last-good build from *before* PR #11's failed build).
- An empty trigger commit + several green builds did **not** move the domain → confirms it's a promotion/alias problem, not a build or code problem.

**Likely root cause:** PR #11 introduced a build failure (an image helper placed at `web/utils/` — outside Nuxt 4's `app/` srcDir — so it didn't auto-import; fixed in PR #12 by moving it to `web/app/utils/`). When that production build failed, Vercel pinned the domain to the previous good deployment and hasn't auto-advanced since.

**Exact steps for Hugo (Vercel dashboard — only Hugo has access; Jan is GitHub-autodeploy only):**
1. **Deployments** → open the newest **Ready** Production deployment (latest `main` commit).
2. **⋯ → Promote to Production** — this re-points `shelter-project.vercel.app` to it. *(All merged work goes live at once.)*
3. **Settings → Domains** → confirm `shelter-project.vercel.app` is set to **follow Production**, not pinned to a specific deployment.
4. **Settings → Git** → confirm Production Branch = `main` and automatic Production deployments are enabled, so future green builds self-promote.

**Why it matters / dependency:** until this is fixed, no merge reaches users — including the **Umami analytics env config in §14 step 21** (setting those env vars + redeploying has no visible effect while the domain is pinned). Pushing more commits will **not** help; the promotion is the fix.

> 🧹 **Remove this entire section once production is confirmed live with the latest `main`.** SSOT is a living *current* document, not a log of past incidents. The reusable lesson (green build ≠ live; this Vercel project does not auto-promote — promote manually) is already saved in the agent's persistent memory (`vercel-deploy`), which loads every session — so deleting this section loses nothing of lasting value.

---

## 0. Current Priorities

These are the two active workstreams as of 2026-06-14:

### Priority 1 — Real animal data from Instagram
Populate the Sanity CMS with real dog profiles sourced from [@ericeira.paws](https://www.instagram.com/ericeira.paws/) on Instagram. Each dog needs: name, photos, cover photo, basic attributes (species, gender, age, size, status), and bilingual profile content (personality, history, quick facts) where available from captions. **28 animal records now in Sanity** (2026-06-14): **24 available** (Avelã, Ben, Benson, Caju, Casper, Drako, Duke, Joca, Kenny, Lenny & Oslo, Leo, Loki, Mel, Morsa, Pimpo, Príncipe, Rex, Snow, Taxi, Thumper, Tobias, Willa, Zouk, Átila) + **4 adopted success-story records** (see §11). Cover photos are now in for all but Tobias (recovered from Instagram, see §15); age/gender/size still need filling for some via Studio. *(Four photoless records — Amelia, Hans, Kaiser, Thor — were removed on 2026-06-14: no Instagram presence under their names; an 80/20 call to keep development moving on solid real data rather than block on missing photos.)*

### Priority 2 — Frontend redesign
Redesign the Nuxt frontend from the ground up: visual design, layout, component architecture, and UX flow. Driven by the six user journeys in SHELTER.md and the design principles derived from them (mobile-first, emotional before informational, speed and scannability, radical transparency). The **animal card** is the right starting point — every other component flows from getting that right. See [DESIGN.md](./DESIGN.md) for the full brief.

---

## 1. Project Overview

A website for a dog and cat shelter based in **Mafra/Ericeira, Portugal**. The shelter currently has no website — only an Instagram presence. The goal is to build a warm, emotional, and hopeful website that:

- Showcases available animals for adoption
- Allows the shelter owner (non-technical) to manage animal profiles independently
- Drives adoption inquiries and donations
- Operates bilingually in **European Portuguese (PT-PT)** and **English (EN)**

---

## 2. Team

| Member | GitHub | Vercel | Sanity | Role |
|---|---|---|---|---|
| **Hugo** (Newtoff2000) | owner | owner | owner | Main author — full access everywhere |
| **Jan** (hellojanpacan) | collaborator | no access | access | Collaborator — deploys via GitHub autodeploy only |
| Shelter owner | — | — | editor | Non-technical, manages content via CMS |

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | **Nuxt.js** | SSG or SSR, TBD |
| CMS | **Sanity** | Chosen — see Section 9 |
| Hosting | **Vercel** (free tier) | Frontend |
| CMS hosting | **Sanity Cloud** | Fully hosted, no server needed |
| i18n | Nuxt i18n module | PT-PT + EN |
| Forms | Email via form service | e.g. Resend, Formspree, or EmailJS |
| Donations | GoFundMe embed | Already set up |

### What's ruled out
- **NuxtContent** — poor image and video handling, not suitable for media-heavy animal profiles

---

## 4. Hosting & Domain

- **Hosting:** Vercel (free tier) — **live**, auto-deploys from `main` *(⚠️ but the production domain is currently NOT auto-promoting new builds — see the Critical callout at the top of this doc; remove this note when resolved)*
- **Domain:** Not yet purchased — TBD
- **CMS hosting:** Sanity Cloud — **live** at https://shelter.sanity.studio
- **Sanity project ID:** `j0v2zcj0`, dataset: `production`

---

## 5. Website Structure

### 5.1 Main Page

```
┌─────────────────────────────────┐
│  Top Bar                        │  Donate CTA + Social icons (Instagram)
├─────────────────────────────────┤
│  Hero                           │  Two-column: text left, transparent-cutout animal photo right (see §5.4)
├─────────────────────────────────┤
│  Our Story                      │  Founding story + self-hosted reel video (see §5.3)
├─────────────────────────────────┤
│  Find Your Match                │  "What dog are you looking for?" 3-tap this-or-that quiz teaser + featured peek (~4 cards) + name search + "See all dogs →". Full browsable grid moved to /animals (see §5.5).
├─────────────────────────────────┤
│  Contact Us                     │  Email form → shelter inbox
├─────────────────────────────────┤
│  Donate                         │  GoFundMe embedded widget/bubble
├─────────────────────────────────┤
│  Footer                         │  Socials, copyright, links
└─────────────────────────────────┘
```

### 5.2 Animal Profile Page (`/animals/[slug]`)

```
┌─────────────────────────────────┐
│  Name + Hero Photo              │
├─────────────────────────────────┤
│  Basic Info                     │  Age, gender, size, date joined shelter,
│                                 │  neutered/spayed, species
├─────────────────────────────────┤
│  Quick Facts / Preferences      │  Bullet-style highlights (e.g. "Good with kids")
├─────────────────────────────────┤
│  I'm Interested CTA             │  Button → email form pre-filled with animal name
├─────────────────────────────────┤
│  Video (optional)               │  Embedded video (YouTube/Instagram/direct)
├─────────────────────────────────┤
│  Character / Personality        │  Free-text rich field
├─────────────────────────────────┤
│  History                        │  How they ended up at the shelter
├─────────────────────────────────┤
│  Health                         │  Vaccinations, conditions, notes
├─────────────────────────────────┤
│  Interesting Facts              │  Fun/endearing extras
├─────────────────────────────────┤
│  Photo Gallery                  │  Multiple photos
└─────────────────────────────────┘
```

### 5.4 Hero design — transparent-cutout layout

**Layout:** Two-column on desktop — headline + subtext + CTAs on the left, animal photo floating on the right against the page background. No text overlaid on the image. On mobile: stacks vertically (headline → photo → CTAs), photo cropped to a square card (no cutout illusion needed at that size).

**The cutout effect:** The hero photo must be a **transparent-background PNG** — the animal subject isolated with its background removed. This makes the dog (or cat) appear to float naturally against the site's background color rather than sitting inside a rectangular frame.

- Upload transparent PNGs to `siteSettings.heroPhoto` in Sanity Studio
- Use [remove.bg](https://www.remove.bg) or Photoshop to prepare images before upload
- The current hero photo (`fb973f0304...1070x1192.png`) is a standard opaque photo — it needs background removal before it works with this layout
- Shelter owner cannot self-serve this step from her phone; team prepares the hero PNG

**Sanity schema impact:** A second optional field `heroPhotoFallback` (standard opaque image) could be added for graceful degradation, but deferred — not needed at launch.

**Mobile fallback:** On small screens, `object-fit: contain` in a fixed-height container works fine without the cutout illusion.

---

### 5.3 Our Story section + video asset

A homepage **"Our Story"** band sits directly below the hero, above the animal feed. It carries the founding narrative (see [SHELTER.md §1 — How it started](./SHELTER.md)) and the shelter's origin-story reel.

- **Copy:** short, 2–3 sentences in the website voice (NOT the raw Instagram caption — see [VOICE.md](./VOICE.md)). Credits the volunteer team and Patrícia. Bilingual PT/EN via i18n strings.
- **Video:** **self-hosted, compressed** — not an Instagram embed (consistent with the no-IG-embed decision, [DESIGN.md §8](./DESIGN.md)). The original reel ([C5eEQShMEF1](https://www.instagram.com/reels/C5eEQShMEF1/), 40 MB MP4) is transcoded to a web-friendly file.
  - Asset: `web/public/our-story.mp4` (vertical, 540px wide, H.264, faststart) + poster `web/public/our-story-poster.jpg`
  - Native `<video>` with `controls`, `playsinline`, `preload="none"` — the file downloads only when the visitor presses play, so it costs nothing on initial load.
  - A secondary "Watch on Instagram" link points back to the reel.
  - Source-of-truth for re-transcoding: `transcode-story.cjs` at the repo root (uses the `ffmpeg-static` binary).

---

### 5.5 "Find Your Match" quiz + `/animals` browse page

The homepage no longer renders the full animal grid (it grew to a long scroll). Instead the homepage leads with a playful **match quiz**, and the full browsable grid lives on a dedicated **`/animals`** page (also a real SEO/share win).

- **Quiz (`web/app/components/MatchQuiz.vue`):** "What dog are you looking for?" — 3 **tap-based this-or-that** questions (vibe: cuddly homebody vs sporty explorer · home: full house vs just me · size: apartment-sized vs big giant). On the dating-app analogy in [UX.md Part III §4](./UX.md). Tap, not swipe (keyboard/SR-friendly; ArrowLeft/Right also select). **Skippable** — name-search + "See all dogs →" sit beside it so the high-intent Impulse Visitor (Journey 5) never has to play.
- **Data-driven faces:** each option shows a **real, currently-available dog** ("…like Mel") chosen from the dataset at build time via `pickArchetypeFaces()` — never hardcoded, so it self-heals every build (depends on the Sanity→Vercel webhook, §14 step 20).
- **Rank, never filter:** completing the quiz deep-links to `/animals?match=calm,full,compact`. The page reads the `match` param and **sorts best-fit to the top** with a "Your top matches" banner; **no dog is ever hidden**, and a one-click reset restores default order. Zero empty-result risk on sparse trait data.
- **Shared logic** lives in `web/app/composables/useAnimalHelpers.ts`: `filterAnimals`, `scoreAnimalMatch`, `rankByMatch`, `parseMatch`/`stringifyMatch`, `pickArchetypeFaces`. Matching is based on the existing `personalityTraits` + `size` fields (§6) — no schema change. Scoring is written species-aware for when cats are added.

---

## 6. Animal Data Model

Each animal record in the CMS contains:

### Core Fields
| Field | Type | Notes |
|---|---|---|
| `name` | Text | Display name |
| `slug` | Text (auto) | URL-safe identifier |
| `species` | Enum | `dog`, `cat` |
| `status` | Enum | `available`, `reserved`, `adopted` |
| `featured` | Boolean | Pins animal to top of feed — for long-stay or urgent cases |
| `gender` | Enum | `male`, `female` |
| `age_years` | Number | Used for age group filtering |
| `age_group` | Enum (derived) | `young` (0–2), `middle` (3–7), `senior` (8+) |
| `size` | Enum | `small`, `medium`, `large` |
| `date_joined` | Date | When the animal arrived at the shelter |
| `neutered` | Boolean | Neutered / spayed |
| `personality_traits` | Enum[] | Multi-select: `friendly`, `gentle`, `calm`, `curious`, `playful`, `independent`, `affectionate`, `energetic`, `good_with_kids`, `good_with_dogs`, `good_with_cats` — shown as chips on card + filterable in feed |
| `cover_photo` | Image | Main profile photo |
| `photos` | Image[] | Gallery |
| `video_url` | URL | Optional — YouTube, Instagram, or direct |

### Profile Content (bilingual: PT-PT + EN)
| Field | Type | Notes |
|---|---|---|
| `short_quote` | Text | One sentence in the animal's voice — shown on card and profile. e.g. "Loves every stranger like an old friend." |
| `quick_facts` | Text[] (list) | Short bullet points |
| `personality` | Rich text | |
| `history` | Rich text | For success stories, carries the adoption narrative |
| `health` | Rich text | |
| `interesting_facts` | Rich text | |

### Success Story fields (only when `status = adopted`)
Added to the animal type to support the @ericeira.paws weekly success-story series (see §11). Hidden in Studio until status is set to Adopted.
| Field | Type | Notes |
|---|---|---|
| `adopterNames` | Text | The family/person who adopted — e.g. "Caroline & David". Shown on the success card. |
| `dateAdopted` | Date | "Found their home · Month Year" line + the adoption counter. Distinct from `date_joined`. |
| `testimonial` | Object | `quote` (bilingual `{pt,en}`) + optional `attribution`. First-person adopter quote. |

> **Schema note:** the adoptable-feed fields (`gender`, `ageYears`, `size`, `dateJoined`, `coverPhoto`) are now **required only when `status ≠ adopted`** (`requiredUnlessAdopted` helper in `studio/schemaTypes/animal.ts`), so success-only records (pets never in the feed) validate without placeholder data.

### Derived / Computed (frontend only — not stored in CMS)
| Field | Notes |
|---|---|
| `age_group` | Computed from `age_years` — `young` (0–2), `middle` (3–7), `senior` (8+) |
| `time_at_shelter` | Computed from `date_joined` — bucketed as `<1 year`, `1 year`, `2 years`, `3+ years` |

### Schema conventions
- Bilingual content fields use a `{ pt, en }` object pattern (side-by-side in Studio)
- Rich text fields use a shared `blockContent` type (bold + italic only — kept simple for non-technical editor)
- A `siteSettings` singleton document covers hero headline, hero photo, contact email, and Instagram URL

---

## 7. Animal Feed Filters

Filters available on the main page feed:

| Filter | Options |
|---|---|
| Species | Dog, Cat |
| Gender | Male, Female |
| Age group | Young (0–2y), Middle-age (3–7y), Senior (8y+) |
| Size | Small, Medium, Large |
| Time at shelter | Less than 1 year, 1 year, 2 years, 3+ years |
| Status | Available, Reserved *(Adopted hidden by default — see Success Stories)* |

- All ~50 animals load at once (no pagination needed at this scale)
- Filtering is client-side

---

## 8. Forms & Email

### Contact Form (main page)
Fields: `Name`, `Email`, `Message`
Destination: shelter owner's inbox (single address, configured via env var)

### "I'm Interested" Form (animal profile page)
Fields: `Name`, `Email`, `Message` (pre-filled with: *"I'm interested in [Animal Name]"*)
Destination: same shelter inbox

### Email delivery
Options (to decide): **Resend**, **Formspree**, or **EmailJS**
- Resend recommended: generous free tier, works well with Nuxt/Vercel

---

## 9. CMS: Sanity (decided)

**Chosen:** Sanity Studio v3, hosted on Sanity Cloud (free tier).

**Rationale:**
- Shelter owner is non-technical and primarily on mobile — Sanity Studio is usable on phone, Directus is not
- Uploading photos directly from phone camera works natively
- No infrastructure to maintain (Sanity hosts everything)
- Free tier comfortably covers ~50 animals and one editor
- Cleaner content-editor UI vs. Directus's database-admin feel

**Note:** Do a short onboarding session with the shelter owner on her actual phone before launch to verify she can add/edit animals independently.

---

## 10. Internationalisation (i18n)

- Languages: **PT-PT** (primary) and **EN**
- Module: `@nuxtjs/i18n`
- URL strategy: prefix-except-default (e.g. `/en/animals/...`, `/animals/...` for PT)
- All animal profile content fields are bilingual (separate PT/EN fields in CMS)
- UI strings (labels, buttons, nav) managed via i18n JSON files in the repo

---

## 11. Success Stories (Adopted Animals)

- Adopted animals are not deleted — status changes to `adopted`
- **Homepage section** (decision #5), auto-populated from animals with `status = adopted` — no standalone gallery
- **Modelling decision (2026-06-14): extend the animal type, not a separate doc type.** Success stories are animal records with `status = adopted`, enriched with `adopterNames` / `dateAdopted` / `testimonial` (see §6). Keeps the profile page + OG meta + Instagram deep-link survival; feed-attribute fields made conditionally required so series-only pets don't need placeholder data.
- **Source: @ericeira.paws runs a weekly "Adoption Success Story" series** on Instagram — a steady supply of real stories (family + pet, beach/home photos, short narrative). These are the content for this section.
- **Stories captured so far** — all four are *new* adoptions (never in the adoptable feed) and now exist in Sanity as `status: adopted` records (created 2026-06-14, `_id` `story-*`), with name/slug/species/status + `history.en` + **`adopterNames`, `dateAdopted`, `coverPhoto` (with alt)** all set. **Rights/consent cleared for all four** (photo use + website publication, confirmed 2026-06-14). Cover photos were pulled from each post's Instagram `og:image` (640×640, compressed) — **fine for now; replace with the families' originals later for higher quality.** Still need: gallery, attributes, PT translation.
  | Story | People | Pet(s) | Sanity slug | Rights | Post |
  |---|---|---|---|---|---|
  | #1 | Eibhilin & William | Blu & Pablo | `blu-pablo` | ✅ cleared | [DPBlr4tikyQ](https://www.instagram.com/p/DPBlr4tikyQ/) |
  | — | Caroline & David | Naga | `naga` | ✅ cleared | [DOqSxB4DbQA](https://www.instagram.com/p/DOqSxB4DbQA/) |
  | — | Susanne | Finn | `finn` | ✅ cleared | [DOYnxykCD3o](https://www.instagram.com/p/DOYnxykCD3o/) |
  | — | Iria & Mirco | Pido | `pido` | ✅ cleared | [DOGmmxpCMrh](https://www.instagram.com/p/DOGmmxpCMrh/) |
- **Modelling note:** the standard weekly caption is boilerplate; the per-story line ("the beautiful story of …") + photos are the real content → `history` + `cover_photo`/`photos`. These records carry no photos yet, so they stay out of the live feed (adopted is hidden by default) and surface only once build item 13 (`SuccessCard` + section) ships.
- **Success cards link to their Instagram post (2026-06-14).** Added an editable `instagramUrl` field to the animal schema (hidden unless adopted; queried in `animals/index.get.ts`); `SuccessCard.vue` renders as an `<a target="_blank" rel="noopener noreferrer">` with an Instagram cue + focus ring when the field is set, else a plain `<article>`. The four records were backfilled via `studio/scripts/set-instagram-urls.mjs`: `blu-pablo`→[DPBlr4tikyQ](https://www.instagram.com/p/DPBlr4tikyQ/), `naga`→[DOqSxB4DbQA](https://www.instagram.com/p/DOqSxB4DbQA/), `finn`→[DOYnxykCD3o](https://www.instagram.com/p/DOYnxykCD3o/), `pido`→[DOGmmxpCMrh](https://www.instagram.com/p/DOGmmxpCMrh/). **The editor field needs a Studio `npm run deploy` (Hugo) to appear in Studio**; the frontend links work as soon as the branch deploys (data already written).

---

## 12. Design & Brand

- **Tone:** Warm, emotional, friendly, hopeful
- **Logo:** **Implemented.** The official Ericeira Paws mark (coral heart enclosing two paw prints + wordmark) was redrawn as a transparent, theme-able SVG — `LogoMark.vue` (mark) + `SiteLogo.vue` (mark + Nunito-Black-Italic wordmark, light/dark variants), used in the nav and footer. Standalone `web/public/logo-mark.svg` powers the SVG favicon; a sand-backed PNG icon set (`apple-touch-icon` 180, maskable 512, 192, favicon 32/16) + `site.webmanifest` cover iOS/PWA. Source raster was a coral-heart-with-two-paws logo on a cream background.
- **Brand colors:** Confirmed — coral `#ff5757`, sand `#fcf5eb`. Full palette in [DESIGN.md §2](./DESIGN.md). **Coral now matched in code** (`--color-coral: #ff5757`) — the earlier orange `#e07b54` drift is resolved and unified across UI + logo. *(Minor open drift: implemented sand is `#f5f0eb` vs documented `#fcf5eb` — not yet reconciled.)*
- **References:** TBD — shelter owner or team to provide inspiration links
- **Typography:** Confirmed — Nunito Black (labels/animal names), DM Serif Display (hero/editorial), Inter (body). See [DESIGN.md §3](./DESIGN.md). **Nunito is now actually loaded** (Google Fonts, ital 800/900) — it powers the logo wordmark.
- **No** stock-photo feel — real photos of real animals are central to the design

---

## 13. Open Decisions

| # | Decision | Status |
|---|---|---|
| 1 | CMS: Directus vs. Sanity | **Resolved — Sanity** |
| 2 | Domain name | **Pending** |
| 3 | CMS hosting (if Directus) | **N/A — Sanity Cloud** |
| 4 | Email delivery service | **Resolved — Resend** (generous free tier, works cleanly with Nuxt server routes) |
| 5 | Success Stories: dedicated page or section | **Resolved — section on homepage**, auto-populated from `status=adopted` animals |
| 6 | Hero: editable via CMS or hardcoded | **Resolved — CMS-editable** (siteSettings.heroHeadline + heroPhoto, with i18n fallbacks) |
| 14 | Hero visual design: full-bleed image vs. split layout | **Resolved — transparent-cutout split** (two-column: text left, transparent-PNG animal right; no text-on-image; see §5.4) |
| 7 | Brand colors + typography | **Resolved** — see [DESIGN.md §2–3](./DESIGN.md) |
| 8 | Nuxt rendering mode: SSG vs SSR | **Resolved — SSG** (`nuxt generate`) with Sanity webhook → Vercel redeploy |
| 9 | Instagram embed vs. deep link | **Resolved — deep link only** (no live feed embed; prominent icon in topbar + footer + dedicated "Follow us" section) |
| 10 | GoFundMe: embed or link-out | **Resolved — embed** (official GoFundMe widget iframe in Donate section) |
| 11 | Google Maps | **Resolved — cookieless OpenStreetMap embed in footer** (no API key, no cookies; "view larger map" link out to Google) |
| 12 | Analytics | **Resolved — Umami Cloud** (cookieless, free tier; dashboard embedded as an "Analytics" tool inside Sanity Studio so volunteers use one app) |
| 13 | Cookie consent | **Resolved — no banner needed** (Umami is cookieless; GoFundMe lazy-loaded on click, Google Maps → cookieless OSM, YouTube → youtube-nocookie) |

### 13.1 Design-doc drift to reconcile (DESIGN.md / UX.md)

Stale entries spotted 2026-06-14 — the code is correct; the docs lag. Worth a cleanup pass:

- **Hero spec outdated** — DESIGN.md §4 + §6 still say *"Full-bleed / Full-width photo"*, but the built (and decided, #14) hero is the **transparent-cutout split layout** (§5.4).
- **GoFundMe contradiction** — DESIGN.md §8 + decision #10 say **embed** (and the code embeds it), but UX.md §3 ("Website → GoFundMe") still argues *"linked, not embedded."* Reconcile UX.md to the embed decision.
- **Hardcoded volunteer hours linger in diagrams** — DESIGN.md §4 footer block + UX.md §3 still show *"Mon/Wed/Fri, 9am–1pm"*, but §18 removed all hardcoded hours (volunteering lives on 3horas.org). Scrub from both diagrams.
- **Sand color drift** — code uses `#f5f0eb`; DESIGN.md §2 documents `#fcf5eb`. Pick one and unify (also noted in §12).

---

## 14. Next Steps — Frontend Build Order

The redesign happens in this order. Each step is a shippable unit.

### Phase 1 — Foundation (do first, everything else depends on it)
1. **Add Tailwind CSS v4** to the Nuxt project (`web/`)
2. **Define design tokens** in `tailwind.config.ts` — the color palette and font families from [DESIGN.md §2–3](./DESIGN.md)
3. **Wire Google Fonts** — DM Serif Display + Inter

### Phase 2 — Core components
4. **`TraitChip` component** — maps trait enum value to icon + label. Light and dark variants.
5. **`AnimalCard` component** — cover photo, name, gender/age/size, shortQuote, 3 trait chips, status badge, featured pin, CTA.
6. **`FilterBar` component** — species, gender, age, size dropdowns + personality trait multi-select + name search field. All client-side.

### Phase 3 — Homepage sections (top to bottom)
7. **`TopBar`** — Donate CTA + language toggle + Instagram icon link
8. **`SiteNav`** — sticky nav with the 5 nav items
9. **`HeroSection`** — full-bleed photo + headline + two CTAs (from Sanity siteSettings)
10. **`ImpactStrip`** — 4–5 stat numbers (hardcode initially; move to siteSettings later)
10b. **`OurStory`** — founding-story band: self-hosted reel video (`our-story.mp4` + poster) + short bilingual copy + "Watch on Instagram" link. See §5.3.
11. **Animal feed** — FilterBar + AnimalCard grid (replaces current feed)
12. **`HelpPath`** — 4-up: Adopt / Foster / Walk / Donate
13. **`SuccessCard` + Success Stories section** — auto-populated from adopted animals
14. **Instagram section** — curated posts or static "Follow us" CTA
15. **GoFundMe embed** + donation copy
16. **`ContactForm`** — Resend integration (replace current placeholder)
17. **`PageFooter`** — nav + socials + Google Maps iframe + volunteer link-out (see §18)

### Phase 4 — Animal profile page
18. Rebuild `animals/[slug].vue` with new components (dark personality card, gallery, video, CTA)

### Phase 5 — Polish & launch prep
19. OG meta tags on every animal profile (critical for Instagram share previews)
20. Sanity webhook → Vercel redeploy — **believed connected (to-be-confirmed by Hugo in the Vercel/Sanity dashboards).** This is load-bearing for the homepage match quiz, which shows real dog names/photos baked at build time — a freshly-adopted dog keeps smiling from the quiz until the next deploy. Confirm an edit in Studio triggers a production rebuild.
21. **Analytics + cookie hardening** — Umami Cloud account + website; cookieless
    tracking script (env-gated), conversion events on CTAs, dashboard embedded as
    an "Analytics" tool in Sanity Studio; banner-free embeds (lazy GoFundMe, OSM
    map, youtube-nocookie). Set `NUXT_PUBLIC_UMAMI_WEBSITE_ID` (Vercel) and
    `SANITY_STUDIO_UMAMI_SHARE_URL` (Studio). **⏳ Pending env config — see below.**

> **⏳ PENDING ACTION (needs Vercel access — Hugo)** — Umami Cloud is set up;
> implementation PR [#15](https://github.com/Newtoff2000/shelter-project/pull/15)
> is **open and standing, waiting only on these env vars** (code ships inert until
> they're set, then a redeploy):
> 1. **Vercel** (web project, Production env): set
>    `NUXT_PUBLIC_UMAMI_WEBSITE_ID = a765f609-725e-4fd6-8d37-29bb7eefcb23`
>    (script URL defaults to `https://cloud.umami.is/script.js`; only override
>    `NUXT_PUBLIC_UMAMI_SCRIPT_URL` if self-hosting). Redeploy.
> 2. **Studio** env: set
>    `SANITY_STUDIO_UMAMI_SHARE_URL = https://cloud.umami.is/share/2fBpWdDQmXdeArsJ`
>    then `npm run deploy` the Studio. (Share dashboard exposes Overview + Events
>    + Realtime.) Until set, the Analytics tab shows a friendly "not configured"
>    notice.
>
> Until step 1 is done, the tracking script does **not** load (no analytics yet,
> and no dev/preview pollution). Custom events (`donate_click`, `interested_click`,
> `contact_submit`, `instagram_click`) need no setup — Umami creates them on first
> fire. The website ID above is not secret (it ships in the page source).

22. Real animal data entered (Priority 1 — can run in parallel with Phase 1–2)
23. Domain purchased + connected
24. Onboarding session with shelter owner on Sanity Studio (mobile)

---

## 15. Animal Data To-Dos (Sanity)

As of 2026-06-14, 28 dogs are in Sanity. The seed script populated all fields derivable from Instagram post captions. The following fields are still missing across most or all dogs and need to be completed manually in Studio.

**Cover photos — essentially done (27/28).** Sourced by extracting the @ericeira.paws Instagram feed from a Chrome DevTools HAR capture: post captions ("Dog of the Week: NAME") map photos to dogs, and the real photos are the carousel slides behind the branded title cards (their CDN URLs were fetched directly and uploaded as Sanity assets). The homepage hero (`siteSettings.heroPhoto`) is also set. Only **Tobias** still lacks a cover. Following an 80/20 call, four dogs that had **no Instagram presence under their names** (Amelia, Hans, Kaiser, Thor) were **deleted** rather than block development on missing photos — the site needs solid real data to build on, not an exhaustive roster.

| Field | Scope | Why not done yet |
|---|---|---|
| `coverPhoto` / `photos` | Tobias only | All other dogs now have a cover (recovered from Instagram via HAR extraction). Tobias has no Instagram post under that name — needs a photo from the shelter owner. `photos` galleries are still empty across the board. |
| `dateJoined` | Most dogs (exceptions: Caju May 2025, Benson Dec 2023, Morsa Jan 2023) | Instagram posts don't mention arrival dates. Needs to come from the shelter owner or from early Instagram posts announcing each dog's arrival. |
| `neutered` | All 28 dogs | Not mentioned in any of the "Dog of the Week" posts. Shelter owner knows this per dog. |
| `health` | All 28 dogs | Posts don't include vaccination or medical history. Shelter owner is the only source. |
| `interestingFacts` | All 28 dogs | This field is best filled by the shelter owner — it's meant for endearing extras beyond what posts cover. |
| Portuguese (`pt`) translations | All bilingual fields on all 28 dogs | The Instagram posts are in English. Portuguese copy needs to be written separately — either by the shelter owner, translated from the EN content, or drafted by the team. This is a pre-launch blocker for the PT locale. |
| `ageYears` | Taxi (unknown) | Age was not mentioned in the Taxi post. Shelter owner to confirm. |
| `size` | Several original dogs (Casper, Tobias, etc.) | These dogs predate the CSV seed and were never given size data. No Instagram post data available. Shelter owner or Studio entry required. **Display now degrades gracefully** — the card + profile drop a missing `gender`/`size`/`age` from the meta line rather than warning or showing a wrong default (the old `[intlify] filters.null` console warning is gone), but the data gap is real: **12 live records still lack gender/size/age** (Kenny, Casper, Lenny & Oslo, Leo, Drako, Avelã, Snow, Tobias + the 4 success-story pets). The real fix is this backfill. |
| `gender` | Same original dogs | Same situation as size above. |

**Priority before launch:** cover photos — previously the hardest blocker — are now essentially solved (27/28). The remaining data blockers are the **Portuguese (`pt`) translations** (PT-locale launch blocker) and the shelter-owner-only fields (`neutered`, `health`, `interestingFacts`, most `dateJoined`). The shelter owner onboarding session (§14 Phase 5, step 23) should capture these plus a photo for Tobias.

---

## 18. Volunteering / dog-walking — external source of truth

Volunteering and dog-walking are **not** described on this site. All of it — schedule, hours, how to sign up — lives on the **actively maintained external site [3horas.org/paws](https://3horas.org/paws/)**, which is the single source of truth.

**Why:** the website must be as low-maintenance as possible. Animal profiles change often (and must stay current); operational details like walking hours do not belong here, where they'd quietly go stale. Pointing out to 3horas.org means that info is maintained in exactly one place.

**How it's wired:**
- There is **no `/volunteer` page**. `/volunteer` and `/en/volunteer` redirect (307) to `https://3horas.org/paws/` (`routeRules` in `web/nuxt.config.ts`).
- Every "Volunteer" / "Walk" link (header nav, footer nav, footer link-out, homepage Help-path card) points directly to `https://3horas.org/paws/` and opens in a new tab.
- No hardcoded days/hours anywhere in the frontend or i18n strings. (The homepage impact strip still shows a soft "3× walks per week" stat — marketing flavour, not actionable scheduling; revisit if it drifts.)

## 17. Out of Scope (for now)

- User accounts / login for adopters
- Online adoption applications beyond the email form
- Payment processing (donations via GoFundMe only)
- Blog or news section — *but see §16 (parked idea) for a lightweight version worth revisiting*
- Admin dashboard beyond the CMS

---

## 16. Parked Ideas / Possible Future Directions

Ideas captured but deliberately **not** being built yet. Recorded so they aren't lost.

### 16.1 CMS-driven "News & Updates" for volunteers
A new Sanity `update` document type (bilingual title/excerpt/body, cover image, category like *impact / fundraiser / event / appeal*, optional CTA link, optional references to related animals, `featured` to pin) — letting volunteers publish announcements without touching code. Lightest form would be a 3-item "News & Updates" strip on the homepage rather than a full blog (keeps it close to the current "no blog" scope). Amends §15 if adopted.

**Why parked (2026-06-14):** decided not to add as separate site content for now.

**Where this came from:** an @ericeira.paws Instagram repost ([reel DZDci20OIS9](https://www.instagram.com/reel/DZDci20OIS9/)) — a fundraising impact post (greeting cards, €1/card → animals, first €100 donation, partner shout-outs to @superbichosvet, @docstrange.ericeira, @mochlann.coffeebar). This kind of recurring impact/fundraiser announcement has no home in the current animal-only model.

### 16.2 Related observations (no action taken yet)
Surfaced while reviewing the same batch of reels, decided against for now but noted:
- **Volunteer first-person stories** (e.g. [Bugatti, reel DYugK9WsSOB](https://www.instagram.com/reel/DYugK9WsSOB/) — a volunteer's account of walking him). *Decision: fold into the existing `personality` / `history` fields; no dedicated field.*
- **Off-site location & international adoption** (e.g. [Melman, reel DZVeWhssEOu](https://www.instagram.com/reel/DZVeWhssEOu/) — at the public Mafra shelter, "could travel to Germany"). The model currently assumes animals are at this shelter and adopted locally. *Decision: not now.*
- **Source attribution for reposts** — all three reels above are reposts created by other pages, so photos/text carry third-party copyright. Republishing on the official site is a higher bar than reposting on Instagram. No `sourceCredit` field added for now, but **confirm reuse rights (or get fresh photos) before any reposted media goes on the website.**

---

*Last updated: 2026-06-14 — **Visual polish pass**: glowed up the `AnimalCard` (name + meta now ride on the cover photo over a gradient scrim, lift-on-hover with coral shadow, computed "⏳ Waiting 2/3+ years" long-stay whisper; DESIGN.md §5) and added an ambient depth pass (coral hero glow, page-wide film grain, gradient flagship CTAs + impact numbers; DESIGN.md §11), merged on top of main's null-safe card meta line. Added §13.1 tracking design-doc drift (hero full-bleed wording, GoFundMe embed contradiction in UX.md, hardcoded volunteer hours in diagrams, sand colour `#fcf5eb` vs `#f5f0eb`) — **Localization & missing-data display fixes** (from a site critique): animal cards now carry the active locale into detail routes via `localePath` (`AnimalCard.vue`) — EN visitors clicking a card no longer land on a Portuguese profile (was the most serious bug); missing `gender`/`size`/`ageYears` are now **dropped** from the card meta line and profile info bar instead of rendering a wrong `♀` default or a raw `filters.null` i18n key (`AnimalCard.vue` + `animals/[slug].vue`) — note **12 live records still lack gender/size/age** (Kenny, Casper, Lenny & Oslo, Leo, Drako, Avelã, Snow, Tobias + the 4 success-story pets); the display is now correct but the real fix is the §15 backfill; profile "back" link now targets `/<locale>#feed` (locale + feed anchor preserved); reconciled the homepage impact-strip animal count (`~45` → `~50`) to match the donate copy. *(Critique also flagged donate-has-no-payment and "Duke Duke" cards — both already resolved in current code: real GoFundMe embed + 🐾 image fallback; the critique reviewed a stale preview that still listed the 4 deleted records.)* — **Success cards now link to their Instagram post**: added an editable `instagramUrl` field to the animal schema (hidden unless adopted) + to the `animals` API query, made `SuccessCard.vue` render as a new-tab `<a>` (Instagram glyph cue + focus ring) when set, and backfilled the four success records (`blu-pablo`/`naga`/`finn`/`pido`) via `studio/scripts/set-instagram-urls.mjs`; §11 updated. Needs a Studio `npm run deploy` (Hugo) for the editor field to show. — **Volunteering/dog-walking moved to an external source of truth** ([3horas.org/paws](https://3horas.org/paws/)): deleted the `/volunteer` page, added 307 redirects for `/volunteer` + `/en/volunteer` (`routeRules`), repointed all Volunteer/Walk links (nav, footer, footer link-out, Help-path card) to the external site, and removed the hardcoded walk schedule (days/hours) from the footer + Walk-card copy + i18n (`volunteerSchedule` → `volunteerLink`); new §18 + UX.md sitemap updated (PR #27). — Imported the official **Ericeira Paws logo** as a transparent SVG redraw (`LogoMark.vue` + `SiteLogo.vue`, used in nav + footer), loaded **Nunito** (Google Fonts) for the wordmark, and generated a favicon + apple-touch + maskable PWA icon set (`web/public/*.png`, `site.webmanifest`); §12 updated. **Harmonized coral to the brand `#ff5757`** site-wide (`--color-coral` + `-dark`/`-light` + `status-available`), resolving the orange `#e07b54` drift. Fixed a rendering bug: `app.vue` rendered `<NuxtPage/>` **without `<NuxtLayout>`**, so the entire nav + footer never rendered on any page — wrapped it so the `default` layout applies. — Recovered cover photos for the dogs from the @ericeira.paws Instagram feed via Chrome DevTools HAR extraction (carousel slides behind the "Dog of the Week" title cards), uploaded them as Sanity assets + set covers; set the homepage hero photo; replaced 3 low-res covers with high-res versions. Covers now in for 27/28 dogs (only Tobias missing). Deleted 4 records with no Instagram presence (Amelia, Hans, Kaiser, Thor) per an 80/20 call — §0 count refreshed to 28 records (24 available + 4 adopted), §15 cover-photo + size/gender rows updated. — Extended the animal schema for success stories (decided: extend, not a new doc type): added `adopterNames` / `dateAdopted` / `testimonial` fields (hidden until status=adopted) and made `gender`/`ageYears`/`size`/`dateJoined`/`coverPhoto` required only when not adopted (`requiredUnlessAdopted` in `studio/schemaTypes/animal.ts`); backfilled `adopterNames` on the 4 records; built the `SuccessCard` component (frontend); §6 + §11 updated. **Needs `npm run deploy` of Studio (Hugo) to reach the editor.** Created 4 adopted success-story records in Sanity (`story-blu-pablo`, `story-naga`, `story-finn`, `story-pido`) via the @ericeira.paws weekly "Adoption Success Story" series; §0 refreshed to the live count (32 records = 28 available + 4 adopted); §11 documents the series + rights status (Naga cleared, other 3 pending). Also fixed a site-wide Tailwind v4 bug (the `[--color-x]` v3 syntax emitted no CSS) — migrated to `@theme` token utilities + wrapped base styles in `@layer base` (see DESIGN.md §10). Added ⚠️ CRITICAL callout (top) + §4 note: production domain frozen / not auto-promoting on Vercel; promotion steps for Hugo (lesson in agent memory). Session 2: seeded 9 new dogs + patched 7 existing via script (studio/scripts/seed-dogs.mjs); added §15 animal data to-dos; §16 Out of Scope renumbered to §17. Earlier same-day: analytics + cookie decisions (§13 #12/#13: Umami Cloud cookieless, banner-free embeds, OSM map; standing PR #15 awaiting Vercel env); "Our Story" homepage section + self-hosted reel (§5.3, build item 10b) + founding story in SHELTER.md; §16 Parked Ideas; resolved decisions 4/5/7/8/9/10/11; animal fields featured/personalityTraits/shortQuote; DESIGN.md + UX.md + VOICE.md; Next Steps build order (§14); brand colors (coral #ff5757, sand #fcf5eb)*
