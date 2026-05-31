<script setup lang="ts">
import { getAgeGroup, getTimeAtShelter } from '~/composables/useAnimalHelpers'

const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale, t } = useI18n()

const { data: animals, pending } = useFetch<any[]>('/api/animals')
const { data: settings } = useFetch<any>('/api/site-settings')

const lang = computed(() => (locale.value === 'pt' ? 'pt' : 'en'))

const heroHeadline = computed(() => {
  const fromCms = settings.value?.heroHeadline?.[lang.value]
  return fromCms || t('hero.headlineFallback')
})
const heroPhotoUrl = computed(() => settings.value?.heroPhotoUrl)
const instagramUrl = computed(() => settings.value?.instagramUrl)

// Filters
const filterSpecies = ref('')
const filterGender = ref('')
const filterAgeGroup = ref('')
const filterSize = ref('')
const filterTimeAtShelter = ref('')

const filteredAnimals = computed(() => {
  const list = Array.isArray(animals.value) ? animals.value : []
  return list
    .filter((a) => a.status !== 'adopted')
    .filter((a) => !filterSpecies.value || a.species === filterSpecies.value)
    .filter((a) => !filterGender.value || a.gender === filterGender.value)
    .filter((a) => !filterAgeGroup.value || getAgeGroup(a.ageYears) === filterAgeGroup.value)
    .filter((a) => !filterSize.value || a.size === filterSize.value)
    .filter((a) => !filterTimeAtShelter.value || getTimeAtShelter(a.dateJoined) === filterTimeAtShelter.value)
})

function clearFilters() {
  filterSpecies.value = ''
  filterGender.value = ''
  filterAgeGroup.value = ''
  filterSize.value = ''
  filterTimeAtShelter.value = ''
}
</script>

