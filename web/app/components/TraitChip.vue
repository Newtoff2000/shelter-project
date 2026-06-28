<script setup lang="ts">
import * as TablerIcons from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  trait: string
  variant?: 'light' | 'dark'
}>(), {
  variant: 'light',
})

const { t } = useI18n()

const iconComponent = computed(() => {
  const name = TRAIT_ICON_NAMES[props.trait]
  return name ? (TablerIcons as Record<string, unknown>)[name] : null
})
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
    <component :is="iconComponent" v-if="iconComponent" :size="13" :stroke-width="2" aria-hidden="true" />
    {{ label }}
  </span>
</template>
