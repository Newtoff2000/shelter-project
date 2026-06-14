<script setup lang="ts">
// Lazy-loaded GoFundMe embed. The widget's script can set third-party cookies,
// so we don't load it on page load — only after the visitor explicitly clicks.
// That click is the visitor's own opt-in, which keeps the site banner-free.
const { t } = useI18n()
const { track } = useAnalytics()

const GOFUNDME_URL =
  'https://www.gofundme.com/f/ericeira--paws/widget/medium?attribution_id=sl%3Acaf1fa6d-3591-4792-8ffb-7012053b80db'
const EMBED_SCRIPT = 'https://www.gofundme.com/static/js/embed.js'

const loaded = ref(false)

async function load() {
  track('donate_click', { source: 'donate_section' })
  loaded.value = true
  // The embed script scans the DOM for `.gfm-embed` elements on load and swaps
  // them for an iframe — so the placeholder div must exist before we inject it.
  await nextTick()
  if (!document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) {
    const script = document.createElement('script')
    script.src = EMBED_SCRIPT
    script.defer = true
    document.body.appendChild(script)
  }
}
</script>

<template>
  <ClientOnly>
    <!-- Pre-click: branded panel, no third-party request made yet -->
    <div
      v-if="!loaded"
      class="flex flex-col items-start gap-3 rounded-2xl bg-[--color-coral-light] p-8"
    >
      <button
        type="button"
        class="inline-block bg-[--color-coral] hover:bg-[--color-coral-dark] text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
        @click="load"
      >
        {{ t('donateSection.loadWidget') }} →
      </button>
      <p class="text-xs text-[--color-muted]">{{ t('donateSection.widgetNote') }}</p>
    </div>

    <!-- Post-click: the GoFundMe embed script replaces this div with an iframe -->
    <div v-else class="gfm-embed" :data-url="GOFUNDME_URL" />
  </ClientOnly>
</template>
