<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogClose } from 'reka-ui'

const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const { data: siteSettings } = await useSiteSettings()
const instagramUrl = computed(() => siteSettings.value?.instagramUrl ?? 'https://www.instagram.com/ericeira.paws/')

const { public: { siteUrl, gofundmeUrl } } = useRuntimeConfig()

const localeHead = useLocaleHead()
useHead(() => localeHead.value)

useHead({
  script: [{
    key: 'org-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AnimalShelter',
      name: 'Ericeira Paws',
      url: siteUrl,
      logo: `${siteUrl}/logo-mark.svg`,
      sameAs: [instagramUrl.value],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ericeira',
        addressRegion: 'Mafra',
        addressCountry: 'PT',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 38.9633,
        longitude: -9.4175,
      },
    }),
  }],
})

const otherLocale = computed(() => locale.value === 'pt' ? 'EN' : 'PT')
const otherLocalePath = computed(() => switchLocalePath(locale.value === 'pt' ? 'en' : 'pt'))

// Remember a manual language choice so the pre-hydration redirect on `/`
// (nuxt.config app.head) honours it instead of re-sniffing the browser.
const rememberLocale = (code: 'pt' | 'en') => {
  document.cookie = `i18n_redirected=${code}; path=/; max-age=31536000; samesite=lax`
}

// Sticky nav
const route = useRoute()
const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 60 }
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Pages with a dark hero behind the nav opt in via definePageMeta({ heroNav: true }).
// Those blend flat at the top; everything else (light pages) lifts with a shadow
// immediately. Over a dark hero the soft shadow is invisible anyway, so it self-hides.
const liftNav = computed(() => route.meta.heroNav !== true || isScrolled.value)

