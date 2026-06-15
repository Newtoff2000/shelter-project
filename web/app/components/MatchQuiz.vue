<script setup lang="ts">
import {
  pickArchetypeFaces,
  stringifyMatch,
  type AnimalLike,
  type MatchAnswers,
  type QuizAxis,
} from '~/composables/useAnimalHelpers'

const props = defineProps<{
  animals: AnimalLike[]
}>()

const { t } = useI18n()
const localePath = useLocalePath()

// Real, currently-available dog faces — computed from the data, never hardcoded.
const faces = computed(() => pickArchetypeFaces(props.animals ?? []))

// Each question maps an axis to its two answer tokens (a = left, b = right).
const QUESTIONS: { axis: QuizAxis; a: string; b: string }[] = [
  { axis: 'vibe', a: 'calm', b: 'sporty' },
  { axis: 'home', a: 'full', b: 'solo' },
  { axis: 'size', a: 'compact', b: 'big' },
]

const step = ref(0)
const answers = reactive<MatchAnswers>({})

const current = computed(() => QUESTIONS[step.value]!)

function goToResults() {
  const qs = stringifyMatch(answers)
  navigateTo(localePath('/animals') + (qs ? `?match=${qs}` : ''))
}

function choose(value: string) {
  const { axis } = current.value
  ;(answers as Record<string, string>)[axis] = value
  if (step.value >= QUESTIONS.length - 1) goToResults()
  else step.value++
}

function back() {
  if (step.value > 0) step.value--
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') { e.preventDefault(); choose(current.value.a) }
  else if (e.key === 'ArrowRight') { e.preventDefault(); choose(current.value.b) }
}

function faceFor(side: 'a' | 'b') {
  const { axis, a, b } = current.value
  return faces.value[axis][side === 'a' ? a : b]
}
</script>

<template>
  <div
    class="rounded-3xl bg-white shadow-sm p-6 md:p-10"
    tabindex="0"
    role="group"
    :aria-label="t('quiz.title')"
    @keydown="onKeydown"
  >
    <!-- Header -->
    <div class="text-center mb-8">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-2">{{ t('quiz.eyebrow') }}</p>
      <h3 class="font-display text-3xl md:text-4xl text-heading mb-2">{{ t('quiz.title') }}</h3>
      <p class="text-sm text-muted">{{ t('quiz.subtitle') }}</p>
    </div>

    <!-- Progress -->
    <div class="flex items-center justify-center gap-2 mb-6" aria-hidden="true">
      <span
        v-for="(q, i) in QUESTIONS"
        :key="q.axis"
        class="h-2 rounded-full transition-all duration-200"
        :class="i === step ? 'w-8 bg-coral' : i < step ? 'w-2 bg-coral/50' : 'w-2 bg-border'"
      />
    </div>

    <!-- Question -->
    <p class="text-center font-bold text-lg text-ink mb-5">
      {{ t(`quiz.q.${current.axis}.q`) }}
      <span class="block text-xs font-normal text-muted mt-1">{{ t('quiz.step', { current: step + 1, total: QUESTIONS.length }) }}</span>
    </p>

    <!-- This-or-that option cards -->
    <div class="grid grid-cols-2 gap-3 md:gap-5">
      <button
        v-for="side in (['a', 'b'] as const)"
        :key="side"
        type="button"
        class="group relative rounded-2xl overflow-hidden border-2 border-transparent bg-sand hover:border-coral focus-visible:outline-none focus-visible:border-coral transition-colors duration-150 cursor-pointer text-left"
        @click="choose(side === 'a' ? current.a : current.b)"
      >
        <div class="aspect-[4/3] bg-coral-light overflow-hidden">
          <img
            v-if="faceFor(side)"
            :src="imgUrl(faceFor(side)!.coverPhotoUrl, 500)"
            :srcset="imgSrcset(faceFor(side)!.coverPhotoUrl, [300, 500, 700])"
            sizes="(max-width: 768px) 45vw, 280px"
            :alt="faceFor(side)!.name"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span v-else class="absolute inset-0 flex items-center justify-center text-5xl select-none">🐾</span>
        </div>
        <div class="p-3 md:p-4">
          <p class="font-bold text-ink leading-tight">
            {{ side === 'a' ? t(`quiz.q.${current.axis}.a`) : t(`quiz.q.${current.axis}.b`) }}
          </p>
          <p v-if="faceFor(side)" class="text-xs text-muted mt-0.5">
            {{ t('quiz.like', { name: faceFor(side)!.name }) }}
          </p>
        </div>
      </button>
    </div>

    <!-- Footer controls -->
    <div class="flex items-center justify-between mt-7 text-sm">
      <button
        v-if="step > 0"
        type="button"
        class="text-muted hover:text-ink font-medium transition-colors cursor-pointer"
        @click="back"
      >
        {{ t('quiz.back') }}
      </button>
      <span v-else />

      <NuxtLink
        :to="localePath('/animals')"
        class="text-muted hover:text-coral font-medium transition-colors underline underline-offset-2"
      >
        {{ t('quiz.skip') }}
      </NuxtLink>
    </div>
  </div>
</template>
