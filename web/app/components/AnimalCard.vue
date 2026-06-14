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
    coverPhotoUrl?: string
    personalityTraits?: string[]
    shortQuote?: { pt?: string; en?: string }
  }
}>()

const { t, locale } = useI18n()

const genderLabel = computed(() => props.animal.gender === 'male' ? '♂' : '♀')
const ageLabel = computed(() =>
  props.animal.ageYears != null ? `${props.animal.ageYears}${t('card.years')}` : null
)
const sizeLabel = computed(() => t(`filters.${props.animal.size}`))

const quote = computed(() => {
  const q = props.animal.shortQuote
  if (!q) return null
  return locale.value === 'en' ? (q.en ?? q.pt ?? null) : (q.pt ?? q.en ?? null)
})

const visibleTraits = computed(() => (props.animal.personalityTraits ?? []).slice(0, 3))

const statusClass = computed(() => {
  if (props.animal.status === 'reserved') return 'bg-[#fff3e0] text-[#b45309]'
  if (props.animal.status === 'adopted') return 'bg-[#e8f5e9] text-[#2e7d32]'
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
    :to="`/animals/${animal.slug}`"
    class="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-[--color-coral]"
  >
    <!-- Cover photo -->
    <div class="relative aspect-[4/3] bg-[--color-coral-light] overflow-hidden">
      <img
        v-if="animal.coverPhotoUrl"
        :src="animal.coverPhotoUrl"
        :alt="animal.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <span v-else class="absolute inset-0 flex items-center justify-center text-5xl select-none">🐾</span>

      <!-- Featured badge -->
      <span
        v-if="animal.featured"
        class="absolute top-2 left-2 bg-[--color-coral] text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
      >
        ⭐ Featured
      </span>

      <!-- Status badge -->
      <span
        v-if="statusLabel"
        class="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
        :class="statusClass"
      >
        {{ statusLabel }}
      </span>
    </div>

    <!-- Card body -->
    <div class="p-4 flex flex-col gap-2">
      <div>
        <h3 class="text-xl font-bold text-[--color-ink] leading-tight">{{ animal.name }}</h3>
        <p class="text-sm text-[--color-muted] mt-0.5">
          {{ genderLabel }}
          <template v-if="ageLabel"> · {{ ageLabel }}</template>
          · {{ sizeLabel }}
        </p>
      </div>

      <p v-if="quote" class="text-sm italic text-[--color-muted] line-clamp-2">
        "{{ quote }}"
      </p>

      <div v-if="visibleTraits.length" class="flex flex-wrap gap-1.5">
        <TraitChip v-for="trait in visibleTraits" :key="trait" :trait="trait" />
      </div>

      <!-- CTA -->
      <div class="mt-auto pt-2">
        <span
          class="inline-block text-sm font-semibold text-[--color-coral] group-hover:text-[--color-coral-dark] transition-colors md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-150"
        >
          Meet {{ animal.name }} →
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
