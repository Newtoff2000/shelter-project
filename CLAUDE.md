# Ericeira Paws — Shelter Website

A warm, bilingual (PT-PT / EN) website for a volunteer-run dog & cat shelter in Mafra/Ericeira, Portugal. Nuxt (SSG) + Sanity CMS + Vercel.

**Start every session with `/read`** to load project context.

## Where things live

Three docs, by the kind of knowledge they hold. Keep each in its lane — that's what stops the docs from bloating and drifting.

- **[SSOT.md](./SSOT.md) — the *why* and the *now*.** What we're building, project context, architecture, resolved decisions, and **standing to-dos / current status**. Start here.
- **[VIBE.md](./VIBE.md) — the *craft*.** Design principles, the six user journeys, information architecture, the content contract, and voice/tone. How the site looks, flows, and speaks.
- **Code — the *what*.** Anything a developer can read off the repo is canonical *in the repo*, not in prose. The docs point here; they don't copy values (copies drift).

| Looking for… | It's in code at |
|---|---|
| Colors, design tokens, ambient effects | `web/app/assets/css/main.css` (`@theme`) |
| Fonts (DM Serif Display / Inter / Nunito) | `web/nuxt.config.ts` + `main.css` |
| Animal & siteSettings schema (the field list) | `studio/schemaTypes/animal.ts`, `siteSettings.ts` |
| Personality trait → icon mapping | `web/app/utils/traits.ts` |
| Component inventory | `web/app/components/` |
| Filter / match-quiz / derived-field logic | `web/app/composables/useAnimalHelpers.ts` |
| UI strings (PT + EN) | `web/i18n/locales/` |
| Routing, `/volunteer` redirect, i18n strategy | `web/nuxt.config.ts` |
| SEO: JSON-LD, hreflang, sitemap, OG meta | `web/app/layouts/default.vue`, `web/server/api/__sitemap__/` |
| Content backfill / seed scripts | `studio/scripts/` |

## Doc conventions

- **Why → docs, what → code, now → SSOT.** Before writing a fact into a doc, ask whether the repo already holds it. If so, link to the file instead of restating the value.
- **No changelog in the docs.** History is git's job. SSOT's status section is forward-looking — prune done items, don't log them.
- Keep it to these three docs. New standing concerns become a *section*, not a new file.
