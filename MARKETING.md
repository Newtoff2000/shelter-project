# Marketing, SEO & AEO — Ericeira Paws

> This document covers discoverability, channel strategy, and marketing decisions for the Ericeira Paws website. It is a companion to [SSOT.md](./SSOT.md), [SHELTER.md](./SHELTER.md), and [VOICE.md](./VOICE.md). Update it as decisions are made and channels evolve.
>
> **Stage:** pre-launch (no public domain yet). Sections marked ⏳ are blocked until a domain is live and indexed.

---

## 1. North Star

The website's marketing job is simple: **turn the existing Instagram audience into adopters, fosters, and donors, and give the organisation a discoverable presence for people who haven't found the Instagram yet.**

The existing Instagram already does the emotional work. The website's job is to be the credible, stable destination those people arrive at — and to capture people who arrive via search rather than social.

The two audiences to optimise for:

| Audience | How they arrive | What they need |
|---|---|---|
| **Local PT residents** | Google PT-language search, word of mouth, Facebook | Clarity, trust, PT content |
| **Expats / internationals in Ericeira** | Instagram, expat WhatsApp groups, EN-language search | Emotional connection, EN content, practical fostering info |

---

## 2. SEO — What's Implemented

The following is live in the codebase as of PR #35 (merged 2026-06-15):

### Structured data (JSON-LD)
- `@type: AnimalShelter` on every page via `default.vue`
- Fields: `name`, `url`, `logo`, `sameAs` (Instagram), `address` (Ericeira / Mafra / PT), `geo` (38.9633, −9.4175)
- Uses `NUXT_PUBLIC_SITE_URL` env var; falls back to `shelter-project.vercel.app` until real domain is set
- **What's missing:** `telephone`, `openingHours`, `email` (none are public-facing yet); `sameAs` Facebook page (not in Sanity yet)

### Sitemap
- `@nuxtjs/sitemap` installed, per-locale sitemaps at `/__sitemap__/pt-PT.xml` and `/__sitemap__/en-US.xml`
- Dynamic animal profile pages (`/animals/[slug]`) included with `_i18nTransform: true` — every animal appears in both PT and EN sitemaps
- Sitemap `<loc>` tags use absolute URLs (reads from `NUXT_PUBLIC_SITE_URL`)

### Hreflang
- `useLocaleHead()` in `default.vue` emits `<link rel="alternate">` tags on every page
- 5 tags per page: `x-default`, `pt`, `pt-PT`, `en`, `en-US` — all with absolute URLs
- `i18n.baseUrl` config ensures absolute URLs survive SSG prerender

### OG meta tags
- Individual animal profile pages have `og:title`, `og:description` (shortQuote), `og:image` (coverPhoto), `og:type: profile`
- Homepage and other pages: not yet set (Phase 5 step 19 in SSOT.md)

### Analytics
- Umami Cloud (cookieless) implemented in PR #15 — **pending Vercel env vars from Hugo**. See SSOT.md §14 step 21.

---

## 3. SEO — Post-Launch Checklist

These are blocked until a domain is live and promoted in Vercel.

