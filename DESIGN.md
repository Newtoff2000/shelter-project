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
--color-coral:        #e07b54;   /* Primary CTA, active filters, status badge (available) */
--color-coral-dark:   #c4613d;   /* Hover state for coral elements */
--color-coral-light:  #f9ede7;   /* Chip backgrounds, soft highlights */

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

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display headings (hero, section titles) | `DM Serif Display` or `Playfair Display` | 400 | Emotional warmth — feels handcrafted, not corporate |
| Body text | `Inter` or `Plus Jakarta Sans` | 400 / 500 | Clean, excellent on mobile at small sizes |
| Labels / chips / caps | Body font | 500 | `uppercase`, `letter-spacing: 0.1em` |
| Animal name on card | Body font | 700 | Large, bold — names are the primary hierarchy |

Load via Google Fonts. Fallback: `Georgia, serif` for display; `system-ui, sans-serif` for body.

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
│  Full-bleed photo from Sanity (heroPhoto)           │
│  Headline: CMS-editable (heroHeadline, bilingual)   │
│  Primary CTA: "Meet the animals" → scrolls to feed  │
│  Secondary CTA: "Support us" → scrolls to donate    │
│  → Adopter + Impulse visitor: emotional hook first  │
├─────────────────────────────────────────────────────┤
│  IMPACT STRIP (no title, horizontal)                │
│  ~45 animals in shelter  ·  X adopted this year  · │
│  Mon/Wed/Fri walks  ·  €2,042 raised               │
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
│  Volunteer schedule: Mon/Wed/Fri, 9am–1pm           │
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

---

## 6. Animal Profile Page

Sections on `/animals/[slug]`:

```
HERO
  Full-width photo · Name overlay · Status badge

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
| **Google Maps** | ✅ Embed (small) | Static Google Maps iframe in footer showing CROAMM location in Mafra. No API key needed for basic embed. |
| **Instagram live feed** | ❌ No embed | Avoid Meta Graph API (requires reauth every 60 days, fragile). Instead: 3–4 manually curated post images managed in Sanity `siteSettings`, or a simple "Follow us" CTA section. Instagram drives traffic *to* the site — the site drives traffic *to* Instagram. |
| **Facebook widget** | ❌ Skip | Ericeira Paws is Instagram-primary. Facebook Page Plugin adds cookie consent overhead with minimal benefit. |
| **Instagram deep link** | ✅ Yes, prominent | Icon in topbar. Icon + handle in footer. Dedicated "Follow our story" section between Success Stories and Donate. Treat it as a primary channel link, not a social footer afterthought. |

---

## 9. Components to Build (in priority order)

| # | Component | Props / notes |
|---|---|---|
| 1 | `TraitChip` | `trait: string` → maps to icon + label. Light variant (teal-light bg) and dark variant (teal border on charcoal). |
| 2 | `AnimalCard` | `animal` object → photo, name, gender/age/size, shortQuote, 3 trait chips, status, featured pin. |
| 3 | `FilterBar` | Species, gender, age, size + trait multi-select + name search. Emits filter state. Client-side. |
| 4 | `ImpactStrip` | 4–5 stat chips in a horizontal strip. Numbers from Sanity `siteSettings` or hardcoded initially. |
| 5 | `HelpPath` | 4-up grid: Adopt / Foster / Walk / Donate. Each: icon + heading + 2-line copy + CTA. |
| 6 | `SuccessCard` | Adopted animal card: photo + name + "Found their home [Month Year]". Driven by `status=adopted`. |
| 7 | `InstagramSection` | Static curated posts + Follow CTA. Posts: array of images from Sanity or static. |
| 8 | `ContactForm` | Name + email + message. Sends via Resend (server route). ReCAPTCHA or honeypot. |

Layout components: `TopBar`, `SiteNav` (sticky), `HeroSection`, `PageFooter` (with Maps embed).

---

## 10. Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| CSS approach | **Tailwind CSS v4** | Utility-first, responsive design fast, design tokens map cleanly to palette above. The Lovable reference (which user liked) uses it. |
| Component library | **None** | Custom components built on Tailwind. Avoids generic look; we need ~8 components total. |
| Rendering mode | **SSG** (`nuxt generate`) | 45 animals → 10s build. Content changes a few times/week. Sanity webhook triggers Vercel redeploy (30–60s to live). Zero server cost, CDN edge, perfect OG meta for animal shares. |
| Email delivery | **Resend** | Generous free tier, works perfectly with Nuxt server routes, simple API. |
| Fonts | **DM Serif Display** (headings) + **Inter** (body) | Load via Google Fonts or Fontsource npm packages. |

---

*Last updated: 2026-06-14 — Initial design brief from reference site analysis*
