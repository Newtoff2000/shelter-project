# VIBE — How Ericeira Paws Looks, Flows, and Speaks

> The craft canon for the website: design principles, who we serve, how the site is laid out, how it behaves, and how it speaks. The **why** lives here. The **what** — exact colors, fonts, trait icons, component inventory — lives in code (see the map in [CLAUDE.md](./CLAUDE.md)); this doc never restates a value the repo already holds, because copies drift. Project architecture and standing to-dos live in [SSOT.md](./SSOT.md).

---

## 1. Design Principles

Everything else in this doc descends from these. They come from who we serve (§2) and the reality of a volunteer-run shelter (SSOT).

| Principle | In practice |
|---|---|
| **Emotional before informational** | Lead with a face, a name, a story — never a list or a spec. Animals are protagonists, not records. |
| **Mobile-first, always** | 80%+ of traffic arrives from Instagram on a phone. Design for 375px first; every interaction must work under a thumb. |
| **Speed and scannability** | The impulse visitor has a narrow window. The feed loads all animals at once; filtering is instant and client-side. |
| **Real over polished** | Real photos of real animals and volunteers. No stock. Empty states show a real photo too. |
| **Multiple on-ramps** | Adopt → Foster → Walk → Donate → Share. No page is a dead end; every one offers a graceful next step. |
| **Radical transparency** | Show the conditions, show where donations go, show how many animals are waiting. This is the shelter's own promise made visual. |
| **Bilingual without friction** | Seamless PT-PT / EN switching — no broken layouts, no untranslated strings. Each language reads as if written natively (see §9). |

---

## 2. Who We Serve — Six Journeys, Three Problems

The six journeys are empathy tools. For *building*, they collapse into three design problems. Both views matter: the journeys keep us honest about who's on the other side of the screen; the problems keep us from building six of everything.

### The three problems (how the site is actually built)

| Problem | Serves | What it is |
|---|---|---|
| **A — The animal browser** | Adopter, Foster, Impulse Visitor | The core product: a fast, filterable grid of ~50 animals, each linking to a rich profile. What the site does that Instagram can't — browse, filter, search by name, deep-dive one animal's full story. |
| **B — The how-to-help router** | Foster, Volunteer, Donor | Informational sections that answer the common questions and route to the right endpoint (contact form, WhatsApp, GoFundMe). **Not** conversion funnels — their job is to reduce the team's repetitive WhatsApp Q&A *before* the handoff. |
| **C — The trust & freshness layer** | Everyone, esp. returning visitors | Success stories, impact counters, real photos, the founding story. Makes the site feel alive and credible. Must stay alive with near-zero editorial effort (§7). |

### The six journeys

Each is a real person hiring the website for a job. Ordered by volume and emotional urgency.

**1 — The Adopter** · *"I want to give an animal a home."*
Settled local or expat with stable housing. Arrives from Instagram or a Google search, hopeful and slightly anxious. The **animal profile is the conversion page** — every design dollar spent here pays off. Lead with the photo and the name; the personality section does the emotional work, the facts row does the practical work. A **"What happens next?"** 3-step explainer at the bottom of every profile kills the post-form anxiety that drives drop-off. The "I'm Interested" CTA is sticky on mobile.

**2 — The Foster** · *"I can't adopt forever, but I can help for now."*
Digital nomad or expat here 2–12 months. Interested but cautious — needs *permission* to commit temporarily. Fostering gets **its own section**, not a footnote under adoption: what it means, what it costs, what support you get, what happens at the end. A real **foster success story** (photo + first-person quote) converts better than any explanatory copy. Soft, *lateral* fallbacks if they're not ready (walk a dog, donate) — never lose them.

