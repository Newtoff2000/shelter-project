<script setup lang="ts">
definePageMeta({ layout: 'default' })

useHead({
  script: [{ src: 'https://www.gofundme.com/static/js/embed.js', defer: true, tagPosition: 'bodyClose' }],
})

const { locale, t, tm, rt } = useI18n()
const localePath = useLocalePath()

const { data: animals } = await useFetch<any[]>('/api/animals')
const { data: settings } = await useFetch<any>('/api/site-settings')

const lang = computed(() => locale.value === 'pt' ? 'pt' : 'en')

// --- SEO: homepage share preview + site-wide AnimalShelter org JSON-LD ---
const seoRoute = useRoute()
const siteUrl = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')
const ogDefault = `${siteUrl}/og-default.png`
const homeTitle = computed(() => `${t('meta.ogSiteName')} — ${heroHeadline.value}`)

useSeoMeta({
  title: () => homeTitle.value,
  description: () => t('hero.subtitle'),
  ogTitle: () => homeTitle.value,
  ogDescription: () => t('hero.subtitle'),
  ogType: 'website',
  ogUrl: () => siteUrl + seoRoute.path,
  ogSiteName: () => t('meta.ogSiteName'),
  ogLocale: () => (lang.value === 'pt' ? 'pt_PT' : 'en_US'),
  ogLocaleAlternate: () => (lang.value === 'pt' ? 'en_US' : 'pt_PT'),
  ogImage: ogDefault,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: () => homeTitle.value,
  twitterDescription: () => t('hero.subtitle'),
  twitterImage: ogDefault,
})

