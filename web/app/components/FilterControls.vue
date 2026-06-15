<script setup lang="ts">
import type { Filters } from './FilterBar.vue'

const props = defineProps<{
  // Reactive filter state, owned by FilterBar — mutated in place here.
  filters: Filters
  mode: 'inline' | 'sheet'
}>()

const { t } = useI18n()

// Inline mode hides secondary filters behind a toggle; the sheet shows everything.
// Exposed as a model so the parent can auto-open it when a hidden quick-pick fires.
const showMore = defineModel<boolean>('showMore', { default: false })
const expanded = computed(() => props.mode === 'sheet' || showMore.value)

// Number of selections living in the hidden (secondary) section — drives the badge.
const hiddenActiveCount = computed(() => {
  let n = 0
  if (props.filters.gender) n++
  if (props.filters.timeAtShelter) n++
  n += props.filters.traits.length
  return n
})

const speciesOptions = computed(() => [
  { value: '', label: t('filters.allShort') },
  { value: 'dog', label: t('filters.dogs'), icon: '🐕' },
  { value: 'cat', label: t('filters.cats'), icon: '🐱' },
])
const sizeOptions = computed(() => [
  { value: '', label: t('filters.allShort') },
  { value: 'small', label: t('filters.small') },
  { value: 'medium', label: t('filters.medium') },
  { value: 'large', label: t('filters.large') },
])
const ageOptions = computed(() => [
  { value: '', label: t('filters.allShort') },
  { value: 'young', label: t('filters.young') },
  { value: 'middle', label: t('filters.middle') },
  { value: 'senior', label: t('filters.senior') },
])
const genderOptions = computed(() => [
  { value: '', label: t('filters.allShort') },
  { value: 'male', label: t('filters.male') },
  { value: 'female', label: t('filters.female') },
])
const timeOptions = computed(() => [
  { value: '', label: t('filters.allShort') },
  { value: 'less_than_1', label: t('filters.lessThan1') },
  { value: '1_year', label: t('filters.year1') },
  { value: '2_years', label: t('filters.year2') },
  { value: '3_plus', label: t('filters.year3plus') },
])

function toggleTrait(trait: string) {
  const idx = props.filters.traits.indexOf(trait)
  if (idx === -1) props.filters.traits.push(trait)
  else props.filters.traits.splice(idx, 1)
}

const groupLabelClass = 'text-xs font-semibold uppercase tracking-widest text-muted mb-2 font-wordmark'
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Primary filters (always visible) -->
    <div>
      <p :class="groupLabelClass">{{ t('filters.speciesLabel') }}</p>
      <SegmentedControl
        v-model="filters.species"
        :options="speciesOptions"
        :aria-label="t('filters.speciesLabel')"
      />
    </div>
    <div>
      <p :class="groupLabelClass">{{ t('filters.sizeLabel') }}</p>
      <SegmentedControl
        v-model="filters.size"
        :options="sizeOptions"
        :aria-label="t('filters.sizeLabel')"
      />
    </div>
    <div>
      <p :class="groupLabelClass">{{ t('filters.ageLabel') }}</p>
      <SegmentedControl
        v-model="filters.ageGroup"
        :options="ageOptions"
        :aria-label="t('filters.ageLabel')"
      />
    </div>

    <!-- More-filters toggle (inline mode only) -->
    <div v-if="mode === 'inline'">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark cursor-pointer"
        :aria-expanded="expanded"
        @click="showMore = !showMore"
      >
        <span>{{ expanded ? t('filters.fewerFilters') : t('filters.moreFilters') }}</span>
        <span
          v-if="!expanded && hiddenActiveCount"
          class="inline-flex items-center justify-center rounded-full bg-coral text-white text-xs font-semibold w-5 h-5"
        >{{ hiddenActiveCount }}</span>
        <span aria-hidden="true" class="transition-transform" :class="expanded ? 'rotate-180' : ''">▾</span>
      </button>
    </div>

    <!-- Secondary filters (revealed) -->
    <template v-if="expanded">
      <div>
        <p :class="groupLabelClass">{{ t('filters.genderLabel') }}</p>
        <SegmentedControl
          v-model="filters.gender"
          :options="genderOptions"
          :aria-label="t('filters.genderLabel')"
        />
      </div>
      <div>
        <p :class="groupLabelClass">{{ t('filters.timeLabel') }}</p>
        <SegmentedControl
          v-model="filters.timeAtShelter"
          :options="timeOptions"
          :aria-label="t('filters.timeLabel')"
        />
      </div>
      <div>
        <p :class="groupLabelClass">{{ t('filters.traitsLabel') }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="trait in ALL_TRAITS"
            :key="trait"
            type="button"
            :aria-pressed="filters.traits.includes(trait)"
            class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-widest border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            :class="filters.traits.includes(trait)
              ? 'bg-teal border-teal text-white'
              : 'bg-white border-border text-muted hover:border-teal hover:text-teal'"
            @click="toggleTrait(trait)"
          >
            <span aria-hidden="true">{{ TRAIT_ICONS[trait] }}</span>
            {{ t(`traits.${trait}`) }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
