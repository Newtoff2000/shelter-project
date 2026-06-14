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

// Format adopted date
function adoptedMonth(dateJoined: string | undefined) {
  if (!dateJoined) return ''
  const d = new Date(dateJoined)
  return d.toLocaleDateString(locale.value === 'pt' ? 'pt-PT' : 'en-GB', { month: 'long', year: 'numeric' })
}
</script>

<template>
  <!-- ═══════════════════════════════════════════════
       HERO
  ═══════════════════════════════════════════════ -->
  <section class="relative min-h-[70vh] flex items-end bg-[--color-charcoal]">
    <img
      v-if="heroPhotoUrl"
      :src="imgUrl(heroPhotoUrl, 1440, 80)"
      :srcset="imgSrcset(heroPhotoUrl, [768, 1200, 1440], 80)"
      sizes="100vw"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 w-full h-full object-cover"
      fetchpriority="high"
      loading="eager"
    />
    <div v-if="heroPhotoUrl" class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 pointer-events-none" />
    <div class="relative z-10 max-w-6xl mx-auto px-4 pb-16 pt-24 w-full">
      <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-4">
        {{ t('eyebrow.hero') }}
      </p>
      <h1 class="font-display text-5xl md:text-7xl text-white leading-tight mb-5 max-w-2xl">
        {{ heroHeadline }}
      </h1>
      <p class="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
        {{ t('hero.subtitle') }}
      </p>
      <div class="flex flex-wrap gap-4">
        <a
          href="#feed"
          class="inline-block bg-[--color-coral] hover:bg-[--color-coral-dark] text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
        >
          {{ t('nav.meetAnimals') }}
        </a>
        <a
          href="#donate"
          class="inline-block bg-white/20 hover:bg-white/30 text-white font-semibold px-7 py-3 rounded-full border border-white/40 backdrop-blur-sm transition-colors duration-150"
        >
          {{ t('nav.donate') }}
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       IMPACT STRIP
  ═══════════════════════════════════════════════ -->
  <div class="bg-[--color-charcoal]">
    <div class="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <p class="font-display text-4xl text-[--color-coral] leading-none">~45</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.animals') }}</p>
      </div>
      <div>
        <p class="font-display text-4xl text-[--color-coral] leading-none">{{ adoptedAnimals.length || '20+' }}</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.adopted') }}</p>
      </div>
      <div>
        <p class="font-display text-4xl text-[--color-coral] leading-none">3×</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.walks') }}</p>
      </div>
      <div>
        <p class="font-display text-4xl text-[--color-coral] leading-none">12+</p>
        <p class="text-xs text-white/40 uppercase tracking-widest mt-2">{{ t('impact.volunteers') }}</p>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       ANIMAL FEED
  ═══════════════════════════════════════════════ -->
  <section id="feed" class="max-w-6xl mx-auto px-4 py-16">
    <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-3">{{ t('eyebrow.feed') }}</p>
    <h2 class="font-display text-4xl md:text-5xl text-[--color-heading] mb-2">{{ t('feed.title') }}</h2>
    <p class="text-[--color-muted] mb-10">{{ t('feed.subtitle') }}</p>

    <FilterBar class="mb-10" @update:filters="activeFilters = $event" />

    <div
      v-if="filteredAnimals.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimalCard v-for="(animal, i) in filteredAnimals" :key="animal._id" :animal="animal" :eager="i < 4" />
    </div>

    <div v-else class="text-center py-16">
      <p class="text-[--color-muted] text-lg">{{ t('feed.empty') }}</p>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       HOW YOU CAN HELP
  ═══════════════════════════════════════════════ -->
  <section class="bg-[--color-coral-light] py-16">
    <div class="max-w-6xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-3 text-center">{{ t('eyebrow.help') }}</p>
      <h2 class="font-display text-4xl md:text-5xl text-[--color-heading] mb-10 text-center">{{ t('helpPath.title') }}</h2>

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
          <h3 class="font-bold text-lg text-[--color-heading]">{{ t(`helpPath.${path.key}.title`) }}</h3>
          <p class="text-sm text-[--color-muted] flex-1">{{ t(`helpPath.${path.key}.copy`) }}</p>
          <a
            :href="path.href"
            class="inline-block text-sm font-semibold text-[--color-coral] hover:text-[--color-coral-dark] transition-colors"
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
  <section v-if="adoptedAnimals.length" class="bg-[--color-charcoal] py-16">
    <div class="max-w-6xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-3">{{ t('eyebrow.success') }}</p>
      <h2 class="font-display text-4xl md:text-5xl text-white mb-10">
        {{ t('successStories.title') }}
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="animal in adoptedAnimals"
          :key="animal._id"
          class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/30"
        >
          <img
            v-if="animal.coverPhotoUrl"
            :src="imgUrl(animal.coverPhotoUrl, 400)"
            :srcset="imgSrcset(animal.coverPhotoUrl, [300, 400])"
            sizes="(max-width: 640px) calc(50vw - 2rem), (max-width: 1024px) calc(33vw - 2rem), 200px"
            :alt="animal.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <span v-else class="absolute inset-0 flex items-center justify-center text-4xl">🐾</span>

          <!-- Bottom-up gradient + content -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4">
            <span
              class="inline-flex items-center gap-1 self-start bg-[--color-status-adopted] text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
            >
              ✓ {{ t('successStories.foundHome') }}
            </span>
            <p class="font-bold text-lg text-white leading-tight">{{ animal.name }}</p>
            <p v-if="animal.dateJoined" class="text-xs text-white/65 mt-0.5">{{ adoptedMonth(animal.dateJoined) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       INSTAGRAM
  ═══════════════════════════════════════════════ -->
  <section class="bg-white py-16 text-center">
    <div class="max-w-xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-3">{{ t('eyebrow.instagram') }}</p>
      <h2 class="font-display text-4xl text-[--color-heading] mb-4">{{ t('instagram.title') }}</h2>
      <p class="text-[--color-muted] mb-8">{{ t('instagram.subtitle') }}</p>
      <a
        :href="instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-[--color-coral] hover:bg-[--color-coral-dark] text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
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
        <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-3">{{ t('eyebrow.donate') }}</p>
        <h2 class="font-display text-4xl md:text-5xl text-[--color-heading] mb-6">{{ t('donateSection.title') }}</h2>
        <p class="text-[--color-ink] mb-6 leading-relaxed">{{ t('donateSection.copy') }}</p>
        <ul class="flex flex-col gap-3">
          <li
            v-for="bullet in ['bullet1', 'bullet2', 'bullet3']"
            :key="bullet"
            class="flex items-start gap-2 text-sm text-[--color-ink]"
          >
            <span class="text-[--color-coral] font-bold mt-0.5">→</span>
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
  <section id="contact" class="bg-[--color-sand] py-16">
    <div class="max-w-5xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-[--color-coral] mb-3">{{ t('eyebrow.contact') }}</p>
      <h2 class="font-display text-4xl md:text-5xl text-[--color-heading] mb-3">{{ t('contact.title') }}</h2>
      <p class="text-[--color-muted] mb-10 max-w-xl">{{ t('contact.subtitle') }}</p>

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
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[--color-ink] placeholder-[--color-muted] focus:outline-none focus:ring-2 focus:ring-[--color-coral] focus:border-transparent"
        />
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('contact.email')"
          required
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[--color-ink] placeholder-[--color-muted] focus:outline-none focus:ring-2 focus:ring-[--color-coral] focus:border-transparent"
        />
        <textarea
          v-model="form.message"
          :placeholder="t('contact.message')"
          rows="5"
          required
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[--color-ink] placeholder-[--color-muted] focus:outline-none focus:ring-2 focus:ring-[--color-coral] focus:border-transparent resize-none"
        />

        <p v-if="formState === 'error'" class="text-sm text-red-600">{{ t('contact.error', 'Something went wrong. Please try again.') }}</p>

        <button
          type="submit"
          :disabled="formState === 'sending'"
          class="bg-[--color-coral] hover:bg-[--color-coral-dark] disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150 self-start"
        >
          {{ formState === 'sending' ? '…' : t('contact.send') }}
        </button>

        <p class="text-sm text-[--color-muted]">
          {{ t('contact.orInstagram', 'Or message us on') }}
          <a :href="instagramUrl" target="_blank" rel="noopener" class="text-[--color-coral] hover:underline">Instagram</a>.
        </p>
      </form>

      <div v-else class="py-8">
        <p class="text-lg font-medium text-[--color-teal]">{{ t('contact.success', 'Message sent. We\'ll be in touch.') }}</p>
      </div>
        </div>

        <!-- What happens next -->
        <WhatNext />
      </div>
    </div>
  </section>
</template>
