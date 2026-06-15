<script setup lang="ts">
import { filterAnimals, rankByMatch, parseMatch, hasAnyMatch, AGE_UNBOUNDED } from '~/composables/useAnimalHelpers'
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
const filterBarRef = ref<{ clear: () => void } | null>(null)
const activeFilters = ref<Filters>({
  name: '', species: '', gender: '', ageMin: 0, ageMax: AGE_UNBOUNDED, size: '', timeAtShelter: '', traits: [],
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
  <section class="max-w-7xl mx-auto px-4 py-8 md:py-10">
    <!-- Compact header — kept short so the first row of animals is visible without scrolling -->
    <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6 md:mb-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-1.5">{{ t('animalsPage.eyebrow') }}</p>
        <h1 class="font-display text-3xl md:text-4xl text-heading mb-1">{{ t('animalsPage.title') }}</h1>
        <p class="text-muted text-sm md:text-base">{{ t('animalsPage.subtitle') }}</p>
      </div>
      <NuxtLink
        :to="localePath('/') + '#match'"
        class="text-sm font-semibold text-coral hover:text-coral-dark transition-colors"
      >
        {{ t('animalsPage.takeQuiz') }}
      </NuxtLink>
    </div>

    <div class="md:grid md:grid-cols-[15rem_1fr] lg:grid-cols-[16rem_1fr] md:gap-8 lg:gap-10 md:items-start">
      <!-- Filters: sticky sidebar on desktop, compact stacked row on mobile -->
      <aside class="mb-6 md:mb-0 md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-1 md:pb-2">
        <FilterBar
          ref="filterBarRef"
          :animals="availableAnimals"
          :result-count="displayed.length"
          :initial="{ name: (route.query.name as string) ?? '' }"
          @update:filters="activeFilters = $event"
        />
      </aside>

      <!-- Results -->
      <div class="min-w-0">
        <!-- Match banner (rank-only — no dog is hidden, just reordered) -->
        <div v-if="matchActive" class="rounded-2xl bg-coral-light p-5 mb-6">
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

        <p class="text-sm text-muted mb-4">{{ t('animalsPage.count', { count: displayed.length }) }}</p>

        <div
          v-if="displayed.length"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimalCard v-for="(animal, i) in displayed" :key="animal._id" :animal="animal" :eager="i < 4" />
        </div>

        <div v-else class="text-center py-16">
          <p class="text-4xl mb-3" aria-hidden="true">🐾</p>
          <p class="text-ink text-lg font-medium">{{ t('feed.empty') }}</p>
          <p class="text-muted mb-5">{{ t('feed.emptyHint') }}</p>
          <button
            type="button"
            class="rounded-full bg-coral text-white px-6 py-2.5 text-sm font-semibold hover:bg-coral-dark cursor-pointer"
            @click="filterBarRef?.clear()"
          >
            {{ t('feed.clearFilters') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
