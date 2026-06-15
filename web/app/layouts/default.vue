<script setup lang="ts">
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const { data: siteSettings } = await useFetch('/api/site-settings')
const instagramUrl = computed(() => siteSettings.value?.instagramUrl ?? 'https://www.instagram.com/ericeira.paws/')

const { public: { siteUrl } } = useRuntimeConfig()

const localeHead = useLocaleHead({ addSeoAttributes: true })
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

// Sticky nav
const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 60 }
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Mobile nav drawer
const mobileMenuOpen = ref(false)
const closeMobileMenu = () => { mobileMenuOpen.value = false }
// Lock body scroll while the drawer is open
watch(mobileMenuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
// Close on locale change / route change is handled by closeMobileMenu on each link
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <!-- Single merged nav — charcoal, blends into the hero; floats over light
         sections once scrolled (hairline appears) -->
    <header
      class="sticky top-0 z-50 bg-charcoal text-white transition-colors duration-200"
      :class="isScrolled ? 'border-b border-white/10' : 'border-b border-transparent'"
    >
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="hover:opacity-90 transition-opacity" @click="closeMobileMenu">
          <SiteLogo size="md" theme="dark" />
        </NuxtLink>

        <!-- Desktop: nav links + utilities + Donate -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink :to="localePath('/animals')" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.meetAnimals') }}
          </NuxtLink>
          <NuxtLink to="/foster" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.foster') }}
          </NuxtLink>
          <a href="https://3horas.org/paws/" target="_blank" rel="noopener noreferrer" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.volunteer') }}
          </a>
          <a href="/#contact" class="text-sm text-white/85 hover:text-white transition-colors">
            {{ t('nav.contact') }}
          </a>

          <!-- Divider between primary nav and utilities -->
          <span class="w-px h-5 bg-white/15" aria-hidden="true"></span>

          <!-- Language toggle (muted utility) -->
          <NuxtLink
            :to="otherLocalePath"
            class="text-xs font-semibold uppercase tracking-widest text-white/55 hover:text-white transition-colors"
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

          <!-- Donate — the one filled accent -->
          <a
            href="/#donate"
            class="text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
          >
            {{ t('nav.donate') }}
          </a>
        </nav>

        <!-- Mobile: Donate + hamburger -->
        <div class="md:hidden flex items-center gap-3">
          <a
            href="/#donate"
            class="text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
            @click="closeMobileMenu"
          >
            {{ t('nav.donate') }}
          </a>
          <button
            type="button"
            class="p-1.5 -mr-1.5 text-white/80 hover:text-white transition-colors"
            :aria-label="mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-6 h-6">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-6 h-6">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav
          v-if="mobileMenuOpen"
          id="mobile-menu"
          class="md:hidden border-t border-white/10 px-4 pb-6 pt-2 flex flex-col"
        >
          <NuxtLink :to="localePath('/animals')" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.meetAnimals') }}
          </NuxtLink>
          <NuxtLink to="/foster" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.foster') }}
          </NuxtLink>
          <a href="https://3horas.org/paws/" target="_blank" rel="noopener noreferrer" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.volunteer') }}
          </a>
          <a href="/#contact" class="py-3 text-base text-white/85 hover:text-white transition-colors border-b border-white/5" @click="closeMobileMenu">
            {{ t('nav.contact') }}
          </a>
          <div class="flex items-center gap-5 pt-4">
            <NuxtLink
              :to="otherLocalePath"
              class="text-xs font-semibold uppercase tracking-widest text-white/55 hover:text-white transition-colors"
              @click="closeMobileMenu"
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
        </nav>
      </Transition>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-charcoal text-white pt-12 pb-8">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Brand + nav -->
        <div class="flex flex-col gap-4">
          <NuxtLink to="/" class="inline-flex hover:opacity-90 transition-opacity">
            <SiteLogo size="lg" theme="dark" />
          </NuxtLink>
          <nav class="flex flex-col gap-2">
            <NuxtLink :to="localePath('/animals')" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.meetAnimals') }}</NuxtLink>
            <NuxtLink to="/foster" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.foster') }}</NuxtLink>
            <a href="https://3horas.org/paws/" target="_blank" rel="noopener noreferrer" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.volunteer') }}</a>
            <a href="/#donate" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.donate') }}</a>
            <a href="/#contact" class="text-sm text-white/60 hover:text-white transition-colors">{{ t('nav.contact') }}</a>
          </nav>
          <a
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-coral hover:text-coral-light transition-colors font-medium"
          >
            @ericeira.paws
          </a>
        </div>

        <!-- Location + volunteering -->
        <div class="flex flex-col gap-3">
          <p class="text-sm text-white/60">{{ t('footer.location') }}</p>
          <a href="https://3horas.org/paws/" target="_blank" rel="noopener noreferrer" class="text-sm text-coral hover:text-coral-light transition-colors font-medium">
            {{ t('footer.volunteerLink') }}
          </a>
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
