<script setup lang="ts">
defineProps<{ icon: 'adopt' | 'foster' | 'walk' | 'donate' }>()
</script>

<template>
  <!-- adopt: paw print — large palm circle + 4 toe ovals -->
  <svg v-if="icon === 'adopt'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <ellipse cx="12" cy="14.5" rx="4.5" ry="3.5" />
    <ellipse cx="7"  cy="10"   rx="1.4" ry="1.9" />
    <ellipse cx="10" cy="8.2"  rx="1.4" ry="1.9" />
    <ellipse cx="14" cy="8.2"  rx="1.4" ry="1.9" />
    <ellipse cx="17" cy="10"   rx="1.4" ry="1.9" />
  </svg>

  <!-- foster: house outline with door — giving a home -->
  <svg v-else-if="icon === 'foster'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9v11h14V9" />
    <rect x="9.5" y="14" width="5" height="6" rx="0.5" />
  </svg>

  <!-- walk: person + dog connected by leash -->
  <svg v-else-if="icon === 'walk'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- person -->
    <circle cx="15" cy="4.5" r="1.5" />
    <path d="M15 6.5l-1.5 4 2.5 2-1 4" />
    <path d="M13.5 10.5l-2 2" />
    <path d="M16 12.5l2 2" />
    <!-- leash -->
    <path d="M11.5 12.5 C9 13 8 14 7 14" stroke-dasharray="1.5 1" />
    <!-- dog (simple) -->
    <ellipse cx="5.5" cy="15.5" rx="2.5" ry="1.5" />
    <path d="M3.5 14.5 Q3 13 4 13" />
    <path d="M7.5 14.5 Q8.5 14 9 15" />
    <path d="M5.5 17 l0 1.5" />
    <path d="M4.5 17 l-0.5 1.5" />
    <path d="M6.5 17 l0.5 1.5" />
  </svg>

  <!-- donate: open hand holding a heart -->
  <svg v-else-if="icon === 'donate'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- heart -->
    <path d="M12 8.5C12 8.5 10 6 8.5 7c-1.2.8-1.2 2.8 0 3.8L12 14l3.5-3.2c1.2-1 1.2-3 0-3.8C14 6 12 8.5 12 8.5z" />
    <!-- open hand / palm -->
    <path d="M6 15.5c0 0 .5-1 2-1h8c1.5 0 2 1 2 1l.5 2.5a1 1 0 01-1 1H6.5a1 1 0 01-1-1L6 15.5z" />
  </svg>
</template>
