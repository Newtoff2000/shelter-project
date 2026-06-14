<script setup lang="ts">
/**
 * Animates a number counting up from 0 to `to` when it first scrolls into view.
 *
 * SSG-safe: the final value is rendered server-side (so no-JS visitors and
 * crawlers see the real number, and there's no hydration mismatch). On the
 * client it resets to 0 and eases up once visible. Falls back to the static
 * final value when prefers-reduced-motion is set or IntersectionObserver is
 * unavailable.
 */
const props = withDefaults(defineProps<{
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}>(), {
  prefix: '',
  suffix: '',
  duration: 1400,
})

const display = ref(props.to)
const el = ref<HTMLElement | null>(null)

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || typeof IntersectionObserver === 'undefined') return

  display.value = 0

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.disconnect()
        run()
      }
    }
  }, { threshold: 0.4 })

  if (el.value) observer.observe(el.value)

  function run() {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / props.duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      display.value = Math.round(eased * props.to)
      if (t < 1) requestAnimationFrame(tick)
      else display.value = props.to
    }
    requestAnimationFrame(tick)
  }
})
</script>

<template>
  <span ref="el">{{ prefix }}{{ display }}{{ suffix }}</span>
</template>
