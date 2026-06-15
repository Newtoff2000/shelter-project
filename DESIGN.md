# Ericeira Paws — Frontend Design Reference

> Derived from analysis of 7 reference shelter sites (Lovable/Happy Tails, Animal Care Austria, Pfotenretter Wien, Seelenhunde, Tierheim Brunn, Adopta-me, Humane Society of Westchester) cross-referenced against the six user journeys in SHELTER.md. This document is the design brief for the frontend redesign — update it as decisions firm up.

---

## 1. Design Principles

These flow directly from the user journeys in SHELTER.md:

| Principle | In practice |
|---|---|
| **Emotional before informational** | Every headline leads with feeling, not function. Animals are protagonists, not records. |
| **Mobile-first** | Instagram is the primary discovery channel. Every interaction must work on a thumb. |
| **Speed and scannability** | Impulse visitors from Instagram have a narrow window. Feed loads all at once, filters are instant. |
| **Real over polished** | Real photos of real animals and volunteers — no stock. Empty states show a real photo too. |
| **Multiple on-ramps** | Adopt → Foster → Walk → Donate → Share. Every page offers a graceful next step. |
| **Radical transparency** | Show conditions, show where donations go, show how many animals are waiting. |
| **Bilingual without friction** | Seamless PT-PT / EN switching, no broken layouts, no untranslated strings. |

---

## 2. Color Palette

Extend the existing coral + beige palette — keep it warm, coastal, distinctly not clinical.

```css
/* Base */
--color-sand:         #f5f0eb;   /* Page background */
--color-white:        #ffffff;   /* Cards, modals */
--color-charcoal:     #1e1e1e;   /* Used for dark card variant (personality section) */

/* Text */
--color-ink:          #3d3d3d;   /* Body text */
--color-muted:        #888888;   /* Meta labels, secondary info */
--color-heading:      #1e1e1e;   /* Display headings */

/* Coral — primary accent */
--color-coral:        #ff5757;   /* Primary CTA, active filters, status badge (available) — confirmed from brand assets */
--color-coral-dark:   #cc3e3e;   /* Hover state for coral elements */
--color-coral-light:  #fff0f0;   /* Chip backgrounds, soft highlights */

/* Teal — secondary accent */
--color-teal:         #3d7a6e;   /* Personality chips, secondary badges, links */
--color-teal-dark:    #2a5a50;   /* Hover state for teal elements */
--color-teal-light:   #d4ede9;   /* Personality chip background on light cards */

/* Status */
--color-status-available: var(--color-coral);
--color-status-reserved:  #e0a030;   /* Amber */
--color-status-adopted:   #5a8a5e;   /* Muted green */
```

**Dark variant** (for personality section on animal profile, mirrors the screenshot):
- Background: `--color-charcoal`
- Chip border: `--color-teal`
- Chip text: white / very light
- Body text: `#e0e0e0`

---

## 3. Typography

Three-font system — each role is distinct:

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display headings (hero, emotional long-form) | `DM Serif Display` | 400 | Warmth and editorial feel — hero headline, profile section titles |
| Punchy labels / eyebrow text / animal names | `Nunito` | 800 (ExtraBold) or 900 (Black) | All-caps, rounded — matches the Instagram "DOG OF THE WEEK" lettering directly. Use for section eyebrows ("MEET THE ANIMALS"), animal name on card, and TraitChip labels. Fallback: `Fredoka One`. |
| Body text / meta / forms | `Inter` | 400 / 500 | Clean, excellent on mobile at small sizes |

Load via Google Fonts. Fallbacks: `Georgia, serif` for DM Serif Display; `system-ui, sans-serif` for Inter and Nunito.

---

## 4. Homepage Information Architecture

