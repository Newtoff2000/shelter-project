<script setup lang="ts">
const { t } = useI18n()

export interface Filters {
  name: string
  species: string
  gender: string
  ageGroup: string
  size: string
  timeAtShelter: string
  traits: string[]
}

// Minimal shape needed to count quick-pick matches against the live catalog.
interface AnimalLike {
  size?: string
  dateJoined?: string
  personalityTraits?: string[]
}

const props = defineProps<{
  animals?: AnimalLike[]
  resultCount?: number
  initial?: Partial<Filters>
}>()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

const filters = reactive<Filters>({
  name: props.initial?.name ?? '',
  species: props.initial?.species ?? '',
  gender: props.initial?.gender ?? '',
  ageGroup: props.initial?.ageGroup ?? '',
  size: props.initial?.size ?? '',
  timeAtShelter: props.initial?.timeAtShelter ?? '',
  traits: props.initial?.traits ? [...props.initial.traits] : [],
})

const showMore = ref(false)
const sheetOpen = ref(false)

// `immediate` so a parent passing `initial` (e.g. /animals?name=…) is synced on mount.
watch(filters, () => emit('update:filters', { ...filters, traits: [...filters.traits] }), { deep: true, immediate: true })

// --- Quick-picks: single-dimension presets, hidden when they match no animal ---
interface QuickPick {
  key: string
  icon: string
  target: { size?: string; timeAtShelter?: string; traits?: string[] }
}

const QUICK_PICKS: QuickPick[] = [
  { key: 'familyFriendly', icon: '🧒', target: { traits: ['good_with_kids'] } },
  { key: 'easygoing', icon: '😌', target: { traits: ['calm'] } },
  { key: 'waitingLongest', icon: '⏳', target: { timeAtShelter: '3_plus' } },
  { key: 'bigBuddies', icon: '🐕', target: { size: 'large' } },
]

function animalMatchesTarget(a: AnimalLike, target: QuickPick['target']) {
  if (target.size && a.size !== target.size) return false
  if (target.timeAtShelter && (!a.dateJoined || getTimeAtShelter(a.dateJoined) !== target.timeAtShelter)) return false
  if (target.traits) {
    const traits = a.personalityTraits ?? []
    if (!target.traits.every(tr => traits.includes(tr))) return false
  }
  return true
}

const visibleQuickPicks = computed(() =>
  QUICK_PICKS.filter(qp => (props.animals ?? []).some(a => animalMatchesTarget(a, qp.target))),
)

function isQuickPickActive(qp: QuickPick) {
  const tg = qp.target
  if (tg.size && filters.size !== tg.size) return false
  if (tg.timeAtShelter && filters.timeAtShelter !== tg.timeAtShelter) return false
  if (tg.traits && !tg.traits.every(tr => filters.traits.includes(tr))) return false
  return true
}

function toggleQuickPick(qp: QuickPick) {
  const tg = qp.target
  const active = isQuickPickActive(qp)
  if (tg.size) filters.size = active ? '' : tg.size
  if (tg.timeAtShelter) filters.timeAtShelter = active ? '' : tg.timeAtShelter
  if (tg.traits) {
    for (const tr of tg.traits) {
      const idx = filters.traits.indexOf(tr)
      if (active && idx !== -1) filters.traits.splice(idx, 1)
      else if (!active && idx === -1) filters.traits.push(tr)
    }
  }
  // Reveal the secondary section if the pick lives in there.
  if (!active && (tg.timeAtShelter || tg.traits)) showMore.value = true
}

// --- Applied-filter pills ---
interface Pill {
  id: string
  label: string
  remove: () => void
}

const pills = computed<Pill[]>(() => {
  const out: Pill[] = []
  if (filters.species)
    out.push({ id: 'species', label: t(`filters.${filters.species === 'dog' ? 'dogs' : 'cats'}`), remove: () => (filters.species = '') })
  if (filters.size)
    out.push({ id: 'size', label: t(`filters.${filters.size}`), remove: () => (filters.size = '') })
  if (filters.ageGroup)
    out.push({ id: 'age', label: t(`filters.${filters.ageGroup}`), remove: () => (filters.ageGroup = '') })
  if (filters.gender)
    out.push({ id: 'gender', label: t(`filters.${filters.gender}`), remove: () => (filters.gender = '') })
  if (filters.timeAtShelter) {
    const map: Record<string, string> = { less_than_1: 'lessThan1', '1_year': 'year1', '2_years': 'year2', '3_plus': 'year3plus' }
    out.push({ id: 'time', label: t(`filters.${map[filters.timeAtShelter]}`), remove: () => (filters.timeAtShelter = '') })
  }
  for (const tr of filters.traits)
    out.push({ id: `trait-${tr}`, label: t(`traits.${tr}`), remove: () => filters.traits.splice(filters.traits.indexOf(tr), 1) })
  return out
})

