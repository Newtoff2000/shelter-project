# Shelter Project — Single Source of Truth

> This document is the authoritative reference for the architecture, content structure, and product decisions of the shelter website. Update it as decisions evolve.
>
> **See also:** [SHELTER.md](./SHELTER.md) — shelter research, community context, and the six key user journeys the website is designed for.
>
> **See also:** [DESIGN.md](./DESIGN.md) — color palette, typography, homepage IA, animal card spec, component list, embed decisions.
> **See also:** [UX.md](./UX.md) — detailed UX journeys, interaction flows, design patterns, and competitive analogies.
> **See also:** [VOICE.md](./VOICE.md) — tone of voice, CTA language, copy patterns, and bilingual voice decisions.

---

## 0. Current Priorities

These are the two active workstreams as of 2026-06-14:

### Priority 1 — Real animal data from Instagram
Populate the Sanity CMS with real dog profiles sourced from [@ericeira.paws](https://www.instagram.com/ericeira.paws/) on Instagram. Each dog needs: name, photos, cover photo, basic attributes (species, gender, age, size, status), and bilingual profile content (personality, history, quick facts) where available from captions. 13 dogs already seeded (Kaiser, Taxi, Lenny & Oslo, Drako, Kenny, Amelia, Avelã, Leo, Hans, Thor, Casper, Snow, Tobias) — photos, age, gender, size to be filled in via Studio.

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

- **Hosting:** Vercel (free tier) — **live**, auto-deploys from `main`
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
| `history` | Rich text | |
| `health` | Rich text | |
| `interesting_facts` | Rich text | |

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
- A **Success Stories** section or page can showcase adopted animals
- Decision pending on whether this is a dedicated page or a section of the main page

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
| 11 | Google Maps | **Resolved — small embed in footer** (static iframe, no API key needed) |

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
21. Real animal data entered (Priority 1 — can run in parallel with Phase 1–2)
22. Domain purchased + connected
23. Onboarding session with shelter owner on Sanity Studio (mobile)

---

## 15. Out of Scope (for now)

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

*Last updated: 2026-06-14 — Added §16 Parked Ideas (CMS-driven volunteer "News & Updates", plus notes on volunteer stories, off-site/international adoption, and repost attribution) sourced from @ericeira.paws Instagram reels; earlier same-day: resolved open decisions 4/5/7/8/9/10/11; added new animal fields (featured, personalityTraits, shortQuote); added DESIGN.md + UX.md + VOICE.md references; added Next Steps build order (§14); 13 dogs seeded in Sanity; confirmed brand colors from shelter assets (coral #ff5757, sand #fcf5eb)*
