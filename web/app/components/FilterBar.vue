<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

export interface Filters {
  name: string
  species: string
  gender: string
  ageGroup: string
  size: string
  timeAtShelter: string
  traits: string[]
}

const filters = reactive<Filters>({
  name: '',
  species: '',
  gender: '',
  ageGroup: '',
  size: '',
  timeAtShelter: '',
  traits: [],
})

const ALL_TRAITS = [
  'friendly', 'gentle', 'calm', 'curious', 'playful',
  'independent', 'affectionate', 'energetic',
  'good_with_kids', 'good_with_dogs', 'good_with_cats',
]

const TRAIT_ICONS: Record<string, string> = {
  friendly: '☀️', gentle: '🌿', calm: '😊', curious: '👀', playful: '🐾',
  independent: '🛡️', affectionate: '❤️', energetic: '⚡',
  good_with_kids: '🤝', good_with_dogs: '🐕', good_with_cats: '🐱',
}

function toggleTrait(trait: string) {
  const idx = filters.traits.indexOf(trait)
  if (idx === -1) filters.traits.push(trait)
  else filters.traits.splice(idx, 1)
}

function clear() {
  filters.name = ''
  filters.species = ''
  filters.gender = ''
  filters.ageGroup = ''
  filters.size = ''
  filters.timeAtShelter = ''
  filters.traits = []
}

const hasActiveFilters = computed(() =>
  filters.name || filters.species || filters.gender ||
  filters.ageGroup || filters.size || filters.timeAtShelter || filters.traits.length > 0
)

watch(filters, () => emit('update:filters', { ...filters, traits: [...filters.traits] }), { deep: true })

const selectClass = 'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-(--color-ink) focus:outline-none focus:ring-2 focus:ring-(--color-coral) focus:border-transparent'
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Name search + dropdowns -->
    <div class="flex flex-wrap gap-3">
      <input
        v-model="filters.name"
        type="search"
        :placeholder="t('filters.searchByName', 'Search by name…')"
        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-(--color-ink) focus:outline-none focus:ring-2 focus:ring-(--color-coral) focus:border-transparent min-w-40 flex-1"
      />

      <select v-model="filters.species" :class="selectClass">
        <option value="">{{ t('filters.allSpecies') }}</option>
        <option value="dog">{{ t('filters.dogs') }}</option>
        <option value="cat">{{ t('filters.cats') }}</option>
      </select>

      <select v-model="filters.gender" :class="selectClass">
        <option value="">{{ t('filters.anyGender') }}</option>
        <option value="male">{{ t('filters.male') }}</option>
        <option value="female">{{ t('filters.female') }}</option>
      </select>

      <select v-model="filters.ageGroup" :class="selectClass">
        <option value="">{{ t('filters.anyAge') }}</option>
        <option value="young">{{ t('filters.young') }}</option>
        <option value="middle">{{ t('filters.middle') }}</option>
        <option value="senior">{{ t('filters.senior') }}</option>
      </select>

      <select v-model="filters.size" :class="selectClass">
        <option value="">{{ t('filters.anySize') }}</option>
        <option value="small">{{ t('filters.small') }}</option>
        <option value="medium">{{ t('filters.medium') }}</option>
        <option value="large">{{ t('filters.large') }}</option>
      </select>

      <select v-model="filters.timeAtShelter" :class="selectClass">
        <option value="">{{ t('filters.anyTime') }}</option>
        <option value="less_than_1">{{ t('filters.lessThan1') }}</option>
        <option value="1_year">{{ t('filters.year1') }}</option>
        <option value="2_years">{{ t('filters.year2') }}</option>
        <option value="3_plus">{{ t('filters.year3plus') }}</option>
      </select>
    </div>

    <!-- Personality trait chips -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="trait in ALL_TRAITS"
        :key="trait"
        type="button"
        class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-widest border transition-colors duration-150 cursor-pointer"
        :class="filters.traits.includes(trait)
          ? 'bg-(--color-teal) border-(--color-teal) text-white'
          : 'bg-white border-gray-200 text-(--color-muted) hover:border-(--color-teal) hover:text-(--color-teal)'"
        @click="toggleTrait(trait)"
      >
        <span aria-hidden="true">{{ TRAIT_ICONS[trait] }}</span>
        {{ t(`traits.${trait}`) }}
      </button>
    </div>

    <!-- Clear filters -->
    <div v-if="hasActiveFilters" class="flex">
      <button
        type="button"
        class="text-sm text-(--color-coral) hover:text-(--color-coral-dark) font-medium underline underline-offset-2"
        @click="clear"
      >
        {{ t('feed.clearFilters') }}
      </button>
    </div>
  </div>
</template>
