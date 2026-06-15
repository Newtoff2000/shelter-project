import tailwindcss from '@tailwindcss/vite'

// Fetch every animal slug at config-load time so the prerenderer emits a static
// page (with OG tags + JSON-LD) for ALL animals — including adopted ones, which
// are filtered out of the on-site feeds (so crawl discovery misses them) yet are
// shared directly from the Instagram success-story series. Done at the top level
// (not a build hook — nuxt.config hooks proved unreliable here) so the routes are
// baked into the static prerender list. Self-contained fetch (Node global).
async function fetchAnimalPrerenderRoutes(): Promise<string[]> {
  const projectId = process.env.SANITY_PROJECT_ID || 'j0v2zcj0'
  const dataset = process.env.SANITY_DATASET || 'production'
  const query = '*[_type == "animal" && defined(slug.current)].slug.current'
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url)
    const json = (await res.json()) as { result?: string[] }
    return (json.result ?? []).flatMap(slug => [`/animals/${slug}`, `/en/animals/${slug}`])
  } catch (err) {
    console.warn('[prerender] could not fetch animal slugs for OG prerender:', err)
    return []
  }
}

const animalPrerenderRoutes = await fetchAnimalPrerenderRoutes()
console.log(`[prerender] inlining ${animalPrerenderRoutes.length} animal routes`)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  modules: ['@nuxtjs/sanity', '@nuxtjs/i18n', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#1e1e1e' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo-mark.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;700&family=Nunito:ital,wght@0,800;0,900;1,800;1,900&display=swap',
        },
      ],
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://shelter-project.vercel.app',
  },

  runtimeConfig: {
    public: {
      // Absolute origin for canonical/OG/hreflang URLs. Override via
      // NUXT_PUBLIC_SITE_URL once a custom domain is connected (Open Decision #2).
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://shelter-project.vercel.app',
    },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/animals', '/en/animals', ...animalPrerenderRoutes],
    },
  },

  // Volunteering/dog-walking is run via the actively maintained external site
  // (3horas.org/paws). We don't host a /volunteer page — keep the old paths as
  // redirects so any existing links land on the canonical, low-maintenance source.
  routeRules: {
    '/volunteer': { redirect: 'https://3horas.org/paws/' },
    '/en/volunteer': { redirect: 'https://3horas.org/paws/' },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },

  i18n: {
    locales: [
      { code: 'pt', language: 'pt-PT', name: 'Português', file: 'pt.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'pt',
    strategy: 'prefix_except_default',
    // Absolute base for useLocaleHead() canonical + hreflang alternates.
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://shelter-project.vercel.app',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
})
