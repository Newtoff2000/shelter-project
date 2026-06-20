# IMPROVE — Persona UX Audit & Fix Backlog

> A point-in-time usability audit (2026-06-20). Six AI personas, one per [VIBE §2](./VIBE.md) journey, drove the **real running site** on a mobile viewport and reported their user journey and emotional journey. This doc captures what they found and the prioritized fixes. It's an **actionable backlog**, not a standing doc — prune items as they land; the canonical "now" lives in [SSOT §8](./SSOT.md).

## How this was run

- **Substrate:** real Nuxt dev server against the live Sanity production dataset, driven through a real browser at mobile 375×812 — not a read of the docs. Every persona reaction is grounded in quoted on-screen text.
- **Personas:** one independent agent per journey, briefed as a hard-to-please real human with a limited patience budget (anti-sycophancy). Three read PT, three EN, so "bilingual without friction" was tested both directions.
- **Telemetry:** per-step valence (−5…+5) + emotion tag, with peak/trough (peak-end framing) and a per-journey VIBE-promise scorecard.
- **Skeptic pass:** the strongest claims were re-verified against the DOM/code before inclusion. Two impressions were **rejected as test-environment artifacts** (see Caveats) so they don't pollute the backlog.

## The six personas

| Persona | Journey · Locale | Job done? | Peak | Trough | Left feeling |
|---|---|---|---|---|---|
| Inês | Impulse · PT | ⚠️ partial | +3 finding Naga's "Encontrou o seu lar" | **−4** searching her name → cold "0 animais" | recovered, shaken |
| Marta | Adopter · PT | ✅ yes | **+5** the PT "O que acontece a seguir?" | −3 the dog's story is in English | proud, would enquire |
| Liam | Foster · EN | ✅ yes | **+5** "fostering is designed for… digital nomads… three months in Ericeira" | −2 no foster's story to reassure | seen, ready |
| David | Donor · EN | ❌ **no** | +4 "€20 — a month of quality food" | **−4** the give-moment was an empty box | frustrated, bounced |
| Sophie | Volunteer · EN | ✅ yes | **+5** "no commitment… just show up" + labelled 3horas handoff | −2 form gave no confirmation | welcomed, knows how to start |
| Caroline | Champion · EN | ⚠️ partial | **+5** seeing "Naga with Caroline & David" on the homepage | −1 "adopted **this year**" undersells the work | warm, proud |

**Emotional arcs (valence per step):**

- Inês — `[-1,-2,-2,-2,-4,3,1,-2,1]`
- Marta — `[3,1,2,4,2,-3,3,5,1,3]`
- Liam — `[3,-1,5,4,4,-2,4,4,1,3]`
- David — `[3,-3,1,4,-4,-3,-2]`
- Sophie — `[3,0,4,5,2,3,-2,3]`
- Caroline — `[3,-1,3,5,1,0,3]`

## Headline finding

The site's **emotional storytelling is strong** — every persona hit a real +4/+5 high, so the wow moments are already built and landing. It falls down at **the moment of action** (donate, submit, search for the dog you came for) and for the **Portuguese-first audience**. Five of six end positive; the only one whose job was fully blocked (David) is the only one who left negative. The work isn't to manufacture emotion — it's to stop dropping people at the doorstep of action.

## Systemic frictions (seen by ≥2 personas)

