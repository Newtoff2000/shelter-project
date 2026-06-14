<script setup lang="ts">
const props = withDefaults(defineProps<{
  trait: string
  variant?: 'light' | 'dark'
}>(), {
  variant: 'light',
})

const { t } = useI18n()

const TRAIT_ICONS: Record<string, string> = {
  friendly: '☀️',
  gentle: '🌿',
  calm: '😊',
  curious: '👀',
  playful: '🐾',
  independent: '🛡️',
  affectionate: '❤️',
  energetic: '⚡',
  good_with_kids: '🤝',
  good_with_dogs: '🐕',
  good_with_cats: '🐱',
}

const icon = computed(() => TRAIT_ICONS[props.trait] ?? '•')
const label = computed(() => t(`traits.${props.trait}`, props.trait))
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-widest"
    :class="{
      'bg-teal-light text-teal': variant === 'light',
      'border border-teal text-white': variant === 'dark',
    }"
  >
    <span aria-hidden="true">{{ icon }}</span>
    {{ label }}
  </span>
</template>
