<script setup lang="ts">
const props = defineProps<{
  story: {
    _id: string
    name: string
    slug: string
    coverPhotoUrl?: string
    adopterNames?: string
    dateAdopted?: string
    instagramUrl?: string
    testimonial?: { quote?: { pt?: string; en?: string }; attribution?: string }
  }
}>()

const { t, locale } = useI18n()

const foundDate = computed(() => {
  if (!props.story.dateAdopted) return null
  return new Date(props.story.dateAdopted).toLocaleDateString(
    locale.value === 'pt' ? 'pt-PT' : 'en-GB',
    { month: 'long', year: 'numeric' },
  )
})

const quote = computed(() => {
  const q = props.story.testimonial?.quote
  if (!q) return null
  return locale.value === 'en' ? (q.en ?? q.pt ?? null) : (q.pt ?? q.en ?? null)
})
</script>

<template>
  <component
    :is="story.instagramUrl ? 'a' : 'article'"
    :href="story.instagramUrl || undefined"
    :target="story.instagramUrl ? '_blank' : undefined"
    :rel="story.instagramUrl ? 'noopener noreferrer' : undefined"
    :aria-label="story.instagramUrl ? `${story.name} — read their story on Instagram` : undefined"
    class="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-black/30"
    :class="story.instagramUrl ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal' : ''"
  >
    <img
      v-if="story.coverPhotoUrl"
      :src="imgUrl(story.coverPhotoUrl, 400)"
      :srcset="imgSrcset(story.coverPhotoUrl, [300, 400, 600])"
      sizes="(max-width: 640px) calc(50vw - 2rem), (max-width: 1024px) calc(33vw - 2rem), 280px"
      :alt="story.adopterNames ? `${story.name} with ${story.adopterNames}` : story.name"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
    <span v-else class="absolute inset-0 flex items-center justify-center text-4xl select-none">🐾</span>

    <!-- Instagram cue — only when the card links out to a post -->
    <span
      v-if="story.instagramUrl"
      class="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white/90 backdrop-blur-sm transition-colors group-hover:bg-coral group-hover:text-white"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    </span>

    <!-- Bottom-up gradient + content -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4">
      <span
        class="inline-flex items-center gap-1 self-start bg-status-adopted text-white text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
      >
        ✓ {{ t('successStories.foundHome') }}
      </span>

      <p class="font-bold text-lg text-white leading-tight">{{ story.name }}</p>

      <p v-if="story.adopterNames" class="text-xs text-white/80 mt-0.5">
        {{ t('successStories.withFamily', { names: story.adopterNames }) }}
      </p>
      <p v-if="foundDate" class="text-[11px] text-white/55 mt-0.5">{{ foundDate }}</p>

      <!-- Testimonial: revealed on hover/focus (desktop), kept subtle so tiles stay clean -->
      <p
        v-if="quote"
        class="text-xs italic text-white/90 mt-2 line-clamp-3 max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-28 group-hover:opacity-100"
      >
        “{{ quote }}”
      </p>
    </div>
  </component>
</template>
