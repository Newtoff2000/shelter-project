<script setup lang="ts">
import { IconPaw, IconHome, IconDog, IconHeartHandshake } from '@tabler/icons-vue'
defineProps<{ icon: 'adopt' | 'foster' | 'walk' | 'donate' }>()
</script>

<template>
  <IconPaw          v-if="icon === 'adopt'"  :size="40" :stroke-width="1.5" aria-hidden="true" />
  <IconHome         v-else-if="icon === 'foster'" :size="40" :stroke-width="1.5" aria-hidden="true" />
  <IconDog          v-else-if="icon === 'walk'"   :size="40" :stroke-width="1.5" aria-hidden="true" />
  <IconHeartHandshake v-else-if="icon === 'donate'" :size="40" :stroke-width="1.5" aria-hidden="true" />
</template>
