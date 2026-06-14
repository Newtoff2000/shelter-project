<script setup lang="ts">
import { filterAnimals, rankByMatch, parseMatch, hasAnyMatch } from '~/composables/useAnimalHelpers'
import type { Filters } from '~/components/FilterBar.vue'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

useHead({
  title: 'Meet the animals — Ericeira Paws',
  meta: [
    { name: 'description', content: 'Browse every dog and cat looking for a home at the Ericeira Paws shelter in Mafra, Portugal.' },
    { property: 'og:title', content: 'Meet the animals — Ericeira Paws' },
    { property: 'og:description', content: 'Browse every animal looking for a home at the Ericeira Paws shelter.' },
  ],
})

const { data: animals } = await useFetch<any[]>('/api/animals')

const availableAnimals = computed(() =>
  (Array.isArray(animals.value) ? animals.value : []).filter(a => a.status !== 'adopted'),
)

// --- Filters ---
const activeFilters = ref<Filters>({
  name: '', species: '', gender: '', ageGroup: '', size: '', timeAtShelter: '', traits: [],
})

const filtered = computed(() => filterAnimals(availableAnimals.value, activeFilters.value))

// --- Match ranking (from the homepage quiz, via ?match=) ---
const answers = computed(() => parseMatch(route.query.match))
const matchActive = computed(() => hasAnyMatch(answers.value))

const displayed = computed(() => rankByMatch(filtered.value, answers.value))

// Same axis→token mapping as MatchQuiz, used to label the chosen answers.
const QUESTIONS = [
  { axis: 'vibe', a: 'calm' },
  { axis: 'home', a: 'full' },
  { axis: 'size', a: 'compact' },
] as const

const matchSummary = computed(() =>
  QUESTIONS
    .map(({ axis, a }) => {
      const chosen = (answers.value as Record<string, string>)[axis]
      if (!chosen) return null
      return t(`quiz.q.${axis}.${chosen === a ? 'a' : 'b'}`)
    })
    .filter(Boolean) as string[],
)

function resetMatch() {
  // Keep the current (locale-prefixed) path, just drop the ?match query.
  router.replace({ path: route.path })
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-12 md:py-16">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">{{ t('animalsPage.eyebrow') }}</p>
        <h1 class="font-display text-4xl md:text-5xl text-heading mb-2">{{ t('animalsPage.title') }}</h1>
        <p class="text-muted">{{ t('animalsPage.subtitle') }}</p>
      </div>
      <NuxtLink
        :to="localePath('/') + '#match'"
        class="text-sm font-semibold text-coral hover:text-coral-dark transition-colors"
      >
        {{ t('animalsPage.takeQuiz') }}
      </NuxtLink>
    </div>

    <!-- Match banner (rank-only — no dog is hidden, just reordered) -->
    <div v-if="matchActive" class="rounded-2xl bg-coral-light p-5 mb-8">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="font-bold text-heading mb-1">{{ t('animalsPage.matchBanner') }}</p>
          <p class="text-sm text-muted mb-3">{{ t('animalsPage.matchSubtitle') }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="label in matchSummary"
              :key="label"
              class="inline-block rounded-full bg-white text-ink text-xs font-medium px-3 py-1"
            >
              {{ label }}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="text-sm font-medium text-coral hover:text-coral-dark underline underline-offset-2 transition-colors cursor-pointer whitespace-nowrap"
          @click="resetMatch"
        >
          {{ t('animalsPage.matchReset') }} ✕
        </button>
      </div>
    </div>

    <FilterBar
      class="mb-8"
      :initial="{ name: (route.query.name as string) ?? '' }"
      @update:filters="activeFilters = $event"
    />

    <p class="text-sm text-muted mb-6">{{ t('animalsPage.count', { count: displayed.length }) }}</p>

    <div
      v-if="displayed.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimalCard v-for="(animal, i) in displayed" :key="animal._id" :animal="animal" :eager="i < 4" />
    </div>

    <div v-else class="text-center py-16">
      <p class="text-muted text-lg">{{ t('feed.empty') }}</p>
    </div>
  </section>
</template>