Sections in order — each mapped to the user journeys it serves:

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR                                             │
│  [Donate →]  [PT | EN]  [Instagram ⌂]              │
│  Donate CTA always visible · language toggle ·      │
│  Instagram icon links to @ericeira.paws             │
│  → Donor journey: donate is always one tap away     │
├─────────────────────────────────────────────────────┤
│  NAVIGATION (sticky on scroll)                      │
│  [Logo]  Meet the animals · Foster · Volunteer ·    │
│          Donate · Contact                [PT|EN]    │
│  → Multiple on-ramps; Foster has its own nav item   │
├─────────────────────────────────────────────────────┤
│  HERO                                               │
│  Two-column split (desktop): text + CTAs left,      │
│  floating transparent-PNG animal right.             │
│  No text overlaid on image. Stacks on mobile.       │
│  See SSOT §5.4 for full spec (transparent-cutout).  │
│  Headline: CMS-editable (heroHeadline, bilingual)   │
│  Primary CTA: "Meet the animals" → scrolls to feed  │
│  Secondary CTA: "Support us" → scrolls to donate    │
│  → Adopter + Impulse visitor: emotional hook first  │
├─────────────────────────────────────────────────────┤
│  OUR STORY                                          │
│  Self-hosted reel video (poster + native player)    │
│  + short founding story (personal project +         │
│    Patrícia + the volunteer team) + "Watch on IG"   │
│  → Donor legitimacy · Volunteer belonging · trust   │
├─────────────────────────────────────────────────────┤
│  IMPACT STRIP (no title, horizontal)                │
│  ~50 animals in shelter  ·  X adopted this year  · │
│  3× walks per week  ·  €2,042 raised               │
│  → Donor trust signal · Community champion signal   │
├─────────────────────────────────────────────────────┤
│  ANIMAL FEED                                        │
│  "Meet the animals"                                 │
│  [Search by name ___]                               │
│  [Species ▾] [Gender ▾] [Age ▾] [Size ▾]           │
│  [Personality: ☀️Friendly 😊Calm 👀Curious ...]    │  ← new
│  Grid of animal cards (all animals, client-side)    │
│  Featured animals pinned first                      │  ← new
│  → Adopter journey + Impulse visitor (name search)  │
├─────────────────────────────────────────────────────┤
│  HOW YOU CAN HELP                                   │
│  4 paths in a grid:                                 │
│    🐾 Adopt      📦 Foster                          │
│    🚶 Walk        ❤️ Donate                         │
│  Each: icon + 2-line copy + CTA button              │
│  → Foster journey · Volunteer journey · Donor       │
├─────────────────────────────────────────────────────┤
│  SUCCESS STORIES                                    │
│  "X animals found their forever home"               │
│  Auto-populated cards: status=adopted animals       │
│  Card: photo + name + "Found their home [Month Year]"│
│  → Community champion · Donor retention             │
├─────────────────────────────────────────────────────┤
│  INSTAGRAM                                          │
│  "@ericeira.paws"                                   │
│  3 curated posts (images managed in Sanity          │
│    siteSettings.featuredPosts — optional)           │
│  [Follow us on Instagram →]                         │
│  → All journeys: connects to primary channel        │
├─────────────────────────────────────────────────────┤
│  DONATE                                             │
│  GoFundMe embed widget (iframe)                     │
│  3-bullet "what your donation funds" breakdown      │
│  → Donor journey: catches those who scrolled past   │
├─────────────────────────────────────────────────────┤
│  CONTACT                                            │
│  Name · Email · Message                             │
│  "Or message us on Instagram" secondary option      │
├─────────────────────────────────────────────────────┤
│  FOOTER                                             │
│  [Logo]                                             │
│  Navigation links                                   │
│  Instagram · [other socials if any]                 │
│  Location: CROAMM, Mafra · 15 min from Ericeira     │
│  Google Maps mini-embed                             │
│  Volunteer: link-out to 3horas.org/paws             │
│  © Ericeira Paws · Legal links                      │
└─────────────────────────────────────────────────────┘
```

---

## 5. Animal Card Design

Displayed in the feed grid. Mobile: 1–2 columns. Desktop: 3–4 columns.

```
┌─────────────────────────┐
│                         │
│      [cover photo]      │  4:3 ratio, cover crop, hotspot-aware
│       full-bleed        │
│  ◉ Featured             │  ← pin badge (if featured=true), top-left
│                         │
├─────────────────────────┤
│ Loki                    │  Name — large, bold
│ ♂ · 3 yrs · Medium     │  Gender · Age · Size — small, muted
│                         │
│ "Loves every stranger   │  shortQuote — italic, 1–2 lines, muted
│  like an old friend."   │
│                         │
│ ☀️ Friendly  😊 Calm   │  personalityTraits chips — first 2–3
│ 👀 Curious              │  teal bg + teal text on light card
│                         │
│ [Meet Loki →]           │  CTA — coral, appears on hover (desktop)
│                         │  or always visible (mobile)
└─────────────────────────┘
```

**Status handling:**
- `available`: no badge (default, most animals)
- `reserved`: amber "Reserved" badge, card slightly dimmed
- `adopted`: shown only in Success Stories section, not in main feed

**Featured:** small "⭐ Featured" or "Waiting for you" chip top-left. Featured animals sort to top of grid, then all others in dateJoined order (longest wait first).

**Shipped visual treatment (2026-06-14):** the card leads with the face — **name + gender/age/size ride directly on the cover photo** over a bottom-up black gradient scrim (legible over any photo), Tinder-for-dogs per UX.md Part III. The body below carries only the quote, trait chips, and CTA. Hover **lifts** the card (`-translate-y-1.5` + a coral-tinted shadow bloom) while the photo zooms slightly and the CTA arrow nudges. A **long-stay whisper** ("⏳ Waiting 2 / 3+ years", bilingual `card.waiting2/3`) appears above the name only for `available` animals at the shelter 2+ years — a durable, computed counter (UX.md §4), shown only on the longest-waiting cards to keep the grid uncluttered.

---

## 6. Animal Profile Page

Sections on `/animals/[slug]`:

```
HERO
  Full-width cover photo · Name overlay · Status badge
  (animal profile — distinct from homepage transparent-cutout split; see SSOT §5.4)

