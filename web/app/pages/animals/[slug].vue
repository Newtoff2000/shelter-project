<script setup lang="ts">
import { getAgeGroup, getTimeAtShelter } from '~/composables/useAnimalHelpers'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug as string
const localePath = useLocalePath()
const { locale, t } = useI18n()

const { data: animal } = await useFetch<any>(`/api/animals/${slug}`)

const lang = computed(() => locale.value === 'pt' ? 'pt' : 'en')

// OG meta tags — critical for Instagram share previews
useHead(computed(() => {
  if (!animal.value) return {}
  const quote = animal.value.shortQuote?.[lang.value] ?? animal.value.shortQuote?.pt ?? ''
  return {
    title: `${animal.value.name} — Ericeira Paws`,
    meta: [
      { name: 'description', content: quote },
      { property: 'og:title', content: `${animal.value.name} — Ericeira Paws` },
      { property: 'og:description', content: quote },
      { property: 'og:image', content: animal.value.coverPhotoUrl ?? '' },
      { property: 'og:type', content: 'profile' },
    ],
  }
}))

// Rich text: Portable Text → HTML (bold + italic marks, paragraph wrapping)
function blocksToHtml(blocks: any): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => {
      const html = (b.children ?? []).map((c: any) => {
        let text = (c.text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        if (c.marks?.includes('strong')) text = `<strong>${text}</strong>`
        if (c.marks?.includes('em')) text = `<em>${text}</em>`
        return text
      }).join('')
      return `<p>${html}</p>`
    })
    .join('')
}

function localizedHtml(field: any): string {
  if (!field) return ''
  return blocksToHtml(field[lang.value]) || blocksToHtml(field.en) || blocksToHtml(field.pt)
}

function localizedFact(fact: any): string {
  if (!fact) return ''
  return fact[lang.value] || fact.en || fact.pt || ''
}

const ageGroup = computed(() => animal.value ? getAgeGroup(animal.value.ageYears) : 'young')
const timeAtShelter = computed(() => animal.value ? getTimeAtShelter(animal.value.dateJoined) : 'less_than_1')

const shortQuote = computed(() => {
  const q = animal.value?.shortQuote
  if (!q) return null
  return lang.value === 'en' ? (q.en ?? q.pt ?? null) : (q.pt ?? q.en ?? null)
})

// CTA: link to homepage contact form pre-filled with animal name
const adoptCtaUrl = computed(() => {
  if (!animal.value) return localePath('/')
  return `${localePath('/')}?animal=${encodeURIComponent(animal.value.name)}#contact`
})

// Video: detect YouTube to embed as iframe, everything else as a link
function isYouTube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}
function youTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

const statusBadgeClass = computed(() => {
  if (animal.value?.status === 'reserved') return 'bg-[#fff3e0] text-[#b45309]'
  if (animal.value?.status === 'adopted') return 'bg-[#e8f5e9] text-[#2e7d32]'
  return null
})
</script>