// Canonical + hreflang for the homepage. Hand-rolled because i18n v9's
// useLocaleHead does not emit these by default (verified empty in generated HTML).
useHead(() => ({
  htmlAttrs: { lang: lang.value === 'pt' ? 'pt-PT' : 'en-US' },
  link: [
    { rel: 'canonical', href: siteUrl + seoRoute.path },
    { rel: 'alternate', hreflang: 'pt-PT', href: `${siteUrl}/` },
    { rel: 'alternate', hreflang: 'en-US', href: `${siteUrl}/en` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` },
  ],
}))

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: jsonLdScript({
      '@context': 'https://schema.org',
      '@type': 'AnimalShelter',
      name: 'Ericeira Paws',
      url: siteUrl,
      logo: `${siteUrl}/apple-touch-icon.png`,
      image: ogDefault,
      sameAs: ['https://www.instagram.com/ericeira.paws/'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mafra',
        addressRegion: 'Lisboa',
        addressCountry: 'PT',
      },
      areaServed: 'Ericeira, Mafra, Lisboa, Portugal',
    }),
  }],
})

const heroHeadline = computed(() =>
  settings.value?.heroHeadline?.[lang.value] ?? t('hero.headlineFallback')
)
const heroPhotoUrl = computed(() => settings.value?.heroPhotoUrl)
const rotatingWords = computed(() =>
  (tm('hero.rotatingWords') as unknown[]).map(w => rt(w as string))
)
const instagramUrl = computed(() => settings.value?.instagramUrl ?? 'https://www.instagram.com/ericeira.paws/')

// Homepage SEO + social share metadata
useHead(computed(() => ({
  title: 'Ericeira Paws — Abrigo Animal em Mafra/Ericeira',
  meta: [
    { name: 'description', content: t('hero.subtitle') },
    { property: 'og:title', content: 'Ericeira Paws' },
    { property: 'og:description', content: t('hero.subtitle') },
    { property: 'og:image', content: heroPhotoUrl.value ? imgUrl(heroPhotoUrl.value, 1200, 85) : '' },
    { property: 'og:type', content: 'website' },
  ],
})))

const allAnimals = computed(() => Array.isArray(animals.value) ? animals.value : [])

const availableAnimals = computed(() =>
  allAnimals.value.filter(a => a.status !== 'adopted')
)

const adoptedAnimals = computed(() =>
  allAnimals.value.filter(a => a.status === 'adopted')
)

// Small "peek" on the homepage — full browsable grid lives on /animals.
// availableAnimals is already ordered `featured desc, dateJoined asc` by the API.
const featuredPeek = computed(() => availableAnimals.value.slice(0, 4))

// Quick name search → routes into the full /animals browse page.
const quickSearch = ref('')
function goSearch() {
  const q = quickSearch.value.trim()
  navigateTo(localePath('/animals') + (q ? `?name=${encodeURIComponent(q)}` : ''))
}

// --- Contact form ---
const contactRoute = useRoute()
const form = reactive({
  name: '',
  email: '',
  message: '',
  animalName: (contactRoute.query.animal as string) ?? '',
  website: '', // honeypot
})
const formState = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submitContact() {
  if (form.website) return // honeypot triggered
  formState.value = 'sending'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        animalName: form.animalName,
        website: form.website,
      },
    })
    formState.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
    form.animalName = ''
  } catch {
    formState.value = 'error'
  }
}
</script>

<template>
  <!-- ═══════════════════════════════════════════════
       HERO
  ═══════════════════════════════════════════════ -->
  <section class="relative bg-charcoal overflow-hidden">
    <!-- Ambient coral glow behind the floating animal -->
    <div class="hero-glow absolute inset-0 pointer-events-none" aria-hidden="true"></div>

    <!-- Mobile: photo first (emotional hook), no text overlaid -->
    <div v-if="heroPhotoUrl" class="relative md:hidden flex justify-center px-4 pt-8">
      <img
        :src="imgUrl(heroPhotoUrl, 700, 80)"
        alt=""
        aria-hidden="true"
        class="hero-float max-h-72 w-auto object-contain object-bottom select-none"
        fetchpriority="high"
        loading="eager"
      />
    </div>

    <div class="relative max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 md:min-h-[88vh]">

        <!-- Left: text content -->
        <div class="flex flex-col justify-center pt-10 pb-16 md:py-24 md:pr-12">
          <p class="hero-rise text-xs font-semibold uppercase tracking-widest text-coral mb-4" style="animation-delay: 0.05s">
            {{ t('eyebrow.hero') }}
          </p>
          <h1 class="hero-rise font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6" style="animation-delay: 0.15s">
            {{ heroHeadline }}
          </h1>
          <p class="hero-rise text-white/70 text-lg leading-relaxed mb-6 max-w-sm" style="animation-delay: 0.25s">
            {{ t('hero.subtitle') }}
          </p>
          <p class="hero-rise text-white/90 text-xl md:text-2xl font-display mb-10" style="animation-delay: 0.35s">
            {{ t('hero.taglineLead') }}
            <span class="text-coral"><RotatingWord :words="rotatingWords" /></span>?
          </p>
          <div class="hero-rise flex flex-wrap gap-4" style="animation-delay: 0.45s">
            <a
              href="#match"
              class="cta-coral inline-block font-semibold px-7 py-3 rounded-full"
            >
              {{ t('nav.meetAnimals') }}
            </a>
            <a
              href="#donate"
              class="inline-block bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-3 rounded-full border border-white/30 transition-colors duration-150"
            >
              {{ t('nav.donate') }}
            </a>
          </div>
        </div>

        <!-- Right: photo pinned to bottom of column (desktop) -->
        <div v-if="heroPhotoUrl" class="relative hidden md:block">
          <!-- Wrapper handles centering; img handles the float so translateY
               never fights the centering translateX. -->
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 max-h-[88vh]">
            <img
              :src="imgUrl(heroPhotoUrl, 900, 85)"
              :srcset="imgSrcset(heroPhotoUrl, [700, 900, 1100], 85)"
              sizes="50vw"
              alt=""
              aria-hidden="true"
              class="hero-float max-h-[88vh] w-auto object-contain object-bottom select-none pointer-events-none"
              fetchpriority="high"
              loading="eager"
            />
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       IMPACT STRIP
  ═══════════════════════════════════════════════ -->
  <div class="bg-charcoal">
    <div class="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <p class="stat-gradient font-display text-4xl leading-none">
          <CountUp :to="50" prefix="~" />
        </p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.animals') }}</p>
      </div>
      <div>
        <p class="stat-gradient font-display text-4xl leading-none">
          <CountUp :to="adoptedAnimals.length || 20" :suffix="adoptedAnimals.length ? '' : '+'" />
        </p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.adopted') }}</p>
      </div>
      <div>
        <p class="stat-gradient font-display text-4xl leading-none">
          <CountUp :to="3" suffix="×" />
        </p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.walks') }}</p>
      </div>
      <div>
        <p class="stat-gradient font-display text-4xl leading-none">
          <CountUp :to="12" suffix="+" />
        </p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.volunteers') }}</p>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       OUR STORY
  ═══════════════════════════════════════════════ -->
  <section id="story" class="bg-sand py-16">
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

      <!-- Video -->
      <div class="mx-auto w-full max-w-[320px] md:max-w-[360px]">
        <video
          class="w-full aspect-[9/16] rounded-2xl bg-charcoal shadow-lg object-cover"
          controls
          playsinline
          preload="none"
          poster="/our-story-poster.jpg"
          :aria-label="t('ourStory.videoLabel')"
        >
          <source src="/our-story.mp4" type="video/mp4" />
        </video>
      </div>

      <!-- Copy -->
      <div>
        <p class="font-bold text-sm uppercase tracking-widest text-coral mb-3">
          {{ t('ourStory.eyebrow') }}
        </p>
        <h2 class="font-display text-4xl md:text-5xl text-heading mb-6">
          {{ t('ourStory.title') }}
        </h2>
        <p class="text-ink leading-relaxed mb-6">
          {{ t('ourStory.body') }}
        </p>
        <a
          href="https://www.instagram.com/reels/C5eEQShMEF1/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 font-semibold text-coral hover:text-coral-dark transition-colors"
        >
          {{ t('ourStory.watchOnInstagram') }}
        </a>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       FIND YOUR MATCH (quiz teaser) — full grid lives on /animals
  ═══════════════════════════════════════════════ -->
  <section id="match" class="bg-sand py-16">
    <!-- Quiz -->
    <div class="max-w-2xl mx-auto px-4">
      <MatchQuiz :animals="availableAnimals" />

      <!-- Name search — escape hatch for the impulse visitor who knows a name -->
      <form class="mt-6 flex gap-2" @submit.prevent="goSearch">
        <input
          v-model="quickSearch"
          type="search"
          :placeholder="t('quiz.searchPlaceholder')"
          class="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
        />
        <button
          type="submit"
          class="bg-charcoal hover:bg-black text-white font-semibold px-6 py-3 rounded-full transition-colors duration-150 cursor-pointer"
        >
          🔍
        </button>
      </form>
    </div>

    <!-- Featured peek -->
    <div class="max-w-6xl mx-auto px-4 mt-16">
      <div class="flex items-end justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-2">{{ t('eyebrow.feed') }}</p>
          <h2 class="font-display text-3xl md:text-4xl text-heading">{{ t('feed.title') }}</h2>
        </div>
        <NuxtLink
          :to="localePath('/animals')"
          class="text-sm font-semibold text-coral hover:text-coral-dark transition-colors whitespace-nowrap"
        >
          {{ t('quiz.seeAll') }}
        </NuxtLink>
      </div>

      <div
        v-if="featuredPeek.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimalCard v-for="(animal, i) in featuredPeek" :key="animal._id" :animal="animal" :eager="i < 4" />
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          :to="localePath('/animals')"
          class="inline-block bg-coral hover:bg-coral-dark text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
        >
          {{ t('quiz.seeAll') }}
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       HOW YOU CAN HELP
  ═══════════════════════════════════════════════ -->
  <section class="bg-coral-light py-16">
    <div class="max-w-6xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3 text-center">{{ t('eyebrow.help') }}</p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-10 text-center">{{ t('helpPath.title') }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="path in [
          { key: 'adopt', icon: '🐾', href: '#match' },
          { key: 'foster', icon: '📦', href: '/foster' },
          { key: 'walk', icon: '🚶', href: 'https://3horas.org/paws/', external: true },
          { key: 'donate', icon: '❤️', href: '#donate' },
        ]" :key="path.key"
          class="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm"
        >
          <span class="text-3xl">{{ path.icon }}</span>
          <h3 class="font-bold text-lg text-heading">{{ t(`helpPath.${path.key}.title`) }}</h3>
          <p class="text-sm text-muted flex-1">{{ t(`helpPath.${path.key}.copy`) }}</p>
          <a
            :href="path.href"
            :target="path.external ? '_blank' : undefined"
            :rel="path.external ? 'noopener noreferrer' : undefined"
            class="inline-block text-sm font-semibold text-coral hover:text-coral-dark transition-colors"
          >
            {{ t(`helpPath.${path.key}.cta`) }} →
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       SUCCESS STORIES
  ═══════════════════════════════════════════════ -->
  <section v-if="adoptedAnimals.length" class="bg-charcoal py-16">
    <div class="max-w-6xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">{{ t('eyebrow.success') }}</p>
      <h2 class="font-display text-4xl md:text-5xl text-white mb-10">
        {{ t('successStories.title') }}
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <SuccessCard
          v-for="animal in adoptedAnimals"
          :key="animal._id"
          :story="animal"
        />
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       INSTAGRAM
  ═══════════════════════════════════════════════ -->
  <section class="bg-white py-16 text-center">
    <div class="max-w-xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">{{ t('eyebrow.instagram') }}</p>
      <h2 class="font-display text-4xl text-heading mb-4">{{ t('instagram.title') }}</h2>
      <p class="text-muted mb-8">{{ t('instagram.subtitle') }}</p>
      <a
        :href="instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="cta-coral inline-flex items-center gap-2 font-semibold px-7 py-3 rounded-full"
      >
        {{ t('instagram.cta') }}
      </a>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       DONATE
  ═══════════════════════════════════════════════ -->
  <section id="donate" class="py-16">
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">{{ t('eyebrow.donate') }}</p>
        <h2 class="font-display text-4xl md:text-5xl text-heading mb-6">{{ t('donateSection.title') }}</h2>
        <p class="text-ink mb-6 leading-relaxed">{{ t('donateSection.copy') }}</p>
        <ul class="flex flex-col gap-3">
          <li
            v-for="bullet in ['bullet1', 'bullet2', 'bullet3']"
            :key="bullet"
            class="flex items-start gap-2 text-sm text-ink"
          >
            <span class="text-coral font-bold mt-0.5">→</span>
            {{ t(`donateSection.${bullet}`) }}
          </li>
        </ul>
      </div>

      <!-- GoFundMe embed -->
      <ClientOnly>
        <div
          class="gfm-embed"
          data-url="https://www.gofundme.com/f/ericeira--paws/widget/medium?attribution_id=sl%3Acaf1fa6d-3591-4792-8ffb-7012053b80db"
        />
      </ClientOnly>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       CONTACT
  ═══════════════════════════════════════════════ -->
  <section id="contact" class="bg-sand py-16">
    <div class="max-w-5xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">{{ t('eyebrow.contact') }}</p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-3">{{ t('contact.title') }}</h2>
      <p class="text-muted mb-10 max-w-xl">{{ t('contact.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
      <form v-if="formState !== 'success'" class="flex flex-col gap-4" @submit.prevent="submitContact">
        <!-- Honeypot — hidden from real users -->
        <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />

        <input
          v-model="form.name"
          type="text"
          :placeholder="t('contact.name')"
          required
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
        />
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('contact.email')"
          required
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
        />
        <textarea
          v-model="form.message"
          :placeholder="t('contact.message')"
          rows="5"
          required
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent resize-none"
        />

        <p v-if="formState === 'error'" class="text-sm text-red-600">{{ t('contact.error', 'Something went wrong. Please try again.') }}</p>

        <button
          type="submit"
          :disabled="formState === 'sending'"
          class="bg-coral hover:bg-coral-dark disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150 self-start"
        >
          {{ formState === 'sending' ? '…' : t('contact.send') }}
        </button>

        <p class="text-sm text-muted">
          {{ t('contact.orInstagram', 'Or message us on') }}
          <a :href="instagramUrl" target="_blank" rel="noopener" class="text-coral hover:underline">Instagram</a>.
        </p>
      </form>

      <div v-else class="py-8">
        <p class="text-lg font-medium text-teal">{{ t('contact.success', 'Message sent. We\'ll be in touch.') }}</p>
      </div>
        </div>

        <!-- What happens next -->
        <WhatNext />
      </div>
    </div>
  </section>
</template>
