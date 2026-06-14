<script setup lang="ts">
import { getAgeGroup, getTimeAtShelter } from '~/composables/useAnimalHelpers'
import type { Filters } from '~/components/FilterBar.vue'

definePageMeta({ layout: 'default' })

useHead({
  script: [{ src: 'https://www.gofundme.com/static/js/embed.js', defer: true, tagPosition: 'bodyClose' }],
})

const { locale, t } = useI18n()

const { data: animals } = await useFetch<any[]>('/api/animals')
const { data: settings } = await useFetch<any>('/api/site-settings')

const lang = computed(() => locale.value === 'pt' ? 'pt' : 'en')

const heroHeadline = computed(() =>
  settings.value?.heroHeadline?.[lang.value] ?? t('hero.headlineFallback')
)
const heroPhotoUrl = computed(() => settings.value?.heroPhotoUrl)
const instagramUrl = computed(() => settings.value?.instagramUrl ?? 'https://www.instagram.com/ericeira.paws/')

// --- Filters ---
const activeFilters = ref<Filters>({
  name: '', species: '', gender: '', ageGroup: '', size: '', timeAtShelter: '', traits: [],
})

const allAnimals = computed(() => Array.isArray(animals.value) ? animals.value : [])

const availableAnimals = computed(() =>
  allAnimals.value.filter(a => a.status !== 'adopted')
)

const adoptedAnimals = computed(() =>
  allAnimals.value.filter(a => a.status === 'adopted')
)

const filteredAnimals = computed(() => {
  const f = activeFilters.value
  return availableAnimals.value.filter(a => {
    if (f.name && !a.name.toLowerCase().includes(f.name.toLowerCase())) return false
    if (f.species && a.species !== f.species) return false
    if (f.gender && a.gender !== f.gender) return false
    if (f.ageGroup && getAgeGroup(a.ageYears) !== f.ageGroup) return false
    if (f.size && a.size !== f.size) return false
    if (f.timeAtShelter && getTimeAtShelter(a.dateJoined) !== f.timeAtShelter) return false
    if (f.traits.length > 0) {
      const animalTraits: string[] = a.personalityTraits ?? []
      if (!f.traits.some(tr => animalTraits.includes(tr))) return false
    }
    return true
  })
})

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
  <section class="bg-charcoal overflow-hidden">
    <!-- Mobile: photo first (emotional hook), no text overlaid -->
    <div v-if="heroPhotoUrl" class="md:hidden flex justify-center px-4 pt-8">
      <img
        :src="imgUrl(heroPhotoUrl, 700, 80)"
        alt=""
        aria-hidden="true"
        class="max-h-72 w-auto object-contain object-bottom select-none"
        fetchpriority="high"
        loading="eager"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 md:min-h-[88vh]">

        <!-- Left: text content -->
        <div class="flex flex-col justify-center pt-10 pb-16 md:py-24 md:pr-12">
          <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-4">
            {{ t('eyebrow.hero') }}
          </p>
          <h1 class="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            {{ heroHeadline }}
          </h1>
          <p class="text-white/70 text-lg leading-relaxed mb-10 max-w-sm">
            {{ t('hero.subtitle') }}
          </p>
          <div class="flex flex-wrap gap-4">
            <a
              href="#feed"
              class="inline-block bg-coral hover:bg-coral-dark text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
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
          <img
            :src="imgUrl(heroPhotoUrl, 900, 85)"
            :srcset="imgSrcset(heroPhotoUrl, [700, 900, 1100], 85)"
            sizes="50vw"
            alt=""
            aria-hidden="true"
            class="absolute bottom-0 left-1/2 -translate-x-1/2 max-h-[88vh] w-auto object-contain object-bottom select-none pointer-events-none"
            fetchpriority="high"
            loading="eager"
          />
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
        <p class="font-display text-4xl text-coral leading-none">~45</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.animals') }}</p>
      </div>
      <div>
        <p class="font-display text-4xl text-coral leading-none">{{ adoptedAnimals.length || '20+' }}</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.adopted') }}</p>
      </div>
      <div>
        <p class="font-display text-4xl text-coral leading-none">3×</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.walks') }}</p>
      </div>
      <div>
        <p class="font-display text-4xl text-coral leading-none">12+</p>
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
       ANIMAL FEED
  ═══════════════════════════════════════════════ -->
  <section id="feed" class="max-w-6xl mx-auto px-4 py-16">
    <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">{{ t('eyebrow.feed') }}</p>
    <h2 class="font-display text-4xl md:text-5xl text-heading mb-2">{{ t('feed.title') }}</h2>
    <p class="text-muted mb-10">{{ t('feed.subtitle') }}</p>

    <FilterBar class="mb-10" @update:filters="activeFilters = $event" />

    <div
      v-if="filteredAnimals.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimalCard v-for="(animal, i) in filteredAnimals" :key="animal._id" :animal="animal" :eager="i < 4" />
    </div>

    <div v-else class="text-center py-16">
      <p class="text-muted text-lg">{{ t('feed.empty') }}</p>
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
          { key: 'adopt', icon: '🐾', href: '#feed' },
          { key: 'foster', icon: '📦', href: '/foster' },
          { key: 'walk', icon: '🚶', href: '/volunteer' },
          { key: 'donate', icon: '❤️', href: '#donate' },
        ]" :key="path.key"
          class="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-sm"
        >
          <span class="text-3xl">{{ path.icon }}</span>
          <h3 class="font-bold text-lg text-heading">{{ t(`helpPath.${path.key}.title`) }}</h3>
          <p class="text-sm text-muted flex-1">{{ t(`helpPath.${path.key}.copy`) }}</p>
          <a
            :href="path.href"
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
        class="inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
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