// Mobile nav drawer. Reka's Dialog owns the hard parts now — focus trap,
// return-focus-to-trigger, Esc, body scroll-lock, click-outside-to-close — so
// the only state we keep is the open flag (shared with the hamburger icon swap).
const mobileMenuOpen = ref(false)
const closeMobileMenu = () => { mobileMenuOpen.value = false }
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <!-- Single merged nav — charcoal, blends into the hero; floats over light
         sections once scrolled (hairline appears) -->
    <header
      class="sticky top-0 z-50 bg-charcoal text-white transition-shadow duration-200"
      :class="liftNav ? 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.25)]' : ''"
    >
      <!-- DialogRoot is renderless; give it a single child element so SSR doesn't
           emit a multi-root fragment (Nuxt hydration mismatches on the anchors). -->
      <DialogRoot v-model:open="mobileMenuOpen">
      <div>
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="hover:opacity-90 transition-opacity" @click="closeMobileMenu">
          <SiteLogo size="md" theme="dark" />
        </NuxtLink>

        <!-- Desktop: nav links + utilities + Donate -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink :to="localePath('/animals')" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.meetAnimals') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/foster')" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.foster') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/volunteer')" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.volunteer') }}
          </NuxtLink>
          <a :href="localePath('/') + '#contact'" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.contact') }}
          </a>

          <!-- Divider between primary nav and utilities -->
          <span class="w-px h-5 bg-white/15" aria-hidden="true"></span>

          <!-- Language toggle (muted utility) -->
          <NuxtLink
            :to="otherLocalePath"
            :aria-label="t('nav.switchLanguage')"
            class="text-xs font-semibold uppercase tracking-widest text-white/55 hover:text-white transition-colors"
            @click="rememberLocale(locale === 'pt' ? 'en' : 'pt')"
          >
            {{ otherLocale }}
          </NuxtLink>

          <!-- Instagram icon (muted utility) -->
          <a
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="text-white/55 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>

          <!-- Donate — the one filled accent. Links straight to the live
               GoFundMe campaign (no on-site donate section to maintain). -->
          <a
            :href="gofundmeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
          >
            {{ t('nav.donate') }}
          </a>
        </nav>

        <!-- Mobile: Donate + hamburger -->
        <div class="md:hidden flex items-center gap-3">
          <a
            :href="gofundmeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
            @click="closeMobileMenu"
          >
            {{ t('nav.donate') }}
          </a>
          <!-- Reka wires aria-expanded / aria-controls / aria-haspopup and toggles
               open; we keep only the dynamic label and the icon swap. -->
          <DialogTrigger
            class="p-1.5 -mr-1.5 text-white/80 hover:text-white transition-colors"
            :aria-label="mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-6 h-6">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-6 h-6">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </DialogTrigger>
        </div>
      </div>

      <!-- Mobile drawer. In-flow (no portal) so it stays attached under the bar,
           exactly as before. Reka keeps it mounted through the close animation,
           so the slide/fade lives in CSS keyframes (data-state driven). -->
        <DialogContent
          id="mobile-menu"
          as="nav"
          :aria-describedby="undefined"
          class="md:hidden border-t border-white/10 px-4 pb-6 pt-2 flex flex-col origin-top focus:outline-none data-[state=open]:animate-drawer-in"
        >
          <DialogTitle class="sr-only">{{ t('nav.openMenu') }}</DialogTitle>
          <NuxtLink :to="localePath('/animals')" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.meetAnimals') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/foster')" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.foster') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/volunteer')" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.volunteer') }}
          </NuxtLink>
          <a :href="localePath('/') + '#contact'" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.contact') }}
          </a>
          <div class="flex items-center gap-5 pt-4">
            <NuxtLink
              :to="otherLocalePath"
              :aria-label="t('nav.switchLanguage')"
              class="text-xs font-semibold uppercase tracking-widest text-white/55 hover:text-white transition-colors"
              @click="rememberLocale(locale === 'pt' ? 'en' : 'pt'); closeMobileMenu()"
            >
              {{ otherLocale }}
            </NuxtLink>
            <a
              :href="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="text-white/55 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </DialogContent>
      </div>
      </DialogRoot>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-charcoal text-white pt-12 pb-8">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">

        <!-- Brand + nav -->
        <div class="flex flex-col gap-4">
          <NuxtLink :to="localePath('/')" class="inline-flex hover:opacity-90 transition-opacity">
            <SiteLogo size="lg" theme="dark" />
          </NuxtLink>
          <nav class="flex flex-col gap-2">
            <NuxtLink :to="localePath('/animals')" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.meetAnimals') }}</NuxtLink>
            <NuxtLink :to="localePath('/foster')" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.foster') }}</NuxtLink>
            <NuxtLink :to="localePath('/volunteer')" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.volunteer') }}</NuxtLink>
            <a :href="gofundmeUrl" target="_blank" rel="noopener noreferrer" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.donate') }}</a>
            <a :href="localePath('/') + '#contact'" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.contact') }}</a>
          </nav>
          <div class="flex flex-col gap-3 mt-2">
            <p class="text-xs font-semibold uppercase tracking-widest text-coral">{{ t('eyebrow.instagram') }}</p>
            <p class="font-display text-xl text-white">{{ t('instagram.title') }}</p>
            <p class="text-sm text-white/60 leading-relaxed">{{ t('instagram.subtitle') }}</p>
            <a
              :href="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex self-start items-center gap-2 bg-coral hover:bg-coral-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-150"
            >
              {{ t('instagram.cta') }} →
            </a>
          </div>
        </div>

        <!-- OpenStreetMap embed — cookieless (SSOT §13 decision 11) -->
        <div class="flex flex-col gap-2">
          <div class="rounded-xl overflow-hidden h-40 md:flex-1 md:min-h-40">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-9.343%2C38.927%2C-9.319%2C38.945&layer=mapnik&marker=38.936%2C-9.331"
              width="100%"
              height="100%"
              style="border:0; min-height: 160px;"
              allowfullscreen=""
              loading="lazy"
              title="CROAMM Mafra location"
            />
          </div>
          <a
            href="https://www.openstreetmap.org/?mlat=38.936&mlon=-9.331#map=15/38.936/-9.331"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-white/40 hover:text-white/70 transition-colors self-start"
          >
            {{ t('footer.viewLargerMap', 'View larger map →') }}
          </a>
        </div>

      </div>

      <div class="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-white/10">
        <p class="text-xs text-white/40">{{ t('footer.copyright') }}</p>
      </div>
    </footer>

  </div>
</template>