**3 — The Volunteer** · *"I want to give my time, not just money."*
Expat or local seeking community and purpose, often via 3Horas. **The site does not host volunteering** — `/volunteer` 307-redirects to [3horas.org/paws](https://3horas.org/paws/), the maintained single source of truth for schedule, roles, and sign-up (SSOT §"Volunteering"). The site's only job here is to route cleanly. Why: walking hours go stale; keeping them in one externally-maintained place is the low-maintenance choice.

**4 — The Donor** · *"I can't be there, but I can still help."*
Remote supporter acting on a narrow emotional window. The **Donate button lives in the persistent top bar** — reachable from anywhere without scrolling. Giving is **impact-denominated** ("€20 feeds a dog for a month"), not "donate any amount." Social proof (GoFundMe progress, donor count) reduces the "am I the only one?" hesitation. The moment *after* donating is the highest-empathy moment — prompt a share.

**5 — The Impulse Visitor** · *"I just saw a dog on Instagram and I need to find them."*
100% mobile, ~60 seconds of attention, connected to a *specific face and name*. **Name-based text search in the feed is the single highest-impact feature** for this person. Cards must confirm identity in under a second (big cover photo, bold name, 2–3 trait chips). **OG meta tags on every profile** make WhatsApp/iMessage shares render rich previews — free virality. If the animal is adopted, show a warm "Found their home" state and suggest others — never a dead end (the reel that sent them here lives forever).

**6 — The Community Champion** · *"I'm part of this and I want to see the impact."*
Past adopter, foster, volunteer, or repeat donor returning for the emotional payoff. **Success Stories is load-bearing here, not a nice-to-have** — it's where the loop closes and what gets shared organically. **Durable counters** ("47 adopted since 2023") over fragile ones ("3 this month"). Every story card is shareable with a rich preview. The homepage should show *something* changed since last visit.

---

## 3. Information Architecture

One canonical sitemap. All routes support an `/en/` prefix; Portuguese is the default, unprefixed (i18n strategy in `nuxt.config.ts`).

```
ericeirapaws.org
├── /  (Homepage)
│   ├── Hero — emotional hook + primary CTA
│   ├── Our Story — founding narrative + self-hosted reel
│   ├── Find Your Match — 3-tap quiz teaser + name search + "See all dogs →"
│   ├── How to Help — Adopt · Foster · Walk · Donate
│   ├── Success Stories — adopted animals + impact counters
│   ├── Donate — GoFundMe embed
│   └── Contact — email form
│
├── /animals  (full browsable, filterable grid)
│
├── /animals/[slug]  (Animal Profile — the conversion page)
│   ├── Cover photo + name + status
│   ├── Key facts (species · gender · age · size · time at shelter · neutered)
│   ├── Personality (dark card) + quick facts
│   ├── "I'm Interested" CTA (sticky on mobile)
│   ├── Gallery + video
│   ├── History · Health · Interesting facts
│   └── "What happens next?" — 3-step adoption explainer
│
└── /volunteer  → 307 redirect to 3horas.org/paws  (not hosted here — §2, Journey 3)
```

The homepage leads with the **match quiz**, not the full grid (which grew to a long scroll and now lives at `/animals`). The quiz is **skippable** — name search and "See all dogs →" sit beside it so the high-intent Impulse Visitor never has to play. It **ranks, never filters**: completing it deep-links to `/animals?match=…` and sorts best-fit to the top with a banner; no dog is ever hidden. Quiz faces are real, currently-available dogs picked at build time — never hardcoded (logic in `web/app/composables/useAnimalHelpers.ts`).

### Homepage section intent

Each band earns its place by serving a journey. Order, top to bottom: **Top bar** (donate always visible · language toggle · Instagram) → **Hero** (transparent-cutout split: text + CTAs left, background-removed PNG animal floating right; no text on image; stacks on mobile) → **Our Story** (founding reel, self-hosted) → **Impact strip** (computed stats) → **Find Your Match** → **Animal feed peek** → **How you can help** (4-up) → **Success Stories** → **Instagram** (deep link, not embed) → **Donate** (GoFundMe embed) → **Contact** → **Footer** (logo · nav · cookieless OSM map · 3horas link-out).

---

## 4. The Animal Card

The card is the atom of the browser — get it right and the rest follows. Component: `web/app/components/AnimalCard.vue`; trait icons in `web/app/utils/traits.ts`; labels in `web/i18n/locales/`.

**Treatment (shipped):** the card leads with the face — **name + gender/age/size ride directly on the cover photo** over a bottom-up gradient scrim, legible over any photo. Tinder-for-dogs (§8). The body below carries only the quote, 2–3 trait chips, and CTA. Hover lifts the card with a coral-tinted shadow; the photo zooms slightly.

**Durable long-stay whisper:** for `available` animals at the shelter 2+ years, a quiet "⏳ Waiting 2 / 3+ years" line appears above the name — a *computed* counter (never stale), shown only on the longest-waiting cards to keep the grid uncluttered.

**Status:** `available` → no badge (the default). `reserved` → amber badge, card dimmed. `adopted` → never in the main feed; appears only in Success Stories.

**Recognisable at a glance** is the whole job (Journey 5): a visitor pattern-matching a face from a reel must confirm identity in under a second.

---

## 5. Cross-Journey Patterns

Foundational, not optional — each serves several journeys.

- **Persistent nav.** Donate is always a visible primary button, never buried in a hamburger. Language toggle always reachable — people switch mid-session.
- **Contextual, lateral fallbacks** (not a linear cascade). Commitment isn't a downward staircase. Someone who came for one dog and can't adopt wants to *bookmark that dog*, not be offered volunteering. Fallbacks preserve the **specific connection** (to an animal, to the cause): on a profile → Share this animal · Browse similar · Follow on Instagram. No page is a dead end, but the fallback is sideways, not a lesser thing.
- **Emotional content hierarchy.** On every page, order content: **Face → Name → Story → Action → Information.** Never lead with logistics. Never lead with the organisation.
- **Social sharing as infrastructure.** Every profile and success story needs proper OG tags, a WhatsApp share button (this community's default channel), Instagram-friendly cover ratios, and clean slug URLs (`/animals/luna`, not `?id=47`).

---

## 6. Channels, Embeds, and Handoffs

The website is one node in an ecosystem, not its centre. It does three things no other channel does: **Persist** (linkable, searchable, SEO-indexed profiles that outlive a scrolling feed), **Deepen** (more photo/video/story than Instagram allows), and **Route** (send qualified visitors onward with enough context that the team isn't re-answering basics).

| Channel | Does best | The site should NOT replicate |
|---|---|---|
| Instagram | Discovery, emotional trigger, daily updates | Short-form video, behind-the-scenes |
| WhatsApp | Relationships, Q&A, volunteer/foster coordination | Real-time conversation |
| GoFundMe | Payments, donation progress, donor proof | Payment infrastructure |
| 3Horas | Volunteer pipeline for expats | Volunteer matching/scheduling |
| Physical shelter | Meeting the animal, the final decision | Nothing replaces meeting in person |

**Embed decisions:** GoFundMe → **embed** the official widget (live progress, zero maintenance). Maps → **cookieless OpenStreetMap** iframe in the footer; "view larger map" links out to Google. Instagram → **deep link only, no live feed embed** (Meta's Graph API needs reauth every 60 days and is fragile); the site drives traffic *to* Instagram, not the reverse. Founding reel → **self-hosted** `our-story.mp4` (native `<video preload="none">`, downloads only on play), not an IG embed — consistent with the no-embed stance and zero Meta cookies.

**Seams that leak users — design them explicitly:**
- **Form → email:** an **auto-response is critical** ("Thanks for your interest in [Name] — we're a volunteer team, we'll reply within 48h; follow us on Instagram meanwhile"). Without it, silence reads as a broken form.
- **→ WhatsApp:** use `wa.me` links with a **pre-filled message** so the person isn't dropped into a group unsure how to introduce themselves.
- **Adopted animal from an old reel:** the profile stays live with a "Found their home" badge + "Meet animals still looking" — **never 404, never redirect to home.** They came for a specific face.

---

## 7. The Content Contract — Honesty About What Volunteers Can Maintain

The biggest risk to this site is not bad design — it's **content rot**. The design must be resilient when content is sparse, and the data model must let a beautiful profile exist with only what Sanity can enforce at creation.

**Minimum viable profile** — looks warm and complete with *only* structured fields (name, cover photo, species, gender, age, size, status, date joined; required-unless-adopted is enforced in `studio/schemaTypes/animal.ts`). Everything else — personality, history, health, fun facts, gallery, video — is **optional bonus**.

**Invisible degradation:** empty sections **don't render** — no gaps, no placeholder text. The principle: **empty is better than stale, and absent is better than placeholder.** A missing gender/size/age is *dropped* from the meta line, not defaulted to a wrong value.

**Durable counters over fragile ones** — compute from data that already exists, so they never go stale and only improve:

| Fragile (rots) | Durable (only improves) |
|---|---|
| "3 adopted this month" | "47 animals adopted since 2023" |
| "Recently added" badge | "At the shelter for 2 years" (from `dateJoined`) |
| Rotating story of the month | All adopted animals, most recent first |

**The weekly content contract** — the shelter owner's *entire* minimum obligation: change a status to `adopted` (30s), add a new animal with required fields only (2 min), upload a better photo when available (1 min). That's it. The total-adopted counter increments off the single CMS action that already has to happen. Everything rated **high-effort** (bilingual written copy) is an aspirational enhancement, never a launch requirement.

---

## 8. Competitive Analogies — What Job Are We Really Hired For?

JTBD framing (Klement, *When Coffee and Kale Compete*): people don't adopt a product, they hire it for progress in their life. Our real competition isn't other shelters — it's whatever else makes the same progress.

| Analogue | Same job | Design implication |
|---|---|---|
| **Tinder / Hinge** | Browsing faces for a connection | The feed should feel emotionally engaging, not bureaucratic. Big photos, minimal text, personality-forward. The profile is the first date — reveal character, not specs. |
| **Airbnb Experiences** | A transient person belonging somewhere | The volunteer invitation should feel like joining something alive, not a job listing. Show the mornings, the dogs on the path. |
| **Bumble BFF / Meetup** | Finding your people (expat loneliness) | Don't just sell the animals — sell the people. The community *is* the product. |
| **Patreon** | Donating as joining, not paying | After a donation, show what's happening (a recent adoption, a dog eating better) — make the donor a participant, not an ATM. |
| **Charity: Water** | Radical transparency | Show the food, the beds, the vet visit. Transparency is a visual language woven through the site, not a policy paragraph. |
| **Duolingo** | The habit of caring | A returning user should see something different from last week — a new arrival, a counter that moved. The site should feel alive, not frozen. |

---

## 9. Voice & Tone

**The website speaks like a calm, warm friend who's volunteered at the shelter for a year and is telling you about it over coffee.** Not a fundraising pitch, not a charity brochure, not an Instagram caption.

We're aligning *with* the existing Instagram voice (genuine, direct, "we", transparent, celebratory) but shifting the **register**: a website is a standing invitation, not a feed. Steadier, more composed, less urgent. It should feel like walking into a warm room, not being handed a flyer.

```
Pleading ←──────────── OUR VOICE ────────────→ Corporate
"Please help us 🙏"   warm · direct · inviting   "Submit your enquiry"
                       · quietly proud
```

Three words: **Warm** (animals are people you haven't met yet, not cases), **Direct** (short sentences, no filler — if a sentence loses three words without losing meaning, lose them), **Inviting** (every line makes the reader welcome, not pressured — "Come meet them," not "They need you").

### The non-obvious decisions

1. **Who speaks on profiles?** Third person, as if by someone who knows the animal well — not cutesy first-person ("Hi, I'm Luna!"), not clinical ("This animal is 3 years old, neutered"). *"Luna will lean against your leg the moment you sit down. She's been doing it with every volunteer since the day she arrived."* The personality section is narrative and warm; the facts row is clean and scannable. Two registers, same page — that's how you'd actually describe a dog to a friend.
2. **Talking about conditions:** honest but forward-looking. State the reality *once*, plainly, then spend all remaining energy on the solution. People adopt from hope, not guilt. *"The Mafra shelter houses around 50 animals with limited space. Our volunteers give each one outdoor time, better food, and attention."* — not *"these animals live in terrible conditions."*
3. **Emoji:** almost none on the website (warmth comes from words and photos). Exceptions: one emoji in OG descriptions (helps a chat-thread preview stand out); the adoption marker as an *icon element*, not inline text. Instagram's ❤️✨🙏🏻 register is right for Instagram, not here.
4. **Bilingual tone:** the PT voice can be slightly warmer and more informal than EN — Portuguese carries natural warmth (diminutives, softer phrasing) EN has to work harder for. Don't translate literally. The test: read each aloud — if the PT sounds like a brochure it's too formal; if the EN sounds like a translated caption it's too informal. Equivalent *meaning* beats equivalent *words*; the two versions may say slightly different things.
5. **Celebrating adoptions:** joyful but not shouty — the website version of ✨ADOPTED✨. On a card: a warm "Found their home" badge. On a profile: a sentence — *"Luna found her home in March 2025."* Not "ADOPTED! 🎉" (Instagram's register), not "Status: Adopted" (a database field).

### CTA language

Inviting and specific — never cute, never bureaucratic. Every button is a micro-moment where someone decides to act.

| Context | CTA | Why |
|---|---|---|
| Hero | **"Meet our animals"** | "Meet" implies a visit, not a contract. "Our" = known, loved individuals. |
| Animal profile | **"I'd like to adopt [Name]"** | Personal, uses the name. Softer than "Apply," more intentional than "I'm interested." |
| Foster | **"I'd like to foster"** | Parallel to adopt; clear about what you're signing up for. |
| Donate | **"Donate"** | No cleverness needed; the surrounding copy does the emotional work. |
| Volunteer | **"Join the team"** | Belonging, not a transaction ("Sign up") or a plea ("Help us"). |

Rejected, and why: *"Browse our dogs"* (animals aren't catalogue items), *"Take me home"* (first-person in a button is jarring and presumes a decision), *"Start your adoption journey"* (no one says "journey"), *"Apply now"* (implies gatekeeping; adoption here is a conversation), *"Submit enquiry"* (kills the emotional momentum).

### Words we use / avoid

| ✅ Use | ❌ Avoid | Why |
|---|---|---|
| animals, dogs, cats | pets | Not pets yet — they're looking for a home. |
| home, family | forever home | Industry cliché. "Home" is enough. |
| found their home | adopted *(as a badge)* | A story, not a status. |
| the shelter, Mafra shelter | the facility, the centre | Honest and human, not a euphemism. |
| volunteer, team member | staff | There is no staff. Everyone's a volunteer. |
| help, support | save, rescue | Overstating urgency erodes trust — reserve "rescue" for genuinely urgent cases. |
| join the team | sign up | Community, not transaction. |
| give, donate | contribute | Direct, not vague. |
| we, our, us | "Ericeira Paws" (repeatedly) | First-person plural is warmer; matches the social voice. |
| you | visitors, users, supporters | Address the reader directly. Always. |

### The don'ts

**No puns** ("paw-some," "fur-ever") — the name already has "paws," that's enough. **Don't guilt** — "they're incredible and waiting for you" (hope) beats "they're suffering and you can help" (guilt); both true, the first converts better. **Don't over-explain.** **No stock phrases** ("making a difference," "every animal deserves love"). **Don't hide behind the organisation** — "we," not "the organisation"; "you," not "potential adopters."

### Copy patterns (reusable)

- **Profile intro:** `[Name], [age]. [One specific, observed behaviour.]` — *"Benny, 4 years old. He brings his blanket to the door every time he hears footsteps."* Specific beats generic; "loves cuddles" could be any dog.
- **What happens next:** three steps, each starting with what *the user* does, each with a one-line reassurance. *"1. We'll get in touch — usually within a day or two. 2. You visit the shelter — take your time. 3. You take them home — we'll help with everything."*
- **Impact statement:** `€[amount] — [concrete thing] — [for how long / how many]` — *"€20 — a month of quality food — for one dog."*
- **Founding story:** rewrite the origin reel out of Instagram register (emoji, all-caps asks) into a few calm sentences. Keep the truth and the heart — the personal-project origin, Patrícia, the volunteer team, the warmth — drop the feed-energy. The PT version reads natively Portuguese, not a translation of the EN.

### Content structure (also helps search & AI answer engines)

Write every piece **inverted-pyramid** — most important point first, then elaboration. The data model already encodes this: `shortQuote` is one personality-first sentence, `quickFacts` is a scannable bullet list. Apply the same to the Our Story copy (lead with the emotional punch line) and any future foster/FAQ content (answer in the first sentence). This is the only high-confidence AEO move; the structural format is what's extractable, the rest is noise.