| Priority | Action | Notes |
|---|---|---|
| **Critical** | Set `NUXT_PUBLIC_SITE_URL` in Vercel | Updates JSON-LD `url`/`logo`, sitemap `<loc>`, hreflang `href` to real domain |
| **Critical** | Submit PT sitemap to Google Search Console | URL: `https://yourdomain.pt/__sitemap__/pt-PT.xml` |
| **Critical** | Submit EN sitemap to Google Search Console | URL: `https://yourdomain.pt/__sitemap__/en-US.xml` |
| **High** | Google Business Profile | Requires domain + public address/phone. Ericeira Paws as `AnimalShelter` type. Backlink to website from GBP. |
| **High** | Run [Google Rich Results Test](https://search.google.com/test/rich-results) | Confirm AnimalShelter JSON-LD parses correctly |
| **High** | Add OG meta tags to homepage and other pages | SSOT.md §14 step 19 |
| **Medium** | Add Facebook page URL to JSON-LD `sameAs` | Extend siteSettings in Sanity once Facebook page is confirmed |
| **Medium** | Add GoFundMe page URL to JSON-LD `sameAs` | Same — entity signal connecting all channels |
| **Low** | Verify canonical tags on animal profiles | `@nuxtjs/i18n` should auto-generate; spot-check |
| **Low** | Submit to local directories | Páginas Amarelas, Mafra municipality website, local tourism directories |
| ⏳ Later | Local press mentions | Ericeira online newspaper (ericeiranews.com or similar); a launch mention = backlink |

---

## 4. AEO — Answer Engine Optimization

### What the research found (2026-06-15, 106 agents, 25 claims)

**Verified (high confidence):**
- `AnimalShelter` schema with LocalBusiness-inherited properties is the correct approach — implemented ✅
- Answer-first content structure (inverted pyramid, headers, bullet facts) improves AI engine parsability — already aligned with the data model (`shortQuote` one-liner, `quickFacts` bullets)
- Sitemap `_i18nTransform` for dynamic routes — implemented ✅

**Refuted / noise to ignore:**
- FAQ/HowTo schema "required" for AI Overviews — false, no primary source
- Specific AEO statistics (freshness signals, citation rate numbers) — fabricated sourcing in popular SEO blogs
- "GEO vs AEO" as a meaningful distinction — marketing terminology

**Bottom line:** AEO in 2025 is largely unverifiable. The structural and technical actions (schema, sitemap, content format) are the only high-confidence moves. Anyone selling specific AEO tactics with proprietary statistics is selling noise.

### Open questions (unresolved by research)

1. **Individual animal profile schema** — No `Pet` or `AdoptablePet` type exists in schema.org. Options for `/animals/[slug]` pages: `ItemPage`, custom `ItemList`, or nothing until Google publishes something. Worth revisiting in 6–12 months.
2. **Hreflang + AI engines** — Does hreflang signal influence which PT vs EN variant gets cited by Perplexity/Google AI for a Portuguese-language query? Currently unknown.
3. **E-E-A-T for nonprofits without author bylines** — Do organisational trust signals (registered nonprofit status, press mentions, institutional partnerships) substitute for individual author credentials? Unverified.

### Content structure guidance (applies to copywriting)

Every piece of content written for this site should follow the inverted-pyramid pattern — **most important point first, then elaboration**:
- Animal `shortQuote`: one sentence, personality-first ✅
- `quickFacts`: bullet list, scannnable ✅
- "Our Story" copy: lead with the emotional punch line, not the setup
- Foster section: lead with "what it is" not "how it works"
- FAQ content (if added): answer in the first sentence, then explain

---

## 5. Existing Channels

### Instagram — @ericeira.paws (~1,650 followers)

**Primary discovery channel** for adopters, fosters, and donors. The "Instagram impulse visitor" (Journey 5 in SHELTER.md) is one of the most important user archetypes.

**How the website amplifies Instagram:**
- Each animal profile page has its own URL (`/animals/[slug]`) and OG tags → when shared in stories or DMs, it renders a rich preview with the animal's photo and name
- `sameAs` in JSON-LD links the website to the Instagram entity — helps search engines resolve them as the same organisation
- The website is the stable destination when someone taps "link in bio"
- Success story posts on Instagram → direct-link to the success story section on the website (once built)

**What Instagram can do for the website:**
- Caption links to specific animal profiles drive targeted traffic (e.g., "Meet Rex → link in bio")
- Story links (if account has link stickers) can go directly to `/animals/rex`
- Instagram backlink from bio = weak but real domain authority signal

**What the team should maintain:**
- Keep the bio link pointing to the website (not just the homepage — consider a `link in bio` page or direct profile link when promoting a specific animal)
- Use the animal's exact name in captions so visitors can find them by name filter on the website
- Weekly "Dog of the Week" posts already generate the exact profile content that feeds the Sanity CMS

### Facebook

SHELTER.md confirms the team needs "more hands for social media (Instagram and Facebook)". Facebook likely reaches an older, more locally-settled audience than Instagram — including PT residents and expats who've been in Ericeira longer.

**What we don't know yet:**
- Facebook page URL (needed for `sameAs` in JSON-LD)
- Current follower count / activity level
- Whether it's managed separately from Instagram or cross-posted

**What to do once confirmed:**
- Add Facebook page URL to Sanity `siteSettings` (new field: `facebookUrl`)
- Include in JSON-LD `sameAs` array alongside Instagram
- OG meta tags already serve Facebook Open Graph previews — animal profiles will render rich cards when shared

### 3horas.org/paws (partnership)

An external platform connecting expats to local causes. The shelter has an active listing at [3horas.org/paws](https://3horas.org/paws/), which is the **source of truth for the volunteer schedule** (walks, hours, how to sign up). The website's `/volunteer` route 307-redirects there.

**SEO value:** 3horas.org is an established site with real domain authority. The listing = a local backlink to the shelter's Instagram and (once added) the website URL.

**Action:** Confirm the 3horas listing has the website URL once the domain is live.

### apets (adoption events partner)

Partner association that organises the adoption events the dogs participate in. If apets has a website, a mutual mention or link is a relevant local authority signal.

**Action:** Check if apets has a website and whether a link-exchange or mention is appropriate.

### GoFundMe

Donation channel, embedded on the site. The GoFundMe page is the bridge between casual social media followers and donors.

**SEO / entity value:** GoFundMe pages are indexed by Google. A clear backlink from the GoFundMe page description to the website URL = real domain authority signal. The GoFundMe's `sameAs` equivalent for charity platforms also reinforces the entity.

**Action:** Confirm the GoFundMe page description links back to the website URL once the domain is live.

### WhatsApp groups

Internal volunteer coordination channel. Not a public marketing channel, but the **most direct path to word-of-mouth spread within the expat community**. When volunteers share an animal's website URL in the group, the OG preview (photo + name) is the first impression.

This is already handled: OG tags on animal profiles are implemented.

---

## 6. Content Strategy

### Animal profiles as search content

Each animal profile page (`/animals/[slug]`) is a piece of content that can rank for long-tail queries:
- "adopt [breed] dog Portugal"
- "shelter dog Mafra available"
- "foster dog Ericeira"
- Animal name searches if the Instagram audience searches their name

The data model (`shortQuote`, `quickFacts`, `personality`, `history`) already creates enough content per profile for meaningful indexing — provided the PT translations are filled in (currently English-only, pre-launch blocker).

### Success stories as shareable content

The weekly "Adoption Success Story" series on Instagram (currently 4 records in Sanity) is the most naturally shareable content type. Each story — real family, real photo, real narrative — converts better on social than adoption appeals.

**Website role:**
- Each adopted animal has a permanent profile URL that survives the Instagram post's lifespan
- OG tags on adopted profiles should reflect the "found their home" framing (different from the availability frame)
- Success story section on the homepage (SSOT §14 step 13) makes the impact visible to first-time visitors

**Instagram → website loop:**
Post success story on Instagram → link to the animal's website profile → profile shows the full story → visitor sees other available animals → conversion

### "Our Story" section (already built)

The founding story (Patrícia, international volunteer team, 2024 origin reel) is the trust-building backbone of the site. It humanises the organisation for donors and volunteers.

**AEO note:** the founding story copy should follow inverted-pyramid structure — emotional hook first (why it was started), then the who/how. This makes it more extractable by AI answer engines when someone asks "what is Ericeira Paws."

### "How to adopt a dog in Portugal" (future content)

One of the highest-value pieces of potential content for this site — it answers a real search query from the expat audience ("adopt dog Portugal," "how to adopt a rescue dog in Portugal," "pet passport Portugal"). The shelter team has direct knowledge.

**Why it works for AEO/SEO:**
- Hyper-specific to local context
- Useful to a real audience (Ericeira's expat community)
- Not covered well by other sites targeting this niche
- Natural home in a "How to adopt" section or FAQ within the foster/adopt pages

**Deferred:** out of scope for launch, but worth noting for post-launch content expansion.

---

## 7. Local & Regional Discoverability

### Google Search targets (PT locale)

| Query type | Example | Priority |
|---|---|---|
| Brand | "ericeira paws" | High — should rank #1 |
| Local shelter | "canil mafra adoção", "cão adoção ericeira" | High |
| Species + location | "gato para adotar sintra", "cão adotar mafra" | Medium |
| Foster | "família de acolhimento animal mafra" | Medium |

### Google Search targets (EN locale)

| Query type | Example | Priority |
|---|---|---|
| Brand | "ericeira paws" | High |
| Expat/local | "adopt dog ericeira", "shelter dog portugal" | High |
| Foster expat | "foster dog ericeira", "temporary pet portugal" | High |
| Broader | "animal shelter mafra portugal" | Medium |

### Local directories to submit ⏳

After domain is live:
- Google Business Profile (most important)
- Páginas Amarelas (Portuguese yellow pages)
- Município de Mafra website (check if there's a community organisations section)
- Ericeira.net or local expat community directories
- RSPCA/international rescue registries (if applicable)

---

## 8. Brand Entity Signals

Search engines (and AI answer engines) resolve an organisation as a trusted entity when its name, URL, and details are **consistent across multiple indexed sources**. The goal is to make "Ericeira Paws" unambiguous.

| Channel | Entity signal | Status |
|---|---|---|
| Website JSON-LD | `@type: AnimalShelter`, name, url, geo, sameAs | ✅ Implemented (PR #35) |
| Instagram sameAs | JSON-LD links to `instagram.com/ericeira.paws` | ✅ Implemented |
| Facebook sameAs | JSON-LD links to Facebook page | ⏳ Needs Facebook URL |
| GoFundMe | Link from GoFundMe back to website | ⏳ Needs domain |
| 3horas.org listing | Link from 3horas listing to website | ⏳ Needs domain |
| Google Business Profile | Registered GBP with website URL | ⏳ Needs domain |

**NAP consistency (Name / Address / Phone):** Once a phone number is public-facing, it must be identical across website JSON-LD, Google Business Profile, and all directory listings. Inconsistency is a local SEO risk.

---

## 9. What's Out of Scope (for now)

- Paid advertising (Google Ads, Facebook Ads, Instagram Ads) — resources don't justify it at this scale
- Newsletter / email list — no infrastructure and no time to maintain
- SEO blog / content hub — the "parked ideas" section of SSOT.md (§16) already notes this as a future direction; not for launch
- PR / media outreach — worth doing post-launch (local Ericeira press), but not a pre-launch priority
- International adoption marketing (non-PT/EN languages) — relevant eventually (Ericeira is German/Dutch-heavy), out of scope now

---

## 10. Open Marketing Questions

- [ ] What is the Facebook page URL? (Needed for JSON-LD `sameAs` and OG confirmation)
- [ ] Does the GoFundMe page link back to the website? (Check and update once domain is live)
- [ ] Does the 3horas.org/paws listing have the website URL? (Update once domain is live)
- [ ] Does apets have a website? Is a mutual mention appropriate?
- [ ] Does the team want a "How to adopt in Portugal" FAQ page post-launch?
- [ ] Should the "Dog of the Week" Instagram series map 1:1 to a website feature (e.g., a "featured this week" pinned card)? Currently the `featured` boolean in Sanity does this manually.

---

*Last updated: 2026-06-15 — Initial version, written during SEO/AEO research session. Based on deep-research findings (106 agents, 25 claims verified, 21 killed), SSOT.md, SHELTER.md, and VOICE.md.*