// Active count for the mobile "Filter · N" badge (search excluded — it's separate).
const activeCount = computed(() => pills.value.length)

const hasActiveFilters = computed(() => !!filters.name || pills.value.length > 0)

function clear() {
  filters.name = ''
  filters.species = ''
  filters.gender = ''
  filters.ageGroup = ''
  filters.size = ''
  filters.timeAtShelter = ''
  filters.traits = []
}

defineExpose({ clear })

const searchClass = 'rounded-full border border-border bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent'

// --- Mobile bottom sheet: scroll lock, Esc, focus trap ---
const sheetEl = ref<HTMLElement | null>(null)

watch(sheetOpen, async (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    sheetEl.value?.querySelector<HTMLElement>('[data-sheet-close]')?.focus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

function onSheetKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    sheetOpen.value = false
    return
  }
  if (e.key !== 'Tab' || !sheetEl.value) return
  const focusable = Array.from(
    sheetEl.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
  if (focusable.length === 0) return
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Row A: search + quick-picks -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <input
        v-model="filters.name"
        type="search"
        :placeholder="t('filters.searchByName')"
        :aria-label="t('filters.labelName')"
        :class="searchClass"
        class="w-full sm:max-w-xs"
      />

      <div v-if="visibleQuickPicks.length" class="flex items-center gap-2 overflow-x-auto sm:flex-wrap -mx-1 px-1 py-0.5">
        <span class="hidden sm:inline text-xs font-semibold uppercase tracking-widest text-muted font-wordmark shrink-0">{{ t('filters.quickPicks') }}</span>
        <button
          v-for="qp in visibleQuickPicks"
          :key="qp.key"
          type="button"
          :aria-pressed="isQuickPickActive(qp)"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          :class="isQuickPickActive(qp)
            ? 'bg-coral border-coral text-white'
            : 'bg-coral-light border-coral-light text-coral hover:border-coral'"
          @click="toggleQuickPick(qp)"
        >
          <span aria-hidden="true">{{ qp.icon }}</span>
          {{ t(`quickPicks.${qp.key}`) }}
        </button>
      </div>
    </div>

    <!-- Desktop: inline controls -->
    <div class="hidden md:block">
      <FilterControls v-model:show-more="showMore" :filters="filters" mode="inline" />
    </div>

    <!-- Mobile: open-sheet button -->
    <div class="md:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        @click="sheetOpen = true"
      >
        <span aria-hidden="true">⚙️</span>
        {{ t('filters.filterButton') }}
        <span
          v-if="activeCount"
          class="inline-flex items-center justify-center rounded-full bg-coral text-white text-xs font-semibold w-5 h-5"
        >{{ activeCount }}</span>
      </button>
    </div>

    <!-- Applied-filter pills + clear -->
    <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
      <button
        v-for="pill in pills"
        :key="pill.id"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full bg-sand border border-border px-3 py-1 text-xs font-medium text-ink hover:border-coral cursor-pointer"
        @click="pill.remove"
      >
        {{ pill.label }}
        <span aria-hidden="true" class="text-muted">✕</span>
      </button>
      <button
        type="button"
        class="text-sm text-coral hover:text-coral-dark font-medium underline underline-offset-2 ml-1"
        @click="clear"
      >
        {{ t('feed.clearFilters') }}
      </button>
    </div>

    <!-- Mobile bottom sheet -->
    <Teleport to="body">
      <div
        v-if="sheetOpen"
        class="fixed inset-0 z-50 md:hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="t('filters.filterButton')"
        @keydown="onSheetKeydown"
      >
        <div class="absolute inset-0 bg-black/40" @click="sheetOpen = false" />
        <div
          ref="sheetEl"
          class="absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col rounded-t-2xl bg-sand shadow-xl"
        >
          <div class="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 class="font-display text-2xl text-heading">{{ t('filters.filterButton') }}</h2>
            <button
              type="button"
              data-sheet-close
              class="rounded-full w-9 h-9 inline-flex items-center justify-center text-ink hover:bg-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              :aria-label="t('feed.clearFilters')"
              @click="sheetOpen = false"
            >
              <span aria-hidden="true" class="text-xl">✕</span>
            </button>
          </div>

          <div class="overflow-y-auto px-5 py-5 flex-1">
            <FilterControls :filters="filters" mode="sheet" />
          </div>

          <div class="px-5 py-4 border-t border-border flex items-center gap-3">
            <button
              v-if="hasActiveFilters"
              type="button"
              class="text-sm text-coral hover:text-coral-dark font-medium underline underline-offset-2"
              @click="clear"
            >
              {{ t('feed.clearFilters') }}
            </button>
            <button
              type="button"
              class="ml-auto rounded-full bg-coral text-white px-6 py-2.5 text-sm font-semibold hover:bg-coral-dark cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              @click="sheetOpen = false"
            >
              {{ t('filters.showResults', { count: resultCount ?? 0 }) }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
