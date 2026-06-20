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

  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // nuxt:module-preload-polyfill and @tailwindcss/vite don't emit sourcemaps
          // for their transforms — cosmetic warning, build output is correct.
          if (warning.message.includes('Sourcemap is likely to be incorrect')) return
          warn(warning)
        },
      },
    },
  },

  app: {
    head: {
      // Pre-hydration locale redirect. Runs before the Nuxt bundle, so EN
      // visitors are sent from the PT root `/` to `/en` *before* anything
      // hydrates — the PT page never renders as EN, so there's no mismatch
      // (i18n's own detection, which flips locale mid-hydration, is disabled
      // below). Only acts on `/`; respects a remembered choice via the
      // i18n_redirected cookie (set by the language toggle); otherwise sniffs
      // navigator.languages.
      script: [
        {
          innerHTML:
            "(function(){try{if(location.pathname!=='/')return;" +
            "var m=document.cookie.match(/(?:^|;\\s*)i18n_redirected=([^;]+)/),p=m?m[1]:'';" +
            "if(p==='pt')return;" +
            "if(p!=='en'){var L=navigator.languages||[navigator.language||''];" +
            "if(L.some(function(l){return /^pt\\b/i.test(l)}))return;}" +
            "location.replace('/en'+location.search+location.hash);}catch(e){}})();",
        },
      ],
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
      // Live donation campaign. Every "Doar"/"Donate" CTA links straight here so
      // the amounts, totals, and ask live on GoFundMe (evergreen) — not baked
      // into the site, where they'd quietly go stale.
      gofundmeUrl: 'https://www.gofundme.com/f/ericeira--paws',
    },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/animals', '/en/animals', '/volunteer', '/en/volunteer', ...animalPrerenderRoutes],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        // Locks down only features the site never uses; leaves autoplay/
        // encrypted-media/etc. untouched so the YouTube iframe `allow` works.
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
        // Pragmatic CSP: restrict source origins but allow 'unsafe-inline'
        // (SSG can't use per-request nonces; we ship inline JSON-LD + styles).
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://www.gofundme.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: https:",
          "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.openstreetmap.org https://www.gofundme.com",
          "connect-src 'self' https:",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
          'upgrade-insecure-requests',
        ].join('; '),
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
    // Browser-language detection is handled by a pre-hydration <head> script
    // (see app.head above), NOT by i18n. On a statically-prerendered, unprefixed
    // default locale, i18n's client-side detection switches `/` to EN *during*
    // hydration — server PT vs client EN, a full-page mismatch that no i18n
    // option avoids (the locale flips before any redirect fires). Disabling it
    // keeps locale resolution deterministic: `/` is always PT, `/en` always EN.
    detectBrowserLanguage: false,
  },
})