BASIC INFO BAR
  Species · Gender · Age · Size · At shelter since · Neutered

PERSONALITY TRAITS (dark card variant — mirrors the screenshot)
  Trait chips: ☀️ Friendly  🌿 Gentle  😊 Calm ...
  shortQuote in italic below chips
  Full personality rich text below

"I'm Interested" CTA
  Pre-filled with animal name → contact form / email

VIDEO (if videoUrl)
  Embedded or linked video

HISTORY
  How they ended up at the shelter

HEALTH
  Vaccinations, conditions, notes

INTERESTING FACTS
  Fun extras

PHOTO GALLERY
  Responsive grid of additional photos
```

---

## 7. Personality Traits Reference

These are the enum values stored in Sanity. The frontend maps each to an icon:

| Value | Display | Icon |
|---|---|---|
| `friendly` | Friendly | ☀️ |
| `gentle` | Gentle | 🌿 |
| `calm` | Calm | 😊 |
| `curious` | Curious | 👀 |
| `playful` | Playful | 🐾 |
| `independent` | Independent | 🛡️ |
| `affectionate` | Affectionate | ❤️ |
| `energetic` | Energetic | ⚡ |
| `good_with_kids` | Good with kids | 🤝 |
| `good_with_dogs` | Good with dogs | 🐕 |
| `good_with_cats` | Good with cats | 🐱 |

Filter UI: multi-select chip strip above the grid. Selecting multiple traits shows animals that have **any** of them (OR logic — more permissive, fewer empty states).

---

## 8. Embed Decisions

| Embed | Decision | Implementation |
|---|---|---|
| **GoFundMe** | ✅ Embed | GoFundMe fundraiser widget (official iframe/script). Auto-updates raised amount, donor count, goal bar. Zero maintenance post-setup. |
| **Google Maps** | ✅ Embed (cookieless OSM) | **OpenStreetMap** (cookieless) iframe in footer showing CROAMM/Mafra location. No API key, no cookies. "View larger map" links out to Google Maps. Replaced Google Maps embed per decision #11. |
| **Instagram live feed** | ❌ No embed | Avoid Meta Graph API (requires reauth every 60 days, fragile). Instead: 3–4 manually curated post images managed in Sanity `siteSettings`, or a simple "Follow us" CTA section. Instagram drives traffic *to* the site — the site drives traffic *to* Instagram. |
| **Facebook widget** | ❌ Skip | Ericeira Paws is Instagram-primary. Facebook Page Plugin adds cookie consent overhead with minimal benefit. |
| **Instagram deep link** | ✅ Yes, prominent | Icon in topbar. Icon + handle in footer. Dedicated "Follow our story" section between Success Stories and Donate. Treat it as a primary channel link, not a social footer afterthought. |
| **Story reel video** | ✅ Self-host (not embed) | The founding-story reel is transcoded to `web/public/our-story.mp4` (540px vertical, H.264, faststart, ~12 MB) + poster. Native `<video controls playsinline preload="none">` — downloads only on play, zero initial-load cost, no Meta cookies. A "Watch on Instagram" link sits beside it. Re-transcode via `transcode-story.cjs` at repo root. Consistent with the no-IG-embed stance above. |

---

## 9. Components to Build (in priority order)

| # | Component | Props / notes |
|---|---|---|
| 1 | `TraitChip` | `trait: string` → maps to icon + label. Light variant (teal-light bg) and dark variant (teal border on charcoal). |
| 2 | `AnimalCard` | `animal` object → photo, name, gender/age/size, shortQuote, 3 trait chips, status, featured pin. |
| 3 | `FilterBar` | Species, gender, age, size + trait multi-select + name search. Emits filter state. Client-side. |
| 4 | `ImpactStrip` | 4–5 stat chips in a horizontal strip. Numbers from Sanity `siteSettings` or hardcoded initially. |
| 5 | `HelpPath` | 4-up grid: Adopt / Foster / Walk / Donate. Each: icon + heading + 2-line copy + CTA. |
| 6 | `SuccessCard` | Adopted animal card: photo + name + adopter names ("with Caroline & David") + "Found their home · [Month Year]" (`dateAdopted`) + optional testimonial revealed on hover/focus. Driven by `status=adopted`. **Built** — `web/app/components/SuccessCard.vue`. |
| 7 | `InstagramSection` | Static curated posts + Follow CTA. Posts: array of images from Sanity or static. |
| 8 | `ContactForm` | Name + email + message. Sends via Resend (server route). ReCAPTCHA or honeypot. |

Layout components: `TopBar`, `SiteNav` (sticky), `HeroSection`, `PageFooter` (with Maps embed).

---

## 10. Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| CSS approach | **Tailwind CSS v4** | Utility-first, responsive design fast, design tokens map cleanly to palette above. The Lovable reference (which user liked) uses it. |
| Color utilities | **Theme-token classes** (`bg-charcoal`, `text-coral`, `bg-status-adopted`) | Colors live in `@theme` in `main.css`, so token utilities are generated automatically. **Do NOT use the v3 `bg-[--color-x]` bare-variable syntax — Tailwind v4 dropped it and silently emits no CSS** (builds still pass, styles just vanish). If a raw var is unavoidable, use `bg-(--color-x)`. |
| Base CSS layering | **Base styles in `@layer base`** | `body`/heading rules must be wrapped in `@layer base` — unlayered CSS outranks Tailwind's `@layer utilities`, so otherwise `text-white`/`text-coral` can't override heading colors. |
| Component library | **None** | Custom components built on Tailwind. Avoids generic look; we need ~8 components total. |
| Rendering mode | **SSG** (`nuxt generate`) | 45 animals → 10s build. Content changes a few times/week. Sanity webhook triggers Vercel redeploy (30–60s to live). Zero server cost, CDN edge, perfect OG meta for animal shares. |
| Email delivery | **Resend** | Generous free tier, works perfectly with Nuxt server routes, simple API. |
| Fonts | **DM Serif Display** (headings) + **Inter** (body) + **Nunito** (Black Italic — logo wordmark, eyebrows, animal names) | Loaded via Google Fonts. |

---

## 11. Ambient depth & polish (shipped 2026-06-14)

Reusable warmth/depth treatments layered on top of the flat color bands, to move the site away from a "stock template" feel. All are SSG-safe and respect `prefers-reduced-motion`.

| Treatment | Where | Implementation |
|---|---|---|
| **Coral hero glow** | Behind the floating hero animal | `.hero-glow` radial-gradient (coral, fading to transparent) absolutely positioned in the charcoal hero, content layered above with `relative`. |
| **Film grain** | Whole page (shows through on sand / transparent sections) | `body::before` fixed SVG `feTurbulence` noise at very low opacity, `mix-blend-mode: multiply`, `z-index: -1`, `pointer-events: none`. Charcoal/white sections paint over it. |
| **Gradient CTAs** | Flagship buttons (hero "Meet the animals", Instagram follow) | `.cta-coral` component class — coral→`#ff7a45` gradient + soft coral shadow + 2px hover lift. |
| **Gradient stat numbers** | Impact strip | `.stat-gradient` — coral→`#ffb05c` gradient clipped to text. |

*Last updated: 2026-06-15 — Doc drift cleanup (SSOT §13.1): corrected sand color to `#f5f0eb` (matches code); updated §4 HERO to transparent-cutout split layout; updated §4 impact strip count (~50) and removed hardcoded volunteer schedule; replaced footer volunteer schedule line with 3horas.org/paws link-out; updated §6 to distinguish profile hero from homepage split; updated §8 Google Maps → cookieless OSM (decision #11). — 2026-06-14: Documented shipped AnimalCard glow-up (§5) + ambient depth pass (§11). — Initial design brief from reference site analysis*
