<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: 'Foster — Ericeira Paws',
  meta: [
    { name: 'description', content: 'Foster a dog or cat temporarily through Ericeira Paws. Even a few weeks makes a real difference for an animal at the Mafra shelter.' },
    { property: 'og:title', content: 'Foster — Ericeira Paws' },
    { property: 'og:description', content: 'Open your home temporarily and give a shelter animal a break. Learn about fostering with Ericeira Paws in Mafra/Ericeira, Portugal.' },
  ],
})

const { data: animals } = await useFetch<any[]>('/api/animals')
const availableAnimals = computed(() =>
  (Array.isArray(animals.value) ? animals.value : []).filter(a => a.status === 'available'),
)

const form = reactive({
  name: '',
  email: '',
  message: t('foster.form.defaultMessage'),
  website: '',
})
const formState = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submitFoster() {
  if (form.website) return
  formState.value = 'sending'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        website: form.website,
      },
    })
    formState.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch {
    formState.value = 'error'
  }
}
</script>

<template>
  <!-- ═══════════════════════════════════════════════
       HERO
  ═══════════════════════════════════════════════ -->
  <section class="bg-sand py-20 md:py-28">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-4">
        {{ t('foster.eyebrow') }}
      </p>
      <h1 class="font-display text-5xl md:text-6xl text-heading leading-tight mb-6">
        {{ t('foster.title') }}
      </h1>
      <p class="text-muted text-lg leading-relaxed max-w-xl mx-auto">
        {{ t('foster.subtitle') }}
      </p>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       WHAT FOSTERING MEANS
  ═══════════════════════════════════════════════ -->
  <section class="bg-white py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

        <!-- Left: prose -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">
            {{ t('foster.whatItMeans.eyebrow') }}
          </p>
          <h2 class="font-display text-4xl md:text-5xl text-heading mb-6">
            {{ t('foster.whatItMeans.title') }}
          </h2>
          <p class="text-ink leading-relaxed mb-6">
            {{ t('foster.whatItMeans.body') }}
          </p>
          <h3 class="font-bold text-lg text-heading mb-2">
            {{ t('foster.whatItMeans.transientTitle') }}
          </h3>
          <p class="text-ink leading-relaxed">
            {{ t('foster.whatItMeans.transientBody') }}
          </p>
        </div>

        <!-- Right: info card -->
        <div class="rounded-2xl bg-coral-light p-6 sm:p-8 flex flex-col gap-6">
          <div
            v-for="item in [
              { label: t('foster.whatItMeans.durationLabel'), value: t('foster.whatItMeans.durationValue') },
              { label: t('foster.whatItMeans.costLabel'), value: t('foster.whatItMeans.costValue') },
              { label: t('foster.whatItMeans.supportLabel'), value: t('foster.whatItMeans.supportValue') },
            ]"
            :key="item.label"
            class="flex items-start gap-4"
          >
            <span class="mt-1.5 w-2 h-2 rounded-full bg-coral flex-shrink-0" aria-hidden="true"></span>
            <div>
              <p class="font-bold text-heading text-sm uppercase tracking-wide mb-1">{{ item.label }}</p>
              <p class="text-ink text-sm leading-relaxed">{{ item.value }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       HOW IT WORKS
  ═══════════════════════════════════════════════ -->
  <section class="bg-sand py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3 text-center">
        {{ t('foster.howItWorks.eyebrow') }}
      </p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-12 text-center">
        {{ t('foster.howItWorks.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div
          v-for="(step, i) in [
            { title: t('foster.howItWorks.step1Title'), note: t('foster.howItWorks.step1Note') },
            { title: t('foster.howItWorks.step2Title'), note: t('foster.howItWorks.step2Note') },
            { title: t('foster.howItWorks.step3Title'), note: t('foster.howItWorks.step3Note') },
          ]"
          :key="i"
          class="flex items-start gap-4"
        >
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-coral text-white text-sm font-bold flex items-center justify-center">
            {{ i + 1 }}
          </span>
          <div>
            <p class="font-semibold text-heading mb-1">{{ step.title }}</p>
            <p class="text-sm text-muted leading-relaxed">{{ step.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       ANIMALS GRID
  ═══════════════════════════════════════════════ -->
  <section class="bg-white py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">
        {{ t('foster.animals.eyebrow') }}
      </p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-10">
        {{ t('foster.animals.title') }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <AnimalCard
          v-for="(animal, i) in availableAnimals"
          :key="animal._id"
          :animal="animal"
          :eager="i < 3"
        />
      </div>

      <div class="text-center">
        <NuxtLink
          :to="localePath('/animals')"
          class="inline-block text-sm font-semibold text-coral hover:text-coral-dark transition-colors"
        >
          {{ t('foster.animals.seeAll') }}
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       CONTACT FORM
  ═══════════════════════════════════════════════ -->
  <section class="bg-sand py-16 md:py-20">
    <div class="max-w-5xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">
        {{ t('foster.form.eyebrow') }}
      </p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-3">
        {{ t('foster.form.title') }}
      </h2>
      <p class="text-muted mb-10 max-w-xl">{{ t('foster.form.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        <!-- Form -->
        <div>
          <form v-if="formState !== 'success'" class="flex flex-col gap-4" @submit.prevent="submitFoster">
            <!-- Honeypot — hidden from real users -->
            <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />

            <input
              v-model="form.name"
              type="text"
              :placeholder="t('foster.form.name')"
              required
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            <input
              v-model="form.email"
              type="email"
              :placeholder="t('foster.form.email')"
              required
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            <textarea
              v-model="form.message"
              :placeholder="t('foster.form.message')"
              rows="7"
              required
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent resize-none"
            />

            <p v-if="formState === 'error'" class="text-sm text-danger">{{ t('foster.form.error') }}</p>

            <button
              type="submit"
              :disabled="formState === 'sending'"
              class="bg-coral hover:bg-coral-dark disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150 self-start cursor-pointer"
            >
              {{ formState === 'sending' ? '…' : t('foster.form.send') }}
            </button>
          </form>

          <div v-else class="py-8">
            <p class="text-lg font-medium text-teal">{{ t('foster.form.success') }}</p>
          </div>
        </div>

        <!-- Tips card -->
        <div class="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-black/5">
          <p class="text-[11px] font-semibold uppercase tracking-widest text-coral mb-5">
            {{ t('foster.form.tipsLabel') }}
          </p>
          <ul class="flex flex-col gap-5">
            <li
              v-for="tip in [
                { icon: '🏠', text: t('foster.form.tip1') },
                { icon: '📅', text: t('foster.form.tip2') },
                { icon: '🐾', text: t('foster.form.tip3') },
                { icon: '💙', text: t('foster.form.tip4') },
              ]"
              :key="tip.text"
              class="flex items-start gap-3"
            >
              <span class="text-xl flex-shrink-0" aria-hidden="true">{{ tip.icon }}</span>
              <p class="text-sm text-ink leading-relaxed">{{ tip.text }}</p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>
</template>
