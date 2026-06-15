<script setup lang="ts">
interface Option {
  value: string
  label: string
  icon?: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  ariaLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const btns = ref<HTMLButtonElement[]>([])

function select(value: string) {
  emit('update:modelValue', value)
}

// Arrow-key navigation across the radio group.
function onKey(e: KeyboardEvent, index: number) {
  const last = props.options.length - 1
  let next = index
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
  else return
  e.preventDefault()
  const opt = props.options[next]
  if (opt) {
    select(opt.value)
    btns.value[next]?.focus()
  }
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="ariaLabel"
    class="flex flex-wrap items-center gap-2"
  >
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      ref="btns"
      type="button"
      role="radio"
      :aria-checked="modelValue === opt.value"
      :tabindex="modelValue === opt.value || (!modelValue && i === 0) ? 0 : -1"
      class="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
      :class="modelValue === opt.value
        ? 'bg-coral border-coral text-white'
        : 'bg-white border-border text-ink hover:border-coral'"
      @click="select(opt.value)"
      @keydown="onKey($event, i)"
    >
      <span v-if="opt.icon" aria-hidden="true">{{ opt.icon }}</span>
      {{ opt.label }}
    </button>
  </div>
</template>
