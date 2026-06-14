<script setup lang="ts">
/**
 * Typewriter-style rotating word: types a word, holds, deletes, advances to the
 * next, looping. Used for a single highlighted word in the hero tagline — the
 * H1 stays static, so the core message is never delayed.
 *
 * SSG-safe: renders the first word server-side. Under prefers-reduced-motion it
 * stays on the first word with no typing and no caret blink.
 */
const props = withDefaults(defineProps<{
  words: string[]
  typeSpeed?: number
  deleteSpeed?: number
  holdTime?: number
}>(), {
  typeSpeed: 90,
  deleteSpeed: 45,
  holdTime: 1600,
})

const text = ref(props.words[0] ?? '')
const animate = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || props.words.length <= 1) return

  animate.value = true
  let wordIndex = 0
  let charIndex = props.words[0]?.length ?? 0
  let deleting = false

  const step = () => {
    const word = props.words[wordIndex] ?? ''
    if (!deleting) {
      charIndex++
      text.value = word.slice(0, charIndex)
      if (charIndex >= word.length) {
        deleting = true
        timer = setTimeout(step, props.holdTime)
        return
      }
      timer = setTimeout(step, props.typeSpeed)
    } else {
      charIndex--
      text.value = word.slice(0, charIndex)
      if (charIndex <= 0) {
        deleting = false
        wordIndex = (wordIndex + 1) % props.words.length
        timer = setTimeout(step, props.typeSpeed)
        return
      }
      timer = setTimeout(step, props.deleteSpeed)
    }
  }

  timer = setTimeout(step, props.holdTime)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <span class="whitespace-nowrap">
    <span>{{ text }}</span><span
      v-if="animate"
      class="hero-caret ml-0.5 inline-block w-[2px] -mb-1 self-stretch bg-current"
      style="height: 0.9em"
      aria-hidden="true"
    />
  </span>
</template>
