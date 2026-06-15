<script setup lang="ts">
/**
 * Ericeira Paws logo mark — coral heart outline enclosing two paw prints.
 * Vector redraw of the official raster logo (transparent, theme-able, crisp at
 * any size). Decorative by default; pass `title` to expose an accessible name
 * when used standalone (e.g. as a favicon/OG asset).
 */
withDefaults(defineProps<{
  /** Heart-outline colour. Defaults to the brand coral red (--color-coral). */
  coral?: string
  /** Paw-print colour. Defaults to the logo's warm tan. */
  tan?: string
  /** Accessible label. When set, the SVG is a labelled image; otherwise hidden. */
  title?: string
}>(), {
  coral: 'var(--color-coral)',
  tan: 'var(--color-tan)',
  title: '',
})
</script>

<template>
  <svg
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>

    <!-- Heart outline -->
    <path
      d="M60,38 C55,28 44,23 34,25 C19,28 14,43 19,57 C24,71 44,86 60,100 C76,86 96,71 101,57 C106,43 101,28 86,25 C76,23 65,28 60,38 Z"
      :stroke="coral"
      stroke-width="6"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Paw print — lower-left, larger -->
    <g :fill="tan" transform="translate(47 69) rotate(-13) scale(0.94)">
      <path d="M0,-3.5 C7.5,-3.5 12,1 12,7 C12,12.5 7,18.5 0,18.5 C-7,18.5 -12,12.5 -12,7 C-12,1 -7.5,-3.5 0,-3.5 Z" />
      <ellipse cx="-5.6" cy="-14" rx="4.2" ry="6.6" transform="rotate(-13 -5.6 -14)" />
      <ellipse cx="5.6" cy="-14" rx="4.2" ry="6.6" transform="rotate(13 5.6 -14)" />
      <ellipse cx="-13.4" cy="-5.5" rx="3.8" ry="5.9" transform="rotate(-46 -13.4 -5.5)" />
      <ellipse cx="13.4" cy="-5.5" rx="3.8" ry="5.9" transform="rotate(46 13.4 -5.5)" />
    </g>

    <!-- Paw print — upper-right, smaller -->
    <g :fill="tan" transform="translate(81 45) rotate(11) scale(0.72)">
      <path d="M0,-3.5 C7.5,-3.5 12,1 12,7 C12,12.5 7,18.5 0,18.5 C-7,18.5 -12,12.5 -12,7 C-12,1 -7.5,-3.5 0,-3.5 Z" />
      <ellipse cx="-5.6" cy="-14" rx="4.2" ry="6.6" transform="rotate(-13 -5.6 -14)" />
      <ellipse cx="5.6" cy="-14" rx="4.2" ry="6.6" transform="rotate(13 5.6 -14)" />
      <ellipse cx="-13.4" cy="-5.5" rx="3.8" ry="5.9" transform="rotate(-46 -13.4 -5.5)" />
      <ellipse cx="13.4" cy="-5.5" rx="3.8" ry="5.9" transform="rotate(46 13.4 -5.5)" />
    </g>
  </svg>
</template>
