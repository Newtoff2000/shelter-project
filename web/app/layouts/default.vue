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
onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 60
  }, { passive: true })
})
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <!-- Top Bar -->
    <div class="bg-charcoal text-white py-2 px-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <a
          href="/#donate"
          class="text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
        >
          {{ t('nav.donate') }} →
        </a>

        <div class="flex items-center gap-4">
          <!-- Language toggle -->
          <NuxtLink
            :to="otherLocalePath"
            class="text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            {{ otherLocale }}
          </NuxtLink>

          <!-- Instagram icon -->
          <a
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Site Nav -->
    <header
      class="sticky top-0 z-50 bg-white border-b transition-shadow duration-200"
      :class="isScrolled ? 'shadow-sm' : 'border-transparent'"
    >
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="hover:opacity-90 transition-opacity">
          <SiteLogo size="md" theme="light" />
        </NuxtLink>

        <!-- Nav links -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink :to="localePath('/animals')" class="text-sm text-ink hover:text-coral transition-colors">
            {{ t('nav.meetAnimals') }}
          </NuxtLink>
          <NuxtLink to="/foster" class="text-sm text-ink hover:text-coral transition-colors">
            {{ t('nav.foster') }}
          </NuxtLink>
          <a href="https://3horas.org/paws/" target="_blank" rel="noopener noreferrer" class="text-sm text-ink hover:text-coral transition-colors">
            {{ t('nav.volunteer') }}
          </a>
          <a href="/#contact" class="text-sm text-ink hover:text-coral transition-colors">
            {{ t('nav.contact') }}
          </a>
          <a
            href="/#donate"
            class="text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
          >
            {{ t('nav.donate') }}
          </a>
        </nav>

        <!-- Mobile: just donate CTA -->
        <a
          href="/#donate"
          class="md:hidden text-sm font-semibold bg-coral hover:bg-coral-dark text-white px-4 py-1.5 rounded-full transition-colors duration-150"
        >
          {{ t('nav.donate') }}
        </a>
      </div>
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

        <!-- Google Maps embed -->
        <div class="rounded-xl overflow-hidden h-40 md:h-auto">
          <iframe
            src="https://www.google.com/maps?q=CROAMM+Canil+Municipal+Mafra+Portugal&output=embed"
            width="100%"
            height="100%"
            style="border:0; min-height: 160px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="CROAMM Mafra location"
          />
        </div>

      </div>

      <div class="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-white/10">
        <p class="text-xs text-white/40">{{ t('footer.copyright') }}</p>
      </div>
    </footer>

  </div>
</template>
