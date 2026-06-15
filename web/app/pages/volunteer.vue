<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const localePath = useLocalePath()

const lang = computed(() => locale.value === 'pt' ? 'pt' : 'en')

useHead({
  title: t('volunteer.meta.title'),
  meta: [
    { name: 'description', content: t('volunteer.meta.description') },
    { property: 'og:title', content: t('volunteer.meta.ogTitle') },
    { property: 'og:description', content: t('volunteer.meta.ogDescription') },
  ],
})

const { data: settings } = await useFetch<any>('/api/site-settings')
const roles = computed(() =>
  Array.isArray(settings.value?.volunteerRoles) ? settings.value.volunteerRoles : [],
)

const form = reactive({
  name: '',
  email: '',
  role: '',
  message: t('volunteer.form.defaultMessage'),
  website: '',
})
const formState = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

function selectRole(roleTitle: string) {
  form.role = roleTitle
  if (import.meta.client) {
    document.getElementById('volunteer-form')?.scrollIntoView({ behavior: 'smooth' })
  }
}

async function submitVolunteer() {
  if (form.website) return
  formState.value = 'sending'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        role: form.role || undefined,
        website: form.website,
      },
    })
    formState.value = 'success'
    Object.assign(form, { name: '', email: '', role: '', message: '' })
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
        {{ t('volunteer.eyebrow') }}
      </p>
      <h1 class="font-display text-5xl md:text-6xl text-heading leading-tight mb-6">
        {{ t('volunteer.title') }}
      </h1>
      <p class="text-muted text-lg leading-relaxed max-w-xl mx-auto">
        {{ t('volunteer.subtitle') }}
      </p>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       TWO WAYS TO HELP
  ═══════════════════════════════════════════════ -->
  <section class="bg-white py-16 md:py-20">
    <div class="max-w-5xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Casual lane -->
        <div class="rounded-2xl bg-sand p-6 sm:p-8 flex flex-col gap-5">
          <p class="text-xs font-semibold uppercase tracking-widest text-coral">
            {{ t('volunteer.casual.eyebrow') }}
          </p>
          <h2 class="font-display text-3xl md:text-4xl text-heading leading-tight">
            {{ t('volunteer.casual.title') }}
          </h2>
          <p class="text-ink leading-relaxed text-sm flex-1">
            {{ t('volunteer.casual.body') }}
          </p>
          <div class="flex flex-col gap-3">
            <a
              href="https://3horas.org/paws/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block self-start bg-coral hover:bg-coral-dark text-white font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm"
            >
              {{ t('volunteer.casual.cta') }}
            </a>
            <p class="text-xs text-muted leading-relaxed">
              {{ t('volunteer.casual.note') }}
            </p>
          </div>
        </div>

        <!-- Team roles lane -->
        <div class="rounded-2xl bg-coral-light p-6 sm:p-8 flex flex-col gap-5">
          <p class="text-xs font-semibold uppercase tracking-widest text-coral">
            {{ t('volunteer.team.eyebrow') }}
          </p>
          <h2 class="font-display text-3xl md:text-4xl text-heading leading-tight">
            {{ t('volunteer.team.title') }}
          </h2>
          <p class="text-ink leading-relaxed text-sm flex-1">
            {{ t('volunteer.team.body') }}
          </p>
          <a
            href="#volunteer-form"
            class="inline-block self-start border-2 border-coral text-coral hover:bg-coral hover:text-white font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm"
          >
            {{ t('volunteer.team.cta') }}
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       OPEN ROLES
  ═══════════════════════════════════════════════ -->
  <section class="bg-sand py-16 md:py-20">
    <div class="max-w-5xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3 text-center">
        {{ t('volunteer.roles.eyebrow') }}
      </p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-12 text-center">
        {{ t('volunteer.roles.title') }}
      </h2>

      <!-- Role cards -->
      <div v-if="roles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(role, i) in roles"
          :key="i"
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col gap-4"
        >
          <div class="flex flex-col gap-1">
            <h3 class="font-display text-2xl text-heading">
              {{ role.title?.[lang] || role.title?.en || role.title?.pt }}
            </h3>
            <p v-if="role.commitment?.[lang] || role.commitment?.en" class="text-xs font-semibold uppercase tracking-widest text-coral">
              <span aria-hidden="true">⏱ </span>{{ role.commitment?.[lang] || role.commitment?.en }}
            </p>
          </div>
          <p class="text-ink text-sm leading-relaxed flex-1">
            {{ role.description?.[lang] || role.description?.en || role.description?.pt }}
          </p>
          <button
            type="button"
            class="self-start border-2 border-coral text-coral hover:bg-coral hover:text-white font-semibold px-5 py-2.5 rounded-full transition-colors duration-150 text-sm cursor-pointer"
            @click="selectRole(role.title?.[lang] || role.title?.en || role.title?.pt || '')"
          >
            {{ t('volunteer.roles.applyBtn') }}
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-2xl p-8 md:p-12 text-center max-w-xl mx-auto border border-black/5">
        <h3 class="font-display text-2xl text-heading mb-3">
          {{ t('volunteer.roles.emptyTitle') }}
        </h3>
        <p class="text-muted text-sm leading-relaxed mb-6">
          {{ t('volunteer.roles.emptyBody') }}
        </p>
        <a
          href="#volunteer-form"
          class="inline-block border-2 border-coral text-coral hover:bg-coral hover:text-white font-semibold px-6 py-3 rounded-full transition-colors duration-150 text-sm"
        >
          {{ t('volunteer.roles.emptyCta') }}
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       APPLICATION FORM
  ═══════════════════════════════════════════════ -->
  <section id="volunteer-form" class="bg-white py-16 md:py-20">
    <div class="max-w-5xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3">
        {{ t('volunteer.form.eyebrow') }}
      </p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-3">
        {{ t('volunteer.form.title') }}
      </h2>
      <p class="text-muted mb-10 max-w-xl">{{ t('volunteer.form.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        <!-- Form -->
        <div>
          <form v-if="formState !== 'success'" class="flex flex-col gap-4" @submit.prevent="submitVolunteer">
            <!-- Honeypot — hidden from real users -->
            <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />

            <input
              v-model="form.name"
              type="text"
              :placeholder="t('volunteer.form.name')"
              required
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            <input
              v-model="form.email"
              type="email"
              :placeholder="t('volunteer.form.email')"
              required
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            <input
              v-model="form.role"
              type="text"
              :placeholder="t('volunteer.form.role')"
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            <textarea
              v-model="form.message"
              :placeholder="t('volunteer.form.message')"
              rows="7"
              required
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent resize-none"
            />

            <p v-if="formState === 'error'" class="text-sm text-danger">{{ t('volunteer.form.error') }}</p>

            <button
              type="submit"
              :disabled="formState === 'sending'"
              class="bg-coral hover:bg-coral-dark disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-full transition-colors duration-150 self-start cursor-pointer"
            >
              {{ formState === 'sending' ? '…' : t('volunteer.form.send') }}
            </button>
          </form>

          <div v-else class="py-8">
            <p class="text-lg font-medium text-teal">{{ t('volunteer.form.success') }}</p>
          </div>
        </div>

        <!-- Why join us card -->
        <div class="rounded-2xl bg-sand p-6 sm:p-8 border border-black/5">
          <p class="text-[11px] font-semibold uppercase tracking-widest text-coral mb-5">
            {{ t('volunteer.form.whyLabel') }}
          </p>
          <ul class="flex flex-col gap-5">
            <li
              v-for="item in [
                { icon: '🐾', text: t('volunteer.form.why1') },
                { icon: '👥', text: t('volunteer.form.why2') },
                { icon: '📱', text: t('volunteer.form.why3') },
                { icon: '🌍', text: t('volunteer.form.why4') },
              ]"
              :key="item.text"
              class="flex items-start gap-3"
            >
              <span class="text-xl flex-shrink-0" aria-hidden="true">{{ item.icon }}</span>
              <p class="text-sm text-ink leading-relaxed">{{ item.text }}</p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════
       FALLBACK CTAs
  ═══════════════════════════════════════════════ -->
  <section class="bg-sand py-16 md:py-20">
    <div class="max-w-5xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-coral mb-3 text-center">
        {{ t('volunteer.more.eyebrow') }}
      </p>
      <h2 class="font-display text-4xl md:text-5xl text-heading mb-10 text-center">
        {{ t('volunteer.more.title') }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          v-for="card in [
            {
              title: t('volunteer.more.adoptTitle'),
              body: t('volunteer.more.adoptBody'),
              cta: t('volunteer.more.adoptCta'),
              to: localePath('/animals'),
            },
            {
              title: t('volunteer.more.fosterTitle'),
              body: t('volunteer.more.fosterBody'),
              cta: t('volunteer.more.fosterCta'),
              to: localePath('/foster'),
            },
            {
              title: t('volunteer.more.donateTitle'),
              body: t('volunteer.more.donateBody'),
              cta: t('volunteer.more.donateCta'),
              to: '/#donate',
            },
          ]"
          :key="card.title"
          class="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-black/5"
        >
          <h3 class="font-semibold text-heading text-lg">{{ card.title }}</h3>
          <p class="text-sm text-muted leading-relaxed flex-1">{{ card.body }}</p>
          <NuxtLink
            :to="card.to"
            class="text-sm font-semibold text-coral hover:text-coral-dark transition-colors"
          >
            {{ card.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
