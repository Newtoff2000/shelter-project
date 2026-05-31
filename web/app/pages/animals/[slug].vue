<script setup lang="ts">
import { getAgeGroup, getTimeAtShelter, AGE_GROUP_LABELS, TIME_AT_SHELTER_LABELS } from '~/composables/useAnimalHelpers'

const route = useRoute()
const slug = route.params.slug as string
const localePath = useLocalePath()

const ANIMAL_QUERY = `*[_type == "animal" && slug.current == $slug][0] {
  name,
  "slug": slug.current,
  status,
  species,
  gender,
  ageYears,
  size,
  dateJoined,
  neutered,
  "coverPhotoUrl": coverPhoto.asset->url,
  "coverPhotoAlt": coverPhoto.alt,
  "photos": photos[]{
    "url": asset->url,
    alt
  },
  videoUrl,
  quickFacts,
  personality,
  history,
  health,
  interestingFacts
}`

const sanity = useSanity()
const { data: animal, pending } = useAsyncData(`animal-${slug}`, () =>
  sanity.fetch<any>(ANIMAL_QUERY, { slug }),
)

// Extract plain text from Sanity portable text blocks
function blocksToText(blocks: any): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children ?? []).map((c: any) => c.text ?? '').join(''))
    .join('\n\n')
}

function localizedText(field: any): string {
  if (!field) return ''
  return blocksToText(field.en) || blocksToText(field.pt) || ''
}

const ageGroup = computed(() => animal.value ? getAgeGroup(animal.value.ageYears) : 'young')
const timeAtShelter = computed(() => animal.value ? getTimeAtShelter(animal.value.dateJoined) : 'less_than_1')
const interestSubject = computed(() => `I'm interested in ${animal.value?.name ?? ''}`)
</script>

<template>
  <div class="profile">

    <!-- Back -->
    <div class="back">
      <NuxtLink :to="localePath('/')">← Back to all animals</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="loading">Loading...</div>

    <!-- Not found -->
    <div v-else-if="!animal" class="not-found">
      <p>Animal not found.</p>
      <NuxtLink :to="localePath('/')">← Back to all animals</NuxtLink>
    </div>

    <template v-else-if="animal">

      <!-- Hero -->
      <div class="hero">
        <img
          v-if="animal.coverPhotoUrl"
          :src="animal.coverPhotoUrl"
          :alt="animal.coverPhotoAlt || animal.name"
          class="hero-img"
        />
        <div v-else class="hero-placeholder">🐾</div>
        <div class="hero-overlay">
          <h1>{{ animal.name }}</h1>
          <span class="badge" :class="animal.status">{{ animal.status }}</span>
        </div>
      </div>

      <div class="content">

        <!-- Basic info -->
        <section class="card">
          <h2>About {{ animal.name }}</h2>
          <dl class="info-grid">
            <div>
              <dt>Species</dt>
              <dd>{{ animal.species === 'dog' ? '🐶 Dog' : '🐱 Cat' }}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{{ animal.gender === 'male' ? 'Male' : 'Female' }}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{{ animal.ageYears }} year{{ animal.ageYears !== 1 ? 's' : '' }} ({{ AGE_GROUP_LABELS[ageGroup] }})</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{{ animal.size ? animal.size.charAt(0).toUpperCase() + animal.size.slice(1) : '' }}</dd>
            </div>
            <div>
              <dt>At shelter</dt>
              <dd>{{ TIME_AT_SHELTER_LABELS[timeAtShelter] }}</dd>
            </div>
            <div>
              <dt>Neutered</dt>
              <dd>{{ animal.neutered ? 'Yes' : 'No' }}</dd>
            </div>
          </dl>
        </section>

        <!-- Quick facts -->
        <section v-if="animal.quickFacts?.length" class="card">
          <h2>Quick facts</h2>
          <ul class="quick-facts">
            <li v-for="(fact, i) in animal.quickFacts" :key="i">
              {{ fact.en || fact.pt }}
            </li>
          </ul>
        </section>

        <!-- I'm interested CTA -->
        <section class="card cta-card">
          <h2>Interested in {{ animal.name }}?</h2>
          <p>Send us a message and we'll get back to you as soon as possible.</p>
          <a :href="localePath('/') + '#contact'" class="btn-primary">
            I'm interested in {{ animal.name }}
          </a>
        </section>

        <!-- Video -->
        <section v-if="animal.videoUrl" class="card">
          <h2>Video</h2>
          <a :href="animal.videoUrl" target="_blank" rel="noopener" class="video-link">
            ▶ Watch video
          </a>
        </section>

        <!-- Personality -->
        <section v-if="localizedText(animal.personality)" class="card">
          <h2>Personality</h2>
          <div class="rich-text" v-html="localizedText(animal.personality).replace(/\n\n/g, '<br><br>')" />
        </section>

        <!-- History -->
        <section v-if="localizedText(animal.history)" class="card">
          <h2>History</h2>
          <div class="rich-text" v-html="localizedText(animal.history).replace(/\n\n/g, '<br><br>')" />
        </section>

        <!-- Health -->
        <section v-if="localizedText(animal.health)" class="card">
          <h2>Health</h2>
          <div class="rich-text" v-html="localizedText(animal.health).replace(/\n\n/g, '<br><br>')" />
        </section>

        <!-- Interesting facts -->
        <section v-if="localizedText(animal.interestingFacts)" class="card">
          <h2>Interesting facts</h2>
          <div class="rich-text" v-html="localizedText(animal.interestingFacts).replace(/\n\n/g, '<br><br>')" />
        </section>

        <!-- Gallery -->
        <section v-if="animal.photos?.length" class="card">
          <h2>Photo gallery</h2>
          <div class="gallery">
            <img
              v-for="(photo, i) in animal.photos"
              :key="i"
              :src="photo.url"
              :alt="photo.alt || animal.name"
            />
          </div>
        </section>

      </div>
    </template>
  </div>
