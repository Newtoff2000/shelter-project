# UX Design — Ericeira Paws Website

> User journeys, interaction patterns, and design rationale for the shelter website.
> Companion to [SHELTER.md](./SHELTER.md) (shelter research) and [SSOT.md](./SSOT.md) (architecture).

---

## Part I — Six User Journeys

Each journey is documented with: who they are, what job they're hiring the website to do, how they arrive, the step-by-step interaction, emotional arc, key screens, friction points, and success metrics.

---

### Journey 1 — "I want to give an animal a home"
**The Adopter**

| | |
|---|---|
| **Who** | Settled expat or local Portuguese family with stable housing. Age 25–50. Has space and lifestyle for a pet. May have been thinking about a pet for weeks, or may be acting on an emotional impulse from Instagram. |
| **Job to be done** | Find an animal whose personality and needs match my life, and start the adoption process with minimal friction. |
| **Emotional state** | Hopeful, slightly anxious ("will I find the right one?", "is this process complicated?"), eager to feel a connection. |
| **Primary entry** | Instagram → link in bio → homepage. Also: Google search "adopt dog Ericeira", word of mouth. |

**Interaction flow:**

```
Instagram / Search
    │
    ▼
┌─ HOMEPAGE ─────────────────────────────────────────────────┐
│  Hero: emotional photo + "Give them a second chance"       │
│  ↓ scroll                                                  │
│  Animal feed: photo grid, name + key traits visible        │
│  Filter bar: species · size · age · gender                 │
└────────────────────────────────────────────────────────────┘
    │ tap animal card
    ▼
┌─ ANIMAL PROFILE ───────────────────────────────────────────┐
│  Cover photo (large, emotional)                            │
│  Name + status badge + key facts row                       │
│  "I'm Interested" CTA (sticky on mobile)                   │
│  ↓ scroll                                                  │
│  Personality section (warm, first-person-ish copy)         │
│  Photo gallery                                             │
│  Video (if available)                                      │
│  History · Health · Fun facts                              │
│  ↓ bottom                                                  │
│  "What happens next?" — 3-step adoption explainer          │
│  Secondary CTAs: Share · Donate · Browse more animals      │
└────────────────────────────────────────────────────────────┘
    │ tap "I'm Interested"
    ▼
┌─ CONTACT MODAL / INLINE FORM ──────────────────────────────┐
│  Pre-filled: "I'm interested in adopting [Animal Name]"    │
│  Fields: Name · Email · Message (editable)                 │
│  Submit → confirmation with "what to expect" note          │
└────────────────────────────────────────────────────────────┘
```

**Emotional arc:**

```
Curiosity → Connection (seeing the animal) → Hope ("this could be mine")
→ Anxiety (form, process) → Relief (clear next steps) → Anticipation
```

**Key design decisions:**

