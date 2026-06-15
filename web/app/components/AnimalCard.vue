<script setup lang="ts">
const props = defineProps<{
  animal: {
    _id: string
    name: string
    slug: string
    status: 'available' | 'reserved' | 'adopted'
    featured?: boolean
    species: 'dog' | 'cat'
    gender: 'male' | 'female'
    ageYears?: number
    size: 'small' | 'medium' | 'large'
    dateJoined?: string
    coverPhotoUrl?: string
    personalityTraits?: string[]
    shortQuote?: { pt?: string; en?: string }
  }
  eager?: boolean
}>()

const { t, locale } = useI18n()
const localePath = useLocalePath()

const genderLabel = computed(() =>
  props.animal.gender === 'male' ? '♂' : props.animal.gender === 'female' ? '♀' : null
)
const ageLabel = computed(() =>
  props.animal.ageYears != null ? `${props.animal.ageYears}${t('card.years')}` : null
)
const sizeLabel = computed(() =>
  props.animal.size ? t(`filters.${props.animal.size}`) : null
)
// Build the meta line from whatever fields are actually set — a missing
// gender/age/size is dropped rather than rendered as a wrong default or a raw key.
const metaParts = computed(() =>
  [genderLabel.value, ageLabel.value, sizeLabel.value].filter(Boolean)
)

const quote = computed(() => {
  const q = props.animal.shortQuote
  if (!q) return null
  return locale.value === 'en' ? (q.en ?? q.pt ?? null) : (q.pt ?? q.en ?? null)
})

// A quiet, positive tenure detail — "With us since 2023" — instead of a leading
// "still waiting" badge. Framed as belonging, not as being passed over.
const sinceYear = computed(() => {
  if (!props.animal.dateJoined || props.animal.status !== 'available') return null
  const y = new Date(props.animal.dateJoined).getFullYear()
  return Number.isFinite(y) ? y : null
})

const statusClass = computed(() => {
  if (props.animal.status === 'reserved') return 'bg-status-reserved-light text-status-reserved-ink'
  if (props.animal.status === 'adopted') return 'bg-status-adopted-light text-status-adopted-ink'
  return null
})
const statusLabel = computed(() => {
  if (props.animal.status === 'reserved') return t('status.reserved')
  if (props.animal.status === 'adopted') return t('status.adopted')
  return null
})
</script>

<template>
  <NuxtLink
    :to="localePath(`/animals/${animal.slug}`)"
    class="group block rounded-2xl overflow-hidden bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-12px_rgba(255,87,87,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
  >
    <!-- Cover photo — clean, no text overlay so any photo reads well -->
    <div class="relative aspect-[4/3] bg-coral-light overflow-hidden">
      <img
        v-if="animal.coverPhotoUrl"
        :src="imgUrl(animal.coverPhotoUrl, 600)"
        :srcset="imgSrcset(animal.coverPhotoUrl, [400, 600, 800])"
        sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), 300px"
        :alt="animal.name"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
      />
      <span v-else class="absolute inset-0 flex items-center justify-center text-5xl select-none">🐾</span>

      <!-- Featured badge -->
      <span
        v-if="animal.featured"
        class="absolute top-2.5 left-2.5 bg-coral text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm"
      >
        ⭐ {{ t('card.featured') }}
      </span>

      <!-- Status badge -->
      <span
        v-if="statusLabel"
        class="absolute top-2.5 right-2.5 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm"
        :class="statusClass"
      >
        {{ statusLabel }}
      </span>
    </div>

    <!-- Card body -->
    <div class="p-4 flex flex-col gap-2">
      <div>
        <h3 class="logo-wordmark text-xl leading-none text-heading">{{ animal.name }}</h3>
        <p v-if="metaParts.length" class="text-xs text-muted mt-1.5">
          {{ metaParts.join(' · ') }}
        </p>
      </div>

      <p v-if="quote" class="text-sm italic text-muted line-clamp-2">
        "{{ quote }}"
      </p>

      <!-- CTA + quiet tenure detail -->
      <div class="mt-auto pt-1 flex items-center justify-between gap-2">
        <span
          class="inline-flex items-center gap-1 text-sm font-semibold text-coral transition-all duration-200 group-hover:gap-2 group-hover:text-coral-dark"
        >
          {{ t('card.meet', { name: animal.name }) }}
          <span class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
        <span v-if="sinceYear" class="shrink-0 text-[11px] text-muted/80 whitespace-nowrap">
          {{ t('card.withUsSince', { year: sinceYear }) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
