// Loads the Umami analytics script — only when a websiteId is configured.
// Umami is cookieless and auto-tracks page views (including i18n route changes),
// so no consent banner and no manual page-view wiring are needed.
//
// To enable: set NUXT_PUBLIC_UMAMI_WEBSITE_ID (and optionally
// NUXT_PUBLIC_UMAMI_SCRIPT_URL) in the environment — in production this is done
// in the Vercel project settings. With the var unset (local dev), nothing loads.
export default defineNuxtPlugin(() => {
  const { umami } = useRuntimeConfig().public

  if (!umami?.websiteId) return

  useHead({
    script: [
      {
        src: umami.scriptUrl || 'https://cloud.umami.is/script.js',
        defer: true,
        'data-website-id': umami.websiteId,
      },
    ],
  })
})