1. **Bilingual leak on the PT site** *(Inês + Marta; PT is the primary audience).* The persuasive core — personality, quick facts, history, health, short quotes — renders in English on PT pages (e.g. Caju: *"Absolutely loves humans and thrives on affection…"*), plus the page `<title>` ("Meet the animals") and success-card aria-labels ("read their story on Instagram"). Two layers: a **content gap** (empty `shortQuote.pt`, EN-only Sanity fields — already a known launch blocker) and a few **untranslated code strings** (meta title, card labels).
2. **The act-on-it seams leak** *(David, Sophie, Inês).* Everyone who tried to *do* the thing hit a wall: David's Donate button is a no-op on deep pages (verified); Sophie's volunteer form gave no confirmation after submit; Inês's search for an adopted dog dead-ended at "0 animais" with no warm redirect.
3. **Stories & sharing live only off-site** *(Inês + Caroline).* Adopted dogs' warm "Found their home" state exists only as a homepage card linking *out* to Instagram — no on-site story to relive, no per-story Share button (`/stories`, `/success` both 404).
4. **"Dead first tap"** *(Inês's search 🔍, Liam's "Learn about fostering →").* Two personas had a link/button not navigate on first click. Possibly a hydration/interaction quirk — **verify on a real device** before treating as confirmed.
5. **Fragile impact framing** *(Caroline's label, Inês saw it too).* "Adopted **this year**" resets every January; VIBE wants durable "since 2023." Confirmed in code: only the adopted counter is computed; animals/walks/volunteers are hardcoded.

## Verified bugs (independently confirmed against DOM/code)

- **Donate link is locale-broken and dead on deep pages.** Hardcoded `href="/#donate"` in `web/app/layouts/default.vue` (≈lines 128, 138, 225) resolves to `/#donate`: it drops the `/en` locale (dumps EN users to the PT homepage) and there is **no `#donate` target on non-homepage routes**, so clicking does nothing. This alone blocks the entire donor journey from any animal page.
- **Adopted profile self-contradicts.** On `/animals/naga` the `Adotado` badge coexists with "Tenho interesse em Naga", "Levas para casa", the "What happens next" steps, *and* a raw backstage English note ("…consent confirmed 2026-06-14"). An adopted dog should show a warm closed state, not an adoption funnel.

## VIBE-promise scorecard (rollup)

| Promise | Verdict | Note |
|---|---|---|
| Recognisable card in <1s | ✅ pass | "Morsa ♀ · 4anos · Médio" — instant |
| Profile = conversion page (face→story→action) | 🟡 partial | structure right; story in EN on PT |
| Sticky mobile adopt CTA + "What happens next?" | ✅ pass | verified sticky; PT 3-step delighted Marta |
| Foster has its own space | ✅ pass | dedicated `/foster`, co-equal card |
| Foster success story | ❌ fail | absent — Liam's biggest gap |
| Donate reachable from anywhere | ❌ fail | in sticky bar, but link broken on deep pages |
| Impact-denominated ask | ✅ pass | "€20 — a month of quality food" |
| Social proof of giving | ❌ fail | no progress/donor count on-site |
| Post-donate share prompt | ❌ fail | none (ends at external GoFundMe) |
| Volunteer routing + 3horas handoff | ✅ pass | dual-lane, labelled, opens new tab |
| Adopted → warm "found home", never dead-end | ❌ fail | profile self-contradicts; search dead-ends |
| Success stories load-bearing | ✅ pass | prominent "Happy Endings" wall |
| Durable counters | ❌ fail | "this year"; 3/4 hardcoded |
| Bilingual without friction | ❌ fail | EN content on PT throughout |

## Prioritized fixes (impact × effort)

**Quick wins — high impact, low effort**
1. **Fix the Donate link** → locale-aware route to the donate section (and/or a real cross-page `/donate` target). *Unblocks the whole donor journey.*
2. **Adopted-status handling** → when `status=adopted`, swap "I'm interested / take them home" for the warm "Found their home + meet others still looking," and make name-search surface the success state instead of "0 animais."
3. **Pre-fill the contact form** message from `?animal=` (Marta lost "Caju" in the handoff).
4. **Translate remaining code-level i18n strings** (page titles, card aria-labels) + change "adopted this year" → cumulative "since 2023."

**High impact, medium effort**
5. **Enter PT translations** for animal content (the known launch blocker — primary-audience critical).
6. **Form confirmation/feedback** on all three Resend forms (contact, foster, volunteer); verify with a real API key.
7. **Add a foster success story** (photo + first-person quote).

**Medium**
8. **On-site success-story destination + per-card Share button** (don't rely only on IG deep-links).
9. **Investigate the "dead first tap"** on real hardware; point the homepage "Walk →" card at on-site `/volunteer` for consistency.

## Caveats (NOT counted against the site)

- **Homepage count-up stats read 0** in the audit because the scroll-triggered animation (`web/app/components/CountUp.vue`, IntersectionObserver) doesn't fire in the automated browser. A real phone user sees the real numbers. *(The separate, real concern — 3/4 counters hardcoded — stands on code evidence, item 4 above.)*
- **GoFundMe widget didn't load** (external embed in a headless browser), so actual donation *completion* couldn't be verified. The broken Donate **link** is real and independent of this.
- **Form "no confirmation"** was observed without a `RESEND_API_KEY` in the test env, so the submit likely errored server-side; the absence of any client-side acknowledgment is still worth fixing (item 6), but the severity needs a real-key retest.

## Also surfaced — doc drift

`/volunteer` is now a **real CMS-managed page** (PR #57), but [SSOT §10](./SSOT.md) and [VIBE Journey 3](./VIBE.md) still describe the old 307-redirect-to-3horas behaviour. Reconcile those two docs.
