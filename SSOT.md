# Shelter Project — Single Source of Truth

> This document is the authoritative reference for the architecture, content structure, and product decisions of the shelter website. Update it as decisions evolve.
>
> **See also:** [SHELTER.md](./SHELTER.md) — shelter research, community context, and the six key user journeys the website is designed for.
>
> **See also:** [DESIGN.md](./DESIGN.md) — color palette, typography, homepage IA, animal card spec, component list, embed decisions.
> **See also:** [UX.md](./UX.md) — detailed UX journeys, interaction flows, design patterns, and competitive analogies.
> **See also:** [VOICE.md](./VOICE.md) — tone of voice, CTA language, copy patterns, and bilingual voice decisions.

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
│  Hero                           │  Headline text + photo + primary CTA ("Meet our animals")
├─────────────────────────────────┤
│  Our Story                      │  Founding story + self-hosted reel video (see §5.3)
├─────────────────────────────────┤
│  Animal Feed                    │  Image tile grid with filters
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

### 5.3 Our Story section + video asset

A homepage **"Our Story"** band sits directly below the hero, above the animal feed. It carries the founding narrative (see [SHELTER.md §1 — How it started](./SHELTER.md)) and the shelter's origin-story reel.

- **Copy:** short, 2–3 sentences in the website voice (NOT the raw Instagram caption — see [VOICE.md](./VOICE.md)). Credits the volunteer team and Patrícia. Bilingual PT/EN via i18n strings.
- **Video:** **self-hosted, compressed** — not an Instagram embed (consistent with the no-IG-embed decision, [DESIGN.md §8](./DESIGN.md)). The original reel ([C5eEQShMEF1](https://www.instagram.com/reels/C5eEQShMEF1/), 40 MB MP4) is transcoded to a web-friendly file.
  - Asset: `web/public/our-story.mp4` (vertical, 540px wide, H.264, faststart) + poster `web/public/our-story-poster.jpg`
  - Native `<video>` with `controls`, `playsinline`, `preload="none"` — the file downloads only when the visitor presses play, so it costs nothing on initial load.
  - A secondary "Watch on Instagram" link points back to the reel.
  - Source-of-truth for re-transcoding: `transcode-story.cjs` at the repo root (uses the `ffmpeg-static` binary).

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

---

## 12. Design & Brand

- **Tone:** Warm, emotional, friendly, hopeful
- **Logo:** Exists (to be imported)
- **Brand colors:** Confirmed — coral `#ff5757`, sand `#fcf5eb`. Full palette in [DESIGN.md §2](./DESIGN.md).
- **References:** TBD — shelter owner or team to provide inspiration links
- **Typography:** Confirmed — Nunito Black (labels/animal names), DM Serif Display (hero/editorial), Inter (body). See [DESIGN.md §3](./DESIGN.md).
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
| 7 | Brand colors + typography | **Resolved** — see [DESIGN.md §2–3](./DESIGN.md) |
| 8 | Nuxt rendering mode: SSG vs SSR | **Resolved — SSG** (`nuxt generate`) with Sanity webhook → Vercel redeploy |
| 9 | Instagram embed vs. deep link | **Resolved — deep link only** (no live feed embed; prominent icon in topbar + footer + dedicated "Follow us" section) |
| 10 | GoFundMe: embed or link-out | **Resolved — embed** (official GoFundMe widget iframe in Donate section) |
| 11 | Google Maps | **Resolved — cookieless OpenStreetMap embed in footer** (no API key, no cookies; "view larger map" link out to Google) |
| 12 | Analytics | **Resolved — Umami Cloud** (cookieless, free tier; dashboard embedded as an "Analytics" tool inside Sanity Studio so volunteers use one app) |
| 13 | Cookie consent | **Resolved — no banner needed** (Umami is cookieless; GoFundMe lazy-loaded on click, Google Maps → cookieless OSM, YouTube → youtube-nocookie) |

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
17. **`PageFooter`** — nav + socials + Google Maps iframe + volunteer schedule

### Phase 4 — Animal profile page
18. Rebuild `animals/[slug].vue` with new components (dark personality card, gallery, video, CTA)

### Phase 5 — Polish & launch prep
19. OG meta tags on every animal profile (critical for Instagram share previews)
20. Sanity webhook → Vercel redeploy wired up
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
| `size` | Several original dogs (Casper, Tobias, etc.) | These dogs predate the CSV seed and were never given size data. No Instagram post data available. Shelter owner or Studio entry required. |
| `gender` | Same original dogs | Same situation as size above. |

**Priority before launch:** cover photos — previously the hardest blocker — are now essentially solved (27/28). The remaining data blockers are the **Portuguese (`pt`) translations** (PT-locale launch blocker) and the shelter-owner-only fields (`neutered`, `health`, `interestingFacts`, most `dateJoined`). The shelter owner onboarding session (§14 Phase 5, step 23) should capture these plus a photo for Tobias.

---

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

*Last updated: 2026-06-14 — Recovered cover photos for the dogs from the @ericeira.paws Instagram feed via Chrome DevTools HAR extraction (carousel slides behind the "Dog of the Week" title cards), uploaded them as Sanity assets + set covers; set the homepage hero photo; replaced 3 low-res covers with high-res versions. Covers now in for 27/28 dogs (only Tobias missing). Deleted 4 records with no Instagram presence (Amelia, Hans, Kaiser, Thor) per an 80/20 call — §0 count refreshed to 28 records (24 available + 4 adopted), §15 cover-photo + size/gender rows updated. — Extended the animal schema for success stories (decided: extend, not a new doc type): added `adopterNames` / `dateAdopted` / `testimonial` fields (hidden until status=adopted) and made `gender`/`ageYears`/`size`/`dateJoined`/`coverPhoto` required only when not adopted (`requiredUnlessAdopted` in `studio/schemaTypes/animal.ts`); backfilled `adopterNames` on the 4 records; built the `SuccessCard` component (frontend); §6 + §11 updated. **Needs `npm run deploy` of Studio (Hugo) to reach the editor.** Created 4 adopted success-story records in Sanity (`story-blu-pablo`, `story-naga`, `story-finn`, `story-pido`) via the @ericeira.paws weekly "Adoption Success Story" series; §0 refreshed to the live count (32 records = 28 available + 4 adopted); §11 documents the series + rights status (Naga cleared, other 3 pending). Also fixed a site-wide Tailwind v4 bug (the `[--color-x]` v3 syntax emitted no CSS) — migrated to `@theme` token utilities + wrapped base styles in `@layer base` (see DESIGN.md §10). Added ⚠️ CRITICAL callout (top) + §4 note: production domain frozen / not auto-promoting on Vercel; promotion steps for Hugo (lesson in agent memory). Session 2: seeded 9 new dogs + patched 7 existing via script (studio/scripts/seed-dogs.mjs); added §15 animal data to-dos; §16 Out of Scope renumbered to §17. Earlier same-day: analytics + cookie decisions (§13 #12/#13: Umami Cloud cookieless, banner-free embeds, OSM map; standing PR #15 awaiting Vercel env); "Our Story" homepage section + self-hosted reel (§5.3, build item 10b) + founding story in SHELTER.md; §16 Parked Ideas; resolved decisions 4/5/7/8/9/10/11; animal fields featured/personalityTraits/shortQuote; DESIGN.md + UX.md + VOICE.md; Next Steps build order (§14); brand colors (coral #ff5757, sand #fcf5eb)*
