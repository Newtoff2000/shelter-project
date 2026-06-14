<script setup lang="ts">
/**
 * Full Ericeira Paws lockup: the heart-and-paws mark + the "Ericeira Paws"
 * wordmark (live text in Nunito 900 italic — the brand label face). Renders the
 * visual only; wrap in a <NuxtLink to="/"> at the call site for a home link.
 */
withDefaults(defineProps<{
  /** Wordmark colour context. `light` → coral on light bg; `dark` → white on dark bg. */
  theme?: 'light' | 'dark'
  /** Lockup scale. */
  size?: 'sm' | 'md' | 'lg'
}>(), {
  theme: 'light',
  size: 'md',
})

const sizes = {
  sm: { mark: 28, text: 'text-lg' },
  md: { mark: 36, text: 'text-xl' },
  lg: { mark: 44, text: 'text-2xl' },
} as const
</script>

<template>
  <span class="inline-flex items-center gap-2.5 align-middle">
    <LogoMark
      :style="{ width: `${sizes[size].mark}px`, height: `${sizes[size].mark}px` }"
      class="shrink-0"
    />
    <span
      class="logo-wordmark leading-none"
      :class="[sizes[size].text, theme === 'dark' ? 'text-white' : 'text-coral']"
    >Ericeira Paws</span>
  </span>
</template>