<template>
  <div class="page">

    <!-- Top bar -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          <a v-if="instagramUrl" :href="instagramUrl" target="_blank" rel="noopener" class="social">
            Instagram
          </a>
        </div>
        <nav class="lang-switcher">
          <NuxtLink :to="switchLocalePath('pt')" :class="{ active: locale === 'pt' }">PT</NuxtLink>
          <span>·</span>
          <NuxtLink :to="switchLocalePath('en')" :class="{ active: locale === 'en' }">EN</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero" :style="heroPhotoUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${heroPhotoUrl})` } : {}">
      <div class="hero-content" :class="{ 'on-photo': heroPhotoUrl }">
        <h1>{{ heroHeadline }}</h1>
        <p>{{ t('hero.subtitle') }}</p>
        <a href="#animals" class="btn-primary">{{ t('hero.cta') }}</a>
      </div>
    </section>

    <!-- Animal Feed -->
    <section id="animals" class="feed">
      <h2>{{ t('feed.title') }}</h2>

      <!-- Filters -->
      <div class="filters">
        <select v-model="filterSpecies">
          <option value="">{{ t('filters.allSpecies') }}</option>
          <option value="dog">{{ t('filters.dogs') }}</option>
          <option value="cat">{{ t('filters.cats') }}</option>
        </select>

        <select v-model="filterGender">
          <option value="">{{ t('filters.anyGender') }}</option>
          <option value="male">{{ t('filters.male') }}</option>
          <option value="female">{{ t('filters.female') }}</option>
        </select>

        <select v-model="filterAgeGroup">
          <option value="">{{ t('filters.anyAge') }}</option>
          <option value="young">{{ t('filters.young') }}</option>
          <option value="middle">{{ t('filters.middle') }}</option>
          <option value="senior">{{ t('filters.senior') }}</option>
        </select>

        <select v-model="filterSize">
          <option value="">{{ t('filters.anySize') }}</option>
          <option value="small">{{ t('filters.small') }}</option>
          <option value="medium">{{ t('filters.medium') }}</option>
          <option value="large">{{ t('filters.large') }}</option>
        </select>

        <select v-model="filterTimeAtShelter">
          <option value="">{{ t('filters.anyTime') }}</option>
          <option value="less_than_1">{{ t('filters.lessThan1') }}</option>
          <option value="1_year">{{ t('filters.year1') }}</option>
          <option value="2_years">{{ t('filters.year2') }}</option>
          <option value="3_plus">{{ t('filters.year3plus') }}</option>
        </select>

        <button v-if="filterSpecies || filterGender || filterAgeGroup || filterSize || filterTimeAtShelter" class="btn-clear" @click="clearFilters">
          {{ t('feed.clearFilters') }}
        </button>
      </div>

      <!-- Grid -->
      <div v-if="pending" class="loading">{{ t('feed.loading') }}</div>
      <div v-else-if="filteredAnimals.length" class="grid">
        <NuxtLink
          v-for="animal in filteredAnimals"
          :key="animal._id"
          :to="localePath(`/animals/${animal.slug}`)"
          class="card"
        >
          <div class="card-img">
            <img v-if="animal.coverPhotoUrl" :src="animal.coverPhotoUrl" :alt="animal.name" />
            <div v-else class="card-img-placeholder">🐾</div>
          </div>
          <div class="card-body">
            <h3>{{ animal.name }}</h3>
            <p class="card-meta">
              {{ animal.species === 'dog' ? t('card.dog') : t('card.cat') }} ·
              {{ animal.gender === 'male' ? t('filters.male') : t('filters.female') }} ·
              {{ animal.ageYears }}{{ locale === 'en' ? '' : ' ' }}{{ t('card.years') }}
            </p>
            <span class="badge" :class="animal.status">{{ t(`status.${animal.status}`) }}</span>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="empty">{{ t('feed.empty') }}</p>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact">
      <h2>{{ t('contact.title') }}</h2>
      <p>{{ t('contact.subtitle') }}</p>
      <form class="contact-form">
        <input type="text" :placeholder="t('contact.name')" />
        <input type="email" :placeholder="t('contact.email')" />
        <textarea :placeholder="t('contact.message')" rows="4" />
        <button type="submit" class="btn-primary">{{ t('contact.send') }}</button>
      </form>
    </section>

  </div>
</template>

<style scoped>
.page { font-family: sans-serif; color: #222; }

/* Top bar */
.topbar { background: #fff; border-bottom: 1px solid #eee; }
.topbar-inner {
  display: flex; justify-content: space-between; align-items: center;
  max-width: 1100px; margin: 0 auto; padding: 12px 24px;
}
.topbar-left .social {
  color: #555; text-decoration: none; font-size: 0.9rem;
}
.topbar-left .social:hover { color: #e07b54; }
.lang-switcher { display: flex; gap: 6px; align-items: center; font-size: 0.9rem; }
.lang-switcher a { color: #999; text-decoration: none; padding: 2px 6px; border-radius: 4px; }
.lang-switcher a.active { color: #222; font-weight: 600; }
.lang-switcher a:hover { color: #e07b54; }
.lang-switcher span { color: #ccc; }

/* Hero */
.hero {
  background: #f5f0eb;
  padding: 80px 24px;
  text-align: center;
  background-size: cover;
  background-position: center;
}
.hero-content { max-width: 700px; margin: 0 auto; }
.hero-content.on-photo h1, .hero-content.on-photo p { color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
.hero h1 { font-size: 2.5rem; margin: 0 0 16px; }
.hero p { font-size: 1.1rem; color: #555; margin: 0 0 32px; }

/* Feed */
.feed { padding: 60px 24px; max-width: 1100px; margin: 0 auto; }
.feed h2 { font-size: 1.8rem; margin-bottom: 24px; }

/* Filters */
.filters { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
.filters select {
  padding: 8px 12px; border: 1px solid #ccc; border-radius: 8px;
  background: #fff; font-size: 0.9rem; cursor: pointer;
}
.btn-clear {
  padding: 8px 16px; border: 1px solid #ccc; border-radius: 8px;
  background: #fff; cursor: pointer; font-size: 0.9rem; color: #666;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}
.card {
  border-radius: 12px; overflow: hidden; border: 1px solid #eee;
  text-decoration: none; color: inherit;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.card-img img { width: 100%; height: 200px; object-fit: cover; display: block; }
.card-img-placeholder {
  width: 100%; height: 200px; background: #f0ece8;
  display: flex; align-items: center; justify-content: center; font-size: 3rem;
}
.card-body { padding: 14px; }
.card-body h3 { margin: 0 0 4px; font-size: 1.1rem; }
.card-meta { font-size: 0.85rem; color: #777; margin: 0 0 10px; }
.badge {
  font-size: 0.75rem; padding: 3px 10px; border-radius: 20px;
  font-weight: 600;
}
.badge.available { background: #e6f4ea; color: #2e7d32; }
.badge.reserved  { background: #fff3e0; color: #e65100; }
.badge.adopted   { background: #e8eaf6; color: #3949ab; }

.empty, .loading { color: #999; font-size: 1rem; }

/* Contact */
.contact {
  background: #f5f0eb; padding: 60px 24px; text-align: center;
}
.contact h2 { font-size: 1.8rem; margin-bottom: 8px; }
.contact p { color: #555; margin-bottom: 32px; }
.contact-form {
  display: flex; flex-direction: column; gap: 12px;
  max-width: 480px; margin: 0 auto; text-align: left;
}
.contact-form input,
.contact-form textarea {
  padding: 10px 14px; border: 1px solid #ccc; border-radius: 8px;
  font-size: 1rem; width: 100%; box-sizing: border-box;
}

/* Buttons */
.btn-primary {
  display: inline-block; background: #e07b54; color: #fff;
  padding: 12px 28px; border-radius: 8px; font-size: 1rem;
  text-decoration: none; border: none; cursor: pointer; font-weight: 600;
}
.btn-primary:hover { background: #c9673f; }
</style>
