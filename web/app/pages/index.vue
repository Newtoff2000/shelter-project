<script setup lang="ts">
import { getAgeGroup, getTimeAtShelter } from '~/composables/useAnimalHelpers'
import type { AgeGroup, TimeAtShelter } from '~/composables/useAnimalHelpers'

const localePath = useLocalePath()

const ANIMALS_QUERY = `*[_type == "animal"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  status,
  species,
  gender,
  ageYears,
  size,
  dateJoined,
  "coverPhotoUrl": coverPhoto.asset->url
}`

const sanity = useSanity()
const { data: animals } = await useAsyncData('animals', () =>
  sanity.fetch<any[]>(ANIMALS_QUERY),
)

// Filters
const filterSpecies = ref<string>('')
const filterGender = ref<string>('')
const filterAgeGroup = ref<string>('')
const filterSize = ref<string>('')
const filterTimeAtShelter = ref<string>('')

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

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1>Every animal deserves a home.</h1>
        <p>We are a shelter in Mafra/Ericeira, Portugal. Meet our animals and give one a forever home.</p>
        <a href="#animals" class="btn-primary">Meet our animals</a>
      </div>
    </section>

    <!-- Animal Feed -->
    <section id="animals" class="feed">
      <h2>Our animals</h2>

      <!-- Filters -->
      <div class="filters">
        <select v-model="filterSpecies">
          <option value="">All species</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
        </select>

        <select v-model="filterGender">
          <option value="">Any gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select v-model="filterAgeGroup">
          <option value="">Any age</option>
          <option value="young">Young (0–2y)</option>
          <option value="middle">Middle-age (3–7y)</option>
          <option value="senior">Senior (8y+)</option>
        </select>

        <select v-model="filterSize">
          <option value="">Any size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <select v-model="filterTimeAtShelter">
          <option value="">Any time at shelter</option>
          <option value="less_than_1">Less than 1 year</option>
          <option value="1_year">1 year</option>
          <option value="2_years">2 years</option>
          <option value="3_plus">3+ years</option>
        </select>

        <button v-if="filterSpecies || filterGender || filterAgeGroup || filterSize || filterTimeAtShelter" class="btn-clear" @click="clearFilters">
          Clear filters
        </button>
      </div>

      <!-- Grid -->
      <div v-if="filteredAnimals.length" class="grid">
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
              {{ animal.species === 'dog' ? 'Dog' : 'Cat' }} ·
              {{ animal.gender === 'male' ? 'Male' : 'Female' }} ·
              {{ animal.ageYears }}y
            </p>
            <span class="badge" :class="animal.status">{{ animal.status }}</span>
          </div>
        </NuxtLink>
      </div>

      <p v-else class="empty">No animals match your filters.</p>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact">
      <h2>Get in touch</h2>
      <p>Have a question? Want to adopt? Send us a message.</p>
      <form class="contact-form">
        <input type="text" placeholder="Your name" />
        <input type="email" placeholder="Your email" />
        <textarea placeholder="Your message" rows="4" />
        <button type="submit" class="btn-primary">Send message</button>
      </form>
    </section>

  </div>
</template>

<style scoped>
.page { font-family: sans-serif; color: #222; }

/* Hero */
.hero {
  background: #f5f0eb;
  padding: 80px 24px;
  text-align: center;
}
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
  text-transform: capitalize; font-weight: 600;
}
.badge.available { background: #e6f4ea; color: #2e7d32; }
.badge.reserved  { background: #fff3e0; color: #e65100; }
.badge.adopted   { background: #e8eaf6; color: #3949ab; }

.empty { color: #999; font-size: 1rem; }

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