<template>
  <div>
    <!-- Not found -->
    <div v-if="!animal" class="max-w-2xl mx-auto px-4 py-24 text-center">
      <p class="text-[--color-muted] text-lg mb-6">{{ t('profile.notFound') }}</p>
      <NuxtLink :to="localePath('/')" class="text-[--color-coral] hover:underline">{{ t('profile.back') }}</NuxtLink>
    </div>

    <template v-else>

      <!-- ── HERO ───────────────────────────────────── -->
      <div class="relative h-[50vh] min-h-64 bg-[--color-charcoal] overflow-hidden">
        <img
          v-if="animal.coverPhotoUrl"
          :src="imgUrl(animal.coverPhotoUrl, 1200, 80)"
          :srcset="imgSrcset(animal.coverPhotoUrl, [768, 1200], 80)"
          sizes="100vw"
          :alt="animal.coverPhotoAlt || animal.name"
          class="w-full h-full object-cover"
          fetchpriority="high"
          loading="eager"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-7xl">🐾</div>

        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <!-- Name + status -->
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
          <div class="flex items-end gap-4 flex-wrap">
            <h1 class="font-display text-5xl md:text-7xl text-white leading-none">{{ animal.name }}</h1>
            <span
              v-if="statusBadgeClass"
              class="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-1"
              :class="statusBadgeClass"
            >
              {{ t(`status.${animal.status}`) }}
            </span>
          </div>
        </div>
      </div>

      <!-- ── BASIC INFO BAR ─────────────────────────── -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div>
            <p class="text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">{{ t('profile.species') }}</p>
            <p class="font-medium text-[--color-ink]">{{ animal.species === 'dog' ? `🐶 ${t('card.dog')}` : `🐱 ${t('card.cat')}` }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">{{ t('profile.gender') }}</p>
            <p class="font-medium text-[--color-ink]">{{ animal.gender === 'male' ? t('filters.male') : t('filters.female') }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">{{ t('profile.age') }}</p>
            <p class="font-medium text-[--color-ink]">
              {{ animal.ageYears }} {{ animal.ageYears === 1 ? t('profile.year') : t('profile.years') }}
            </p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">{{ t('profile.size') }}</p>
            <p class="font-medium text-[--color-ink]">{{ t(`filters.${animal.size}`) }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">{{ t('profile.atShelter') }}</p>
            <p class="font-medium text-[--color-ink]">{{ t(`filters.${timeAtShelter === 'less_than_1' ? 'lessThan1' : timeAtShelter === '1_year' ? 'year1' : timeAtShelter === '2_years' ? 'year2' : 'year3plus'}`) }}</p>
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">{{ t('profile.neutered') }}</p>
            <p class="font-medium text-[--color-ink]">{{ animal.neutered ? t('profile.yes') : t('profile.no') }}</p>
          </div>
        </div>
      </div>

      <!-- ── CONTENT ─────────────────────────────────── -->
      <div class="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">

        <!-- Personality dark card -->
        <section
          v-if="animal.personalityTraits?.length || shortQuote || localizedHtml(animal.personality)"
          class="rounded-2xl bg-[--color-charcoal] p-8 md:p-10"
        >
          <!-- Trait chips (dark variant) -->
          <div v-if="animal.personalityTraits?.length" class="flex flex-wrap gap-2 mb-6">
            <TraitChip
              v-for="trait in animal.personalityTraits"
              :key="trait"
              :trait="trait"
              variant="dark"
            />
          </div>

          <!-- Short quote -->
          <blockquote v-if="shortQuote" class="text-xl italic text-white/70 mb-6 leading-relaxed">
            "{{ shortQuote }}"
          </blockquote>

          <!-- Personality rich text -->
          <div
            v-if="localizedHtml(animal.personality)"
            class="prose-invert text-white/80 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-white [&_em]:text-white/90"
            v-html="localizedHtml(animal.personality)"
          />
        </section>

        <!-- Quick facts -->
        <section v-if="animal.quickFacts?.length" class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="font-display text-2xl text-[--color-heading] mb-5">{{ t('profile.quickFacts') }}</h2>
          <ul class="flex flex-col gap-3">
            <li
              v-for="(fact, i) in animal.quickFacts"
              :key="i"
              class="flex items-start gap-2 text-[--color-ink]"
            >
              <span class="text-[--color-coral] font-bold mt-0.5 shrink-0">✓</span>
              {{ localizedFact(fact) }}
            </li>
          </ul>
        </section>

        <!-- Adoption CTA -->
        <section class="bg-[--color-coral-light] rounded-2xl p-8 text-center">
          <h2 class="font-display text-3xl text-[--color-heading] mb-3">
            {{ t('profile.interestedTitle', { name: animal.name }) }}
          </h2>
          <p class="text-[--color-muted] mb-6">{{ t('profile.interestedSubtitle') }}</p>
          <a
            :href="adoptCtaUrl"
            class="inline-block bg-[--color-coral] hover:bg-[--color-coral-dark] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-150"
          >
            {{ t('profile.interestedCta', { name: animal.name }) }}
          </a>
        </section>

        <!-- Video -->
        <section v-if="animal.videoUrl" class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="font-display text-2xl text-[--color-heading] mb-5">{{ t('profile.videoTitle') }}</h2>
          <div v-if="isYouTube(animal.videoUrl)" class="aspect-video rounded-xl overflow-hidden">
            <iframe
              :src="youTubeEmbedUrl(animal.videoUrl)"
              class="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              :title="`${animal.name} video`"
            />
          </div>
          <a
            v-else
            :href="animal.videoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-[--color-coral] hover:text-[--color-coral-dark] font-semibold transition-colors"
          >
            {{ t('profile.watchVideo') }}
          </a>
        </section>

        <!-- History -->
        <section v-if="localizedHtml(animal.history)" class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="font-display text-2xl text-[--color-heading] mb-5">{{ t('profile.history') }}</h2>
          <div
            class="text-[--color-ink] leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
            v-html="localizedHtml(animal.history)"
          />
        </section>

        <!-- Health -->
        <section v-if="localizedHtml(animal.health)" class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="font-display text-2xl text-[--color-heading] mb-5">{{ t('profile.health') }}</h2>
          <div
            class="text-[--color-ink] leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
            v-html="localizedHtml(animal.health)"
          />
        </section>

        <!-- Interesting facts -->
        <section v-if="localizedHtml(animal.interestingFacts)" class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="font-display text-2xl text-[--color-heading] mb-5">{{ t('profile.interestingFacts') }}</h2>
          <div
            class="text-[--color-ink] leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
            v-html="localizedHtml(animal.interestingFacts)"
          />
        </section>

        <!-- Photo gallery -->
        <section v-if="animal.photos?.length" class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="font-display text-2xl text-[--color-heading] mb-5">{{ t('profile.gallery') }}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <img
              v-for="(photo, i) in animal.photos"
              :key="i"
              :src="imgUrl(photo.url, 800)"
              :srcset="imgSrcset(photo.url, [400, 800])"
              sizes="(max-width: 640px) calc(50vw - 1.5rem), (max-width: 768px) calc(33vw - 1.5rem), 200px"
              :alt="photo.alt || animal.name"
              class="w-full aspect-square object-cover rounded-xl"
              loading="lazy"
            />
          </div>
        </section>

        <!-- Back link -->
        <div class="pt-4">
          <NuxtLink
            :to="localePath('/')"
            class="text-sm text-[--color-muted] hover:text-[--color-coral] transition-colors"
          >
            {{ t('profile.back') }}
          </NuxtLink>
        </div>

      </div>
    </template>
  </div>
</template>
