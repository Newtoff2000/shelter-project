<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message: string } }>()
const { t } = useI18n()
const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="min-h-screen bg-sand flex flex-col items-center justify-center px-4 text-center">
    <p class="text-6xl font-display text-coral mb-4">{{ error.statusCode }}</p>
    <h1 class="font-display text-3xl text-heading mb-3">
      {{ is404 ? t('error.notFoundTitle') : t('error.genericTitle') }}
    </h1>
    <p class="text-muted mb-8 max-w-sm">
      {{ is404 ? t('error.notFoundBody') : t('error.genericBody') }}
    </p>
    <NuxtLink
      to="/"
      class="bg-coral hover:bg-coral-dark text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150"
    >
      {{ t('error.backHome') }}
    </NuxtLink>
  </div>
</template>
