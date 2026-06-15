<script setup lang="ts">
import { AGE_UNBOUNDED } from '~/composables/useAnimalHelpers'

// Continuous age picker. Two native range inputs give first-class touch, keyboard
// and screen-reader support for free; we only style the track + thumbs.
const props = defineProps<{
  absMax: number // right bound, derived from the catalog (maxAnimalAge)
}>()

const { t } = useI18n()

const lo = defineModel<number>('min', { required: true })
const hi = defineModel<number>('max', { required: true })

// Clamp model values into the displayable track. ageMax defaults to AGE_UNBOUNDED
// (999) → shown pinned to the right bound.
const loVal = computed(() => Math.min(Math.max(lo.value, 0), props.absMax))
const hiVal = computed(() => Math.min(hi.value, props.absMax))

function onMin(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  lo.value = Math.min(v, hiVal.value) // never cross above the max thumb
}
function onMax(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  // Snapping the max thumb to the far right means "no upper limit".
  hi.value = v >= props.absMax ? AGE_UNBOUNDED : Math.max(v, loVal.value)
}

const loPct = computed(() => (loVal.value / props.absMax) * 100)
const hiPct = computed(() => (hiVal.value / props.absMax) * 100)

// Keep the lower thumb grabbable when it's dragged into the upper third
// (otherwise the max input would sit on top of it).
const minOnTop = computed(() => loPct.value > 65)

const label = computed(() => {
  const atFloor = loVal.value <= 0
  const atCeil = hi.value >= props.absMax
  if (atFloor && atCeil) return t('filters.anyAge')
  const u = t('card.years')
  if (atCeil) return `${loVal.value}${u}+`
  if (atFloor) return `0–${hiVal.value}${u}`
  return `${loVal.value}–${hiVal.value}${u}`
})
</script>

<template>
  <div class="age-range">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-medium text-ink">{{ label }}</span>
    </div>

    <div class="age-range__track">
      <!-- inactive rail -->
      <div class="age-range__rail"></div>
      <!-- selected segment -->
      <div
        class="age-range__fill"
        :style="{ left: loPct + '%', right: 100 - hiPct + '%' }"
      ></div>

      <input
        type="range"
        :min="0"
        :max="absMax"
        :step="1"
        :value="loVal"
        :aria-label="t('filters.ageMinLabel')"
        :aria-valuetext="`${loVal} ${t('card.years')}`"
        :style="{ zIndex: minOnTop ? 5 : 3 }"
        @input="onMin"
      />
      <input
        type="range"
        :min="0"
        :max="absMax"
        :step="1"
        :value="hiVal"
        :aria-label="t('filters.ageMaxLabel')"
        :aria-valuetext="hi >= absMax ? t('filters.anyAge') : `${hiVal} ${t('card.years')}`"
        :style="{ zIndex: 4 }"
        @input="onMax"
      />
    </div>

    <div class="flex justify-between mt-2 text-[11px] text-muted tabular-nums">
      <span>0</span>
      <span>{{ absMax }}+</span>
    </div>
  </div>
</template>

<style scoped>
.age-range__track {
  position: relative;
  height: 1.75rem;
  display: flex;
  align-items: center;
}
.age-range__rail,
.age-range__fill {
  position: absolute;
  height: 6px;
  border-radius: 9999px;
  pointer-events: none;
}
.age-range__rail {
  left: 0;
  right: 0;
  background: #e5e0d8; /* sand-shade rail */
}
.age-range__fill {
  background: var(--color-coral, #ff5757);
}

/* Both inputs share the track; only the thumbs are interactive. */
.age-range input[type='range'] {
  position: absolute;
  left: 0;
  width: 100%;
  margin: 0;
  height: 1.75rem;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}
.age-range input[type='range']:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--color-coral, #ff5757);
  outline-offset: 2px;
}
.age-range input[type='range']:focus-visible::-moz-range-thumb {
  outline: 2px solid var(--color-coral, #ff5757);
  outline-offset: 2px;
}

/* Thumb — large hit area for touch */
.age-range input[type='range']::-webkit-slider-thumb {
  pointer-events: auto;
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: #fff;
  border: 2px solid var(--color-coral, #ff5757);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: grab;
}
.age-range input[type='range']::-webkit-slider-thumb:active {
  cursor: grabbing;
}
.age-range input[type='range']::-moz-range-thumb {
  pointer-events: auto;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: #fff;
  border: 2px solid var(--color-coral, #ff5757);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: grab;
}
.age-range input[type='range']::-moz-range-track {
  background: transparent;
}
</style>