</template>

<style scoped>
.profile { font-family: sans-serif; color: #222; max-width: 800px; margin: 0 auto; padding-bottom: 60px; }

.back { padding: 16px 24px; }
.back a { color: #e07b54; text-decoration: none; font-size: 0.95rem; }
.back a:hover { text-decoration: underline; }

.loading { padding: 60px 24px; text-align: center; color: #999; }
.not-found { padding: 60px 24px; text-align: center; color: #999; }

/* Hero */
.hero { position: relative; }
.hero-img { width: 100%; height: 420px; object-fit: cover; display: block; }
.hero-placeholder {
  width: 100%; height: 420px; background: #f0ece8;
  display: flex; align-items: center; justify-content: center; font-size: 5rem;
}
.hero-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  padding: 32px 24px 24px;
}
.hero-overlay h1 { color: #fff; margin: 0 0 8px; font-size: 2.2rem; }

.badge {
  font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;
  text-transform: capitalize; font-weight: 600;
}
.badge.available { background: #e6f4ea; color: #2e7d32; }
.badge.reserved  { background: #fff3e0; color: #e65100; }
.badge.adopted   { background: #e8eaf6; color: #3949ab; }

/* Content */
.content { padding: 0 24px; }
.card {
  background: #fff; border: 1px solid #eee; border-radius: 12px;
  padding: 28px; margin-top: 24px;
}
.card h2 { margin: 0 0 20px; font-size: 1.3rem; }

/* Info grid */
.info-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px; margin: 0;
}
.info-grid div { display: flex; flex-direction: column; gap: 4px; }
dt { font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 0.05em; }
dd { font-size: 1rem; font-weight: 500; margin: 0; }

/* Quick facts */
.quick-facts { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.quick-facts li::before { content: '✓ '; color: #e07b54; font-weight: bold; }

/* CTA */
.cta-card { text-align: center; background: #fdf6f2; }
.cta-card p { color: #666; margin-bottom: 20px; }

/* Video */
.video-link {
  display: inline-block; color: #e07b54; text-decoration: none;
  font-weight: 600; font-size: 1rem;
}
.video-link:hover { text-decoration: underline; }

/* Rich text */
.rich-text { line-height: 1.7; color: #444; }

/* Gallery */
.gallery {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;
}
.gallery img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; }

/* Button */
.btn-primary {
  display: inline-block; background: #e07b54; color: #fff;
  padding: 12px 28px; border-radius: 8px; font-size: 1rem;
  text-decoration: none; font-weight: 600;
}
.btn-primary:hover { background: #c9673f; }
</style>
