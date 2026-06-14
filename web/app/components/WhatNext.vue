<script setup lang="ts">
// "What happens next?" adoption explainer — copy from VOICE.md §4.
// Optional `name` personalises step 2 ("Meet Kaiser in person…").
const props = defineProps<{
  name?: string
}>()

const { t } = useI18n()

const step2Note = computed(() =>
  props.name
    ? t('whatNext.step2NoteNamed', { name: props.name })
    : t('whatNext.step2Note')
)

const steps = computed(() => [
  { title: t('whatNext.step1Title'), note: t('whatNext.step1Note') },
  { title: t('whatNext.step2Title'), note: step2Note.value },
  { title: t('whatNext.step3Title'), note: t('whatNext.step3Note') },
])
</script>

<template>
  <div class="bg-coral-light rounded-2xl p-6">
    <p class="text-[11px] font-semibold uppercase tracking-widest text-coral mb-4">
      {{ t('whatNext.label') }}
    </p>
    <ol class="flex flex-col gap-4">
      <li v-for="(step, i) in steps" :key="i" class="flex items-start gap-3">
        <span
          class="shrink-0 w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center mt-0.5"
        >
          {{ i + 1 }}
        </span>
        <span class="text-sm leading-snug">
          <span class="font-semibold text-ink">{{ step.title }}</span><br />
          <span class="text-muted">{{ step.note }}</span>
        </span>
      </li>
    </ol>
  </div>
</template>