- **Animal profile is the conversion page.** Every design dollar spent here pays off. The profile must feel like meeting a personality, not reading a database record. Lead with the photo, lead with the name, lead with warmth.
- **"What happens next?" section at the bottom of every animal profile.** Research shows adoption drop-off spikes when the user doesn't know what follows the form. Three simple steps: *1. We get in touch → 2. You visit the shelter → 3. You take them home.* This reduces anxiety and increases form completion.
- **Sticky "I'm Interested" CTA on mobile.** The user may scroll through the full profile and the button must be reachable at any point without scrolling back up. (Pattern validated by [Morweb's shelter UX research](https://morweb.org/post/7-Best-Practices-for-Designing-a-Humane-Society-Website-2026-Edition): prominent CTAs increase conversion by ~30%.)
- **Adopted animals don't vanish.** An adopted animal's profile stays live with a "Found their home" badge and a brief story. This serves Journey 6 (Community Champion) and prevents dead links from Instagram posts that featured that animal.

**Friction points to design against:**

| Friction | Mitigation |
|---|---|
| "I can't find the right animal" | Filters that feel effortless; default to showing all available animals; text search by name for impulse visitors |
| "The form feels like a commitment" | Copy that says "This is just the start of a conversation, not a contract" |
| "I don't know what happens after" | "What happens next?" explainer; confirmation email with timeline |
| "I'm renting and don't know if I can" | Brief FAQ-style note about rental permissions in Portugal on the profile page |

**Success metric:** Form submission on animal profile page (primary); time spent on animal profile > 30 seconds (engagement proxy).

---

### Journey 2 — "I can't adopt forever, but I can help for now"
**The Foster**

| | |
|---|---|
| **Who** | Digital nomad or expat in Ericeira for 2–12 months. Remote worker, surfer, someone between leases. Wants to do something meaningful but knows their stay is temporary. Age 25–40. |
| **Job to be done** | Understand what fostering means and what it requires of me, find an animal to foster, and contact the team — with the reassurance that this is manageable and supported. |
| **Emotional state** | Interested but cautious ("can I really do this?", "what if something goes wrong?", "what happens when I leave?"). Needs permission to commit temporarily. |
| **Primary entry** | 3Horas listing → site; Instagram foster story → site; volunteer WhatsApp recommendation. |

**Interaction flow:**

```
3Horas / Instagram / WhatsApp referral
    │
    ▼
┌─ HOMEPAGE ─────────────────────────────────────────────────┐
│  Hero CTA or secondary link: "Foster a dog or cat"         │
│  OR nav item: "How to Help" → Foster                       │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ FOSTERING SECTION / PAGE ─────────────────────────────────┐
│  Headline: "Even a few weeks changes everything"           │
│  What fostering means (3–4 bullet points, honest)          │
│  What you'll need (costs, space, time)                     │
│  What we provide (vet support, supplies, advice)           │
│  What happens at the end (animal returns or gets adopted)  │
│  ↓                                                         │
│  Foster success story (real photo, real name, real quote)  │
│  ↓                                                         │
│  "Ready to foster?" CTA → contact form                    │
│  "Not ready yet? You can still help" → volunteer / donate  │
└────────────────────────────────────────────────────────────┘
```

**Emotional arc:**

```
Curiosity → Hesitation ("is this too much?") → Reassurance (clear info, support)
→ Inspiration (success story) → Confidence → Action (contact)
```

**Key design decisions:**

- **Fostering gets its own content section**, not a footnote under adoption. The user who can foster is a different person in a different moment than the one who can adopt. The copy, the framing, and the CTAs are all distinct.
- **The success story is the conversion mechanism.** A foster success story (e.g., Odin's story from Instagram) with a real photo and a first-person quote does more work than any amount of explanatory copy. Feature one prominently, rotate others.
- **Honest about costs and effort.** Hiding the reality doesn't help — it creates drop-off later when the person realises what's involved. Better: be upfront, then immediately follow with "here's how we support you."
- **Soft fallback CTAs.** If the user reads the fostering info and decides it's not for them right now, don't lose them. "Not ready to foster? You can still walk dogs on Wednesdays" or "Your donation keeps fosters fed."

**Friction points to design against:**

| Friction | Mitigation |
|---|---|
| "I'm only here for 2 months" | Copy: "Even short-term fostering gives an animal a break from the shelter" |
| "What if the animal has problems?" | "We stay with you — our team is always available on WhatsApp" |
| "I don't have pet supplies" | "We can help with beds, food bowls, and basics to get started" |
| "What happens when I leave?" | "The animal returns to the shelter or transitions to another foster — you won't be stuck" |

**Success metric:** Foster enquiry form submission; click-through from foster section to animal profiles.

---

### Journey 3 — "I want to give my time, not just my money"
**The Volunteer**

| | |
|---|---|
| **Who** | Expat or local in Ericeira looking for community and purpose. Often arrived through 3Horas (a platform matching foreigners with local causes). May also be a surfer or remote worker wanting to offset screen time with something physical and real. |
| **Job to be done** | Find a volunteer role that fits my availability and skills, understand the logistics, and take the first step to join. |
| **Emotional state** | Motivated, looking for belonging. May feel slightly intimidated ("will I fit in?", "what if I show up and don't know what to do?"). Wants the barrier to entry to be low. |
| **Primary entry** | 3Horas → site; Instagram → site; friend already volunteering. |

**Interaction flow:**

> **Note (2026-06-15):** There is no on-site volunteer page. `/volunteer` 307-redirects to [3horas.org/paws](https://3horas.org/paws/), which is the single source of truth for schedule, logistics, and sign-up (see SSOT §18). The website's role is limited to routing — the Walk card in the Help-path section and all "Volunteer" nav/footer links open 3horas.org/paws directly. The journey below reflects this split.

```
3Horas / Instagram / Friend
    │
    ▼
┌─ HOMEPAGE ─────────────────────────────────────────────────┐
│  Nav / Help-path "Walk" card: "Volunteer"                  │
│  → links directly to 3horas.org/paws (new tab)            │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ 3horas.org/paws (external) ───────────────────────────────┐
│  Schedule, roles, how to join, practical logistics         │
│  Actively maintained externally — never goes stale         │
└────────────────────────────────────────────────────────────┘
```

**Emotional arc:**

```
Interest → Scanning ("what fits me?") → Recognition ("I could do that")
→ Logistics check ("when, where, how") → Confidence → First step (WhatsApp / form)
```

**Key design decisions:**

- **Show multiple volunteer paths as equal cards**, not a wall of text. Not everyone can drive to the shelter at 9am on a Monday. Social media, event coordination, and fundraising are equally valid — and the organisation actively needs them.
- **Practical logistics up front.** The three things a potential volunteer needs immediately: *where*, *when*, and *how to start*. Don't make them dig.
- **WhatsApp as the low-barrier first step.** Joining a WhatsApp group requires zero commitment and feels informal. It's how the team already operates. The website just needs to surface the link clearly.
- **Real photos of real volunteers.** This is critical. The community feel of Ericeira Paws — international, informal, genuine — is their strongest recruitment asset. A single photo of a volunteer walking a dog on a sunny morning path does more work than a paragraph of copy.

**Friction points to design against:**

| Friction | Mitigation |
|---|---|
| "I'm only here for a few weeks" | "Drop in when you can — even one session helps" |
| "I don't have a car" | Note about carpooling within the volunteer group |
| "I don't know anyone" | "Join the WhatsApp — our team will welcome you" |
| "I'm not good with animals" | Highlight non-animal roles: social media, events, fundraising |

**Success metric:** WhatsApp group join or contact form submission; click-through to volunteer section from homepage.

---

### Journey 4 — "I can't be there, but I can still help"
**The Remote Donor**

| | |
|---|---|
| **Who** | Someone outside Ericeira — a past visitor who fell in love with the area, a social media follower in another country, an animal lover who found the GoFundMe through a share. Often hasn't met the animals but is emotionally moved by the cause. |
| **Job to be done** | Make a donation quickly and feel confident it goes to something real and specific. |
| **Emotional state** | Moved but impatient. The emotional window is narrow — they're acting on a feeling triggered by a post or story. If the path to donate is unclear or slow, the moment passes. |
| **Primary entry** | Instagram story → link in bio; shared GoFundMe link; friend's WhatsApp message. |

**Interaction flow:**

```
Instagram / Shared link
    │
    ▼
┌─ HOMEPAGE ─────────────────────────────────────────────────┐
│  Top bar: [Donate] button — always visible, never scrolls  │
│  Hero section: secondary donate CTA with impact line       │
│  ("€20 feeds a dog for a month")                           │
└────────────────────────────────────────────────────────────┘
    │ tap Donate
    ▼
┌─ DONATE SECTION / GOFUNDME ────────────────────────────────┐
│  "Where your money goes" — 3–4 bullets:                    │
│    • Better food (€X/month for all animals)                │
│    • Vitamins & supplements                                │
│    • Vet visits for fosters                                │
│    • Beds and blankets                                     │
│                                                            │
│  Progress indicator (amount raised / goal)                 │
│  Number of donors                                          │
│                                                            │
│  GoFundMe button or embed → donation completes             │
│                                                            │
│  After: "Share this with someone who cares" social links   │
└────────────────────────────────────────────────────────────┘
```

**Emotional arc:**

```
Emotional trigger (post/video) → Impulse to act → Scanning ("where do I give?")
→ Trust check ("is this legit?") → Donation → Satisfaction → Share impulse
```

**Key design decisions:**

- **Donate button in the persistent top bar.** This is non-negotiable. The donor's journey can start anywhere on the site. The CTA must be reachable from every page without scrolling. (Validated by [Morweb](https://morweb.org/post/7-Best-Practices-for-Designing-a-Humane-Society-Website-2026-Edition): "Donate button should appear in your main navigation for maximum visibility.")
- **Impact-denominated giving.** Don't say "donate any amount." Say "€20 feeds a dog for a month" or "€50 covers a vet visit." Concrete impact statements convert better than abstract asks. This is Ericeira Paws' transparency promise made actionable.
- **Social proof.** Show the GoFundMe progress bar, donor count, and if possible a recent donor ("Maria donated €25 last week"). This creates momentum and reduces the "am I the only one?" hesitation.
- **Post-donation share prompt.** The moment after donating is the highest-empathy moment. Prompt sharing immediately — "Know someone who'd care about this?" with pre-filled share links.
- **Keep on-site as long as possible.** If GoFundMe must be external, open it in a new tab and keep the site open. If embeddable, embed. Every redirect loses people.

**Friction points to design against:**

| Friction | Mitigation |
|---|---|
| "I don't know if this is real" | Transparency section, real team photos, GoFundMe verification badge |
| "I don't know where the money goes" | Itemised "where your money goes" breakdown |
| "The donate button took too long to find" | Persistent top-bar placement + hero CTA |
| "I donated but can't share easily" | Pre-filled share buttons (WhatsApp, Instagram, email) |

**Success metric:** GoFundMe click-through or embed conversion; post-donation share rate.

---

### Journey 5 — "I just saw a dog on Instagram and I need to find them"
**The Impulse Visitor**

| | |
|---|---|
| **Who** | Anyone, anywhere, scrolling Instagram. Saw a reel of a specific dog being walked, playing, looking into the camera. Tapped the link in bio while still feeling the emotion. On their phone. Has maybe 60 seconds of attention. |
| **Job to be done** | Find that specific animal on the website RIGHT NOW, see more about them, and act before the feeling fades. |
| **Emotional state** | High emotion, low patience. The connection is to a specific face and name, not to the organisation. If they can't find the animal in 10 seconds, they'll close the tab. |
| **Primary entry** | Instagram reel/post → link in bio → homepage. 100% mobile. |

**Interaction flow:**

```
Instagram reel (animal name visible in caption)
    │
    ▼
┌─ HOMEPAGE (mobile) ───────────────────────────────────────┐
│  Hero: quick scan, scroll past                             │
│  ↓ immediately                                             │
│  Animal feed with search/filter bar                        │
│  🔍 Text search: type animal name → instant filter         │
│  OR: scan grid visually by cover photo                     │
└────────────────────────────────────────────────────────────┘
    │ find + tap
    ▼
┌─ ANIMAL PROFILE ───────────────────────────────────────────┐
│  (Same as Journey 1, but the user arrives with high intent)│
│  Cover photo confirms: "yes, this is the one"              │
│  Quick scan of personality                                 │
│  ↓                                                         │
│  "I'm Interested" or Share                                 │
└────────────────────────────────────────────────────────────┘
    │
    ▼
    Act: submit form / share profile / donate
```

**Emotional arc:**

```
Intense connection (Instagram) → Urgency ("I need to find them") → Scanning (feed)
→ Recognition ("there they are!") → Deepened connection (profile) → Action
```

**Key design decisions:**

- **Name-based text search in the animal feed.** At ~50 animals, visual scanning works — but the impulse visitor knows a name. A simple text filter that matches names instantly is the single highest-impact feature for this journey. Don't overthink it — a search input that filters as you type.
- **Animal cards must be recognisable at glance.** Large cover photo, name in bold, 2–3 trait chips (species, age group, size). The user is pattern-matching against a face they just saw in a reel. The card must confirm identity in under 1 second.
- **Fast page load.** This journey is the most speed-sensitive. If the animal feed takes more than 2 seconds to render on a 4G connection, the impulse visitor is gone. Client-side filtering on pre-loaded data (all ~50 animals) is the right call at this scale.
- **OG meta tags on every animal profile.** When this user shares the profile on WhatsApp or iMessage (and they will), the link preview must show the animal's photo and name. This is free virality — don't leave it on the table.
- **If the animal is adopted, don't show a dead end.** Show a warm "Found their home!" badge and suggest similar available animals. An adopted animal's Instagram reel lives forever — the link must still work.

**Friction points to design against:**

| Friction | Mitigation |
|---|---|
| "I can't find the animal I saw" | Text search by name; scannable photo grid |
| "The page is slow" | All animals pre-loaded; no pagination; lazy-load images below fold |
| "I found them but they're already adopted" | Success badge + "Meet animals still looking for a home" |
| "I want to share this with a friend" | Share button with rich link preview (OG tags) |

**Success metric:** Time from homepage landing to animal profile open (target: < 10 seconds); share rate on animal profiles.

---

### Journey 6 — "I'm part of this and I want to see the impact"
**The Community Champion**

| | |
|---|---|
| **Who** | A past adopter, foster, volunteer, or repeat donor. Has an existing emotional investment. Returns to the site periodically or when prompted by Instagram. Knows the animals by name. Feels ownership of the community. |
| **Job to be done** | See the impact — who got adopted, who's new, how the community is growing — and share progress with my network. |
| **Emotional state** | Warm, proud, invested. Looking for emotional payoff: "this matters, and I was part of it." |
| **Primary entry** | Direct bookmark; Instagram story about an adoption → site; volunteer WhatsApp link. |

**Interaction flow:**

```
Bookmark / Instagram / WhatsApp
    │
    ▼
┌─ HOMEPAGE ─────────────────────────────────────────────────┐
│  Signal of what's new:                                     │
│  "3 animals adopted this month" or new arrival highlight   │
│  ↓ scroll to...                                            │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ SUCCESS STORIES ──────────────────────────────────────────┐
│  Grid of adopted animals with "found their home" badge     │
│  Each card: photo, name, adoption date, 1-line story       │
│  Tap → full story: before/after, family photo, quote       │
│                                                            │
│  Impact counter: "X animals adopted since we started"      │
│                                                            │
│  Share buttons on every story card                         │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ SHARE / RE-ENGAGE ───────────────────────────────────────┐
│  Share a story → WhatsApp, Instagram, email                │
│  "Know someone who could adopt?" referral prompt           │
│  Donate again CTA (for repeat donors)                     │
└────────────────────────────────────────────────────────────┘
```

**Emotional arc:**

```
Curiosity ("what's new?") → Recognition ("I remember that dog!")
→ Joy ("they found a home!") → Pride ("I helped make this happen")
→ Sharing impulse → Re-engagement
```

**Key design decisions:**

- **Success Stories is not a nice-to-have; it's a core section.** This is the primary content for returning users and the primary content that gets shared organically. It's where the emotional loop closes: an animal was in the shelter → someone helped → they have a home now.
- **Impact counters.** "47 animals adopted since 2023." "3 adopted this month." These numbers create a sense of a living, active mission. They turn the website from a static brochure into evidence of ongoing impact.
- **Every story card is shareable.** Rich OG previews (photo + name + "found their home" line). One-tap share to WhatsApp (the primary communication channel in this community). Each share is a recruitment event for new adopters, donors, or volunteers.
- **"New arrivals" signal.** Returning users want to see what changed since their last visit. A "recently added" label on new animal cards in the feed gives them a reason to scroll again.

**Friction points to design against:**

| Friction | Mitigation |
|---|---|
| "Nothing looks new since last time" | New arrival badges; recent adoption counter |
| "I want to share but the link preview is ugly" | Rich OG meta on every page, especially success stories |
| "I want to help again but don't know how" | Contextual CTAs: "Donate again," "Bring a friend to volunteer" |

**Success metric:** Return visit rate; share rate on success stories; repeat donation rate.

---

## Part II — Cross-Journey Design Patterns

Patterns that serve multiple journeys and should be treated as foundational, not optional.

### 1. Persistent navigation bar

```
┌────────────────────────────────────────────┐
│  [Logo]   Animals   How to Help   [Donate] │
│                                  [PT / EN] │
└────────────────────────────────────────────┘
```

- **Donate** is always visible, always styled as a primary button, never hidden in a hamburger menu
- **Language toggle** is always accessible — many users switch mid-session
- On mobile: sticky header with hamburger for secondary items, but Donate and language toggle remain visible

### 2. Contextual next-actions (replaces linear cascade)

~~Original model: Adopt → Foster → Volunteer → Donate → Share (a linear "downward" path).~~

In practice, commitment levels aren't linear. A person who came to adopt a specific dog and can't doesn't want to volunteer — they want to bookmark that animal and come back later. A donor who finds GoFundMe slow doesn't want to "share instead" — they want a faster path to the same action. Fallbacks should preserve the **specific connection** (to an animal, to the cause), not redirect to a lesser commitment.

**Per-page contextual fallbacks:**

| Page | Primary action | Contextual fallbacks |
|---|---|---|
| Animal profile | "I'm Interested" | Share this animal · Browse similar · Follow on Instagram |
| Foster info | Contact to foster | Browse animals · Follow for future foster needs |
| Volunteer info | Join WhatsApp group | Follow on Instagram · Share with a friend in Ericeira |
| Donate section | GoFundMe | Follow on Instagram (stay connected without paying) |
| Success stories | Share a story | Browse available animals · Donate · Follow on Instagram |

No page should be a dead end — but the fallback should be **lateral** (preserve the connection) not **downward** (do a lesser thing).

### 3. Mobile-first, always

- **80%+ of traffic will arrive from Instagram on a phone.** Design for 375px first, scale up.
- Touch targets: minimum 44px
- Sticky CTAs on scroll
- Image-heavy but lazy-loaded
- Forms: minimal fields, large inputs, no dropdowns where toggles work

### 4. Emotional content hierarchy

On every page, the content order should follow this priority:

1. **Face** — a photo of an animal or a volunteer with an animal
2. **Name** — the animal's name, the person's name
3. **Story** — a single sentence of personality or context
4. **Action** — what you can do right now
5. **Information** — details, logistics, process

Never lead with logistics. Never lead with the organisation. Always lead with a face.

### 5. Social sharing as infrastructure

Every animal profile and success story needs:
- Proper OG meta tags (title, description, image)
- WhatsApp share button (primary sharing channel in this community)
- Instagram-friendly aspect ratios on cover photos
- Shareable URL structure (`/animals/odin`, not `/animals?id=47`)

---

## Part III — Competitive Analogies: "When Coffee and Kale Compete"

*What job is the Ericeira Paws website really hired to do — and what other services compete for the same job?*

The JTBD framework (Alan Klement, *When Coffee and Kale Compete*) says: people don't buy products, they hire them for a job. The job isn't literal ("find a dog") — it's the progress the person wants to make in their life. The real competition isn't other shelters. It's whatever else the user might "hire" to make the same progress.

### The jobs, honestly stated

| Surface job | Deeper job (the real competition) |
|---|---|
| "Find a dog to adopt" | "I want something that depends on me — a daily rhythm, a reason to go outside, unconditional presence" |
| "Foster an animal for a few months" | "I'm transient and rootless — I want to feel settled somewhere, even temporarily" |
| "Volunteer at the shelter" | "I want to belong to this community, not just live in it" |
| "Donate to the shelter" | "I want to feel like a good person today — concretely, not abstractly" |
| "Share this animal's story" | "I want to be someone who surfaces things that matter to my network" |

### Analogous services (same job, different category)

**1. Airbnb Experiences → Volunteering**

Airbnb Experiences lets travellers "belong anywhere" by joining locals in authentic activities. Ericeira Paws' volunteer program does the same job: it gives a transient person (digital nomad, expat, surfer passing through) a way to be embedded in the community, not just passing through it.

*Design implication:* The volunteer section should feel like an invitation to join something alive, not a job listing. Show the community. Show the mornings. Show the dogs on the path. The "experience" is the product.

**2. Bumble BFF / Meetup → Community belonging**

For many expats in Ericeira, loneliness is the real problem. They moved to a beautiful place but don't know anyone. Apps like Bumble BFF and Meetup compete for the same job: "help me find my people." Ericeira Paws' WhatsApp group and volunteer mornings are, functionally, a community — one with a purpose baked in.

*Design implication:* Don't just sell the animals. Sell the people. Show the team. Show the WhatsApp group energy. The volunteer page should feel like "here's your tribe," not "here's a task."

**3. Patreon / Buy Me a Coffee → Donating**

Patreon doesn't just take money — it makes the donor feel like an insider. Subscribers get updates, behind-the-scenes content, a sense of participation in something ongoing. GoFundMe is transactional. The Ericeira Paws website should bridge the gap: make donating feel like joining, not paying.

*Design implication:* After a donation, don't just say "thank you." Show what's happening. Show a recent adoption. Show a dog eating better food. Make the donor feel like a participant, not a ATM. Consider a "follow our journey" prompt (Instagram follow) as a post-donation CTA.

**4. Tinder / Hinge → Adoption browsing**

Multiple UX case studies (Psinder, BarkBuddy, GetPet, Furever Friends) have validated that the emotional mechanics of browsing adoptable animals are structurally identical to dating apps: you're swiping through faces, looking for a connection, feeling a pull toward one specific individual. The "I'm Interested" button is functionally a "match" button.

*Design implication:* The animal feed should feel emotionally engaging, not bureaucratic. Large photos, minimal text, personality-forward. The profile page is the "first date" — it should reveal character, not just specs. Don't lead with "2 years old, medium size, neutered." Lead with "Luna is the shelter's official greeter — she'll lean against your leg until you sit down."

**5. Charity: Water → Radical transparency**

Charity: Water built its entire brand on one principle: show exactly where every dollar goes. Photos of the well your money built. GPS coordinates. Named communities. Ericeira Paws already has this instinct ("we will be totally transparent with you, and we will share all information"). The website should make this promise visual and specific.

*Design implication:* Show the before and after. Show the food. Show the beds. If €200 was spent on vet visits this month, show a photo of the dog at the vet. Transparency isn't a policy section — it's a visual language woven through the entire site.

**6. Duolingo → The streak / habit of caring**

Duolingo's genius is turning learning into a daily habit with streaks, progress bars, and gentle nudges. For the Community Champion (Journey 6), the return visit should feel like checking in on something they're part of. Impact counters ("47 adopted"), new arrival badges, and "3 adopted this month" create a sense of ongoing progress that rewards returning.

*Design implication:* The homepage should change. Not dramatically — but a returning user should see something different from last week. A new arrival. A new adoption. A counter that moved. The site should feel alive, not frozen.

---

## Part IV — Information Architecture (derived from journeys)

```
ericeirapaws.org
├── / (Homepage)
│   ├── Hero (emotional hook + primary CTA)
│   ├── Animal Feed (filterable grid, ~50 animals)
│   ├── How to Help (foster · volunteer · donate overview)
│   ├── Success Stories (adopted animals, impact counters)
│   └── Contact (email form)
│
├── /animals/[slug] (Animal Profile)
│   ├── Cover photo + name + status
│   ├── Key facts (species, age, size, gender, time at shelter)
│   ├── Personality / Quick facts
│   ├── "I'm Interested" CTA
│   ├── Gallery + video
│   ├── History · Health · Fun facts
│   └── "What happens next?" adoption explainer
│
├── /foster (Fostering info + CTA)
│
├── /volunteer → redirects to 3horas.org/paws (volunteering is run on the external site; not hosted here — see SSOT §18)
│
└── /success-stories (Adopted animals gallery, optional dedicated page)
```

All routes support `/en/` prefix for English. Portuguese is the default unprefixed language.

---

## Part V — Service Ecology

*The website is not the centre of the user's experience. It's one node in an ecosystem. This section designs for the website's actual role, the team's real operational capacity, and what happens when things aren't ideal.*

---

### 1. Channel roles — what the website uniquely does

| Channel | What it does best | What the website should NOT try to replicate |
|---|---|---|
| **Instagram** | Discovery, emotional trigger, community vibe, visual storytelling | Short-form video, behind-the-scenes content, daily updates |
| **WhatsApp** | Relationship building, Q&A, volunteer coordination, foster support | Real-time conversation, group coordination, personal reassurance |
| **GoFundMe** | Payment processing, donation progress, social proof from donors | Payment infrastructure, donor management |
| **3Horas** | Volunteer pipeline for expats, discovery by cause-area | Volunteer matching, platform-native search |
| **Physical shelter** | Meeting animals, final adoption decision, emotional confirmation | Nothing replaces meeting the animal in person |

**The website's three unique jobs:**

1. **Persist** — animal profiles as permanent, linkable, searchable, SEO-indexed pages. Instagram posts scroll away; the website is the canonical reference. This is the only channel that lets someone Google "adopt dog Ericeira" and land on a real page.
2. **Deepen** — richer content than Instagram allows. More photos, video, personality copy, health info, the full story. The profile page is where the emotional connection started on Instagram gets reinforced with substance.
3. **Route** — qualified visitors to the right endpoint (contact form, WhatsApp, GoFundMe) with enough context that the shelter team doesn't repeat basic info. The foster page should answer the 5 questions the team gets asked every week on WhatsApp, so the WhatsApp conversation starts at "I've read the info, I'm ready" instead of "what does fostering involve?"

**Design implication:** The foster, volunteer, and donate sections should be designed as **trust-building FAQ pages that reduce the WhatsApp team's repetitive Q&A burden** — not as standalone conversion funnels. Their measure of success is not form submissions; it's how much they reduce the team's time spent answering the same questions.

---

### 2. Three design problems (reframing the six journeys)

The six journeys in Part I are valuable as empathy tools, but they overlap significantly as design problems. Journeys 1 and 5 are the same person at different emotional temperatures. Journey 2 shares the same animal browser as Journey 1. Journey 6 is "returning visitor."

For implementation, the six journeys collapse into three design problems:

**Problem A: The animal browser** (serves Adopter, Foster, Impulse Visitor)

The core product. A filterable, fast-loading grid of ~50 animals, each linking to a rich profile page. This is what the website can do that Instagram can't: let someone browse, filter, search by name, and deep-dive into a specific animal's full story.

- Key requirement: name-based text search (impulse visitors know a name from a reel)
- Key requirement: fast load on 4G mobile (all animals pre-loaded, client-side filtering)
- Key requirement: profile pages that work with just structured data (see §4 below)

**Problem B: The how-to-help router** (serves Foster, Volunteer, Donor)

Three content sections that answer common questions and route to the right endpoint. These are informational pages, not conversion funnels. Their job is to reduce friction *before* the handoff to WhatsApp or GoFundMe.

- Foster section: what it means, what it costs, what support you get, what happens at the end → WhatsApp CTA
- Volunteer: "Walk" card in Help-path routes directly to 3horas.org/paws — no on-site section (see SSOT §18); schedule, logistics, and sign-up live there
- Donate section: where money goes, impact per euro, transparency → GoFundMe embed

**Problem C: The trust and freshness layer** (serves everyone, especially returning visitors)

Elements that make the site feel alive and credible: success stories, impact counters, real photos, the "about" framing. These serve the Community Champion but also build trust for first-time visitors.

- Key constraint: must be maintainable with minimal editorial effort (see §4)
- Key constraint: must degrade gracefully when content is sparse (see §4)

---

### 3. Handoff design

The moments where the website passes a user to another channel are where real drop-off occurs. These seams need explicit design.

**Website → Contact form → Email**

- The "I'm Interested" form sends to the shelter inbox. What happens next?
- **Auto-response email** (critical): "Thanks for your interest in [Animal Name]! We're a volunteer team — we'll get back to you within 48 hours. In the meantime, follow us on Instagram to see more of [Animal Name]."
- Without this, the user submits the form and hears nothing for days. Anxiety spikes. They assume the form is broken or the shelter is inactive.

**Website → WhatsApp group**

- The volunteer and foster pages link to a WhatsApp group. The link should use the `wa.me` API with a **pre-filled message**:
  - Foster: `https://wa.me/[number]?text=Hi!%20I'm%20interested%20in%20fostering%20—%20I%20found%20you%20through%20the%20website.`
  - Volunteer: `https://wa.me/[number]?text=Hi!%20I'd%20like%20to%20start%20volunteering%20—%20I%20found%20you%20through%20the%20website.`
- Without pre-fill, the user joins the group and sits silently, unsure how to introduce themselves.

**Website → GoFundMe**

- GoFundMe is **embedded** (official widget iframe) in the Donate section — live progress bar, donor count, and payment UI on-site with zero maintenance (decision #10). The embed keeps the donation experience within the site, avoiding drop-off from a new-tab redirect.
- Consider a "Follow our journey on Instagram" prompt below the widget for post-donation re-engagement.

**Instagram → Website → Share → Instagram/WhatsApp**

- When someone shares an animal profile on WhatsApp, the OG preview must show: the animal's cover photo (cropped to 1200×630), their name, and a one-line hook (e.g., "Meet Luna — she's been waiting for a home for 2 years")
- The share URL should be the clean slug (`/animals/luna`), not a query-string URL
- WhatsApp share button should be the primary share action (this community's default channel), with a pre-filled message: "Meet [name] — [one-line from quick_facts or personality]"

**Instagram → Website (animal adopted)**

- Instagram reels live forever. A reel from 3 months ago featuring an animal that's now adopted will still drive traffic to the site.
- The profile must stay live with a "Found their home!" badge, a brief story if available, and a "Meet animals still looking for a home" CTA below
- Never 404 an adopted animal's page. Never redirect to the homepage. The person came for a specific face.

---

### 4. Content contract & graceful degradation

The biggest risk to this website is not bad design — it's content rot. The design must be honest about what the volunteer team can maintain and resilient when content is sparse.

**The minimum viable animal profile**

An animal profile must look warm and complete with *only* the structured data that Sanity can enforce at creation time:

| Field | Required? | Source |
|---|---|---|
| Name | Yes | Entered once |
| Cover photo | Yes | Uploaded from phone |
| Species | Yes | Dropdown |
| Gender | Yes | Dropdown |
| Age (years) | Yes | Number |
| Size | Yes | Dropdown |
| Status | Yes | Dropdown (default: available) |
| Date joined | Yes | Date picker |

Everything else — personality copy, history, health notes, fun facts, gallery photos, video — is optional. The profile page must **gracefully collapse** empty sections rather than showing blank areas or placeholder text.

A minimum viable profile looks like:

```
┌─────────────────────────────────────────────┐
│  [Cover photo — large, emotional]           │
│                                             │
│  Luna                                       │
│  Dog · Female · Medium · Young              │
│  At the shelter since March 2024            │
│                                             │
│  [ I'm Interested ]                         │
│                                             │
│  What happens next?                         │
│  1. We get in touch → 2. You visit → 3. Home│
└─────────────────────────────────────────────┘
```

This is not a degraded experience — it's a clean, minimal profile that leads with the photo and the name. The personality copy, gallery, and video make it *richer* when present, but their absence doesn't make the page feel broken.

**Durable counters over dynamic ones**

| Fragile (goes stale) | Durable (only improves) |
|---|---|
| "3 adopted this month" | "47 animals adopted since 2023" |
| "Recently added" badge (when was "recently"?) | "At the shelter for 2 years" (computed from `date_joined`) |
| "New this week" section | Long-stay spotlight: "Luna has been waiting the longest — 847 days" |
| Rotating success story of the month | All adopted animals shown with badge, most recent first |

Durable counters are computed from data that already exists in the CMS (status changes, date_joined). They never go stale, never require editorial action, and get *more* compelling over time.

The "total adopted" counter increments automatically when the shelter owner changes an animal's status to `adopted` — the single CMS action that already needs to happen. No separate content creation required.

**The weekly content contract**

The shelter owner's minimum weekly obligation to keep the site feeling alive:

| Action | Frequency | Time | What it triggers on the site |
|---|---|---|---|
| Update animal status to `adopted` | When it happens | 30 seconds | Success badge on profile, removal from feed, counter increment |
| Add new animal (required fields only) | When it happens | 2 minutes | New card in feed, computed "time at shelter" begins |
| Upload a better photo | When available | 1 minute | Cover photo update on card and profile |

That's it. Everything else — personality copy, gallery photos, success stories with quotes, video — is bonus content that makes the site richer but isn't required for it to function and feel alive.

**Invisible degradation for missing content**

| Content | When present | When absent |
|---|---|---|
| Personality section | Shows below key facts with warm copy | Section doesn't render — no gap, no placeholder |
| Photo gallery | Carousel below personality | Only cover photo shown (still looks complete) |
| Video | Embedded player | No video section appears |
| Health notes | Shown in dedicated section | Section doesn't render |
| Fun facts | Shown in dedicated section | Section doesn't render |
| Success stories section (homepage) | Grid of adopted animals with badges | Section doesn't render until at least 1 animal has status `adopted` |
| Foster success story (foster page) | Featured quote + photo | Omitted — the FAQ content still stands on its own |

The principle: **empty is better than stale, and absent is better than placeholder.**

---

### 5. Operational load ratings

Every design element from Parts I–IV rated by the editorial effort it requires. This makes the content cost visible and helps the team prioritise.

| Design element | Effort | Frequency | Notes |
|---|---|---|---|
| Animal card in feed | **Low** — structured data only | Per new animal | Name, photo, species, traits — all set at creation |
| Animal profile (minimum) | **Low** — structured data only | Per new animal | Same as above, renders cleanly without copy |
| Animal profile (full) | **High** — bilingual written copy | Per animal, ideally | Personality, history, health, fun facts in PT + EN |
| "I'm Interested" form | **Zero** — automated | — | Pre-fills animal name, sends to inbox |
| Foster page | **Zero** after launch | — | Evergreen FAQ content, written once |
| Volunteer page | **Zero** — external | — | Redirects to 3horas.org/paws; no on-site content to maintain (see SSOT §18) |
| Donate section | **Zero** after launch | — | GoFundMe link + impact breakdown, written once |
| Success stories | **Zero** if auto-generated | Per adoption | Triggered by status change; story text is optional bonus |
| Impact counter | **Zero** — computed | — | Count of `status === 'adopted'` animals |
| Long-stay spotlight | **Zero** — computed | — | Animal with oldest `date_joined` and `status === 'available'` |
| OG meta tags | **Zero** — templated | — | Generated from animal name + cover photo + structured data |
| Post-form auto-reply email | **Zero** after setup | — | Template configured once |
| WhatsApp pre-filled links | **Zero** after setup | — | URL configured once |

Elements rated **High** should be treated as aspirational enhancements, not launch requirements.

---

*Last updated: 2026-06-15 — Doc drift cleanup (SSOT §13.1): Journey 3 volunteer interaction flow updated to reflect /volunteer → 3horas.org/paws redirect (no on-site volunteer section); Part V §2 Problem B volunteer description updated; Website → GoFundMe handoff corrected to embed (decision #10); auto-response email template de-hardcoded Mon/Wed/Fri; operational load table volunteer row updated to zero-maintenance external. — 2026-06-14: Added Service Ecology framework (channel roles, design problems, handoffs, content contract, operational load)*
