// Set instagramUrl on the 4 @ericeira.paws success-story records.
// Uses the Sanity HTTP API directly (no SDK / node_modules needed).
//   SANITY_TOKEN=sk... node scripts/set-instagram-urls.mjs

const TOKEN = process.env.SANITY_TOKEN
if (!TOKEN) {
  console.error('Error: SANITY_TOKEN env var is not set.')
  process.exit(1)
}

const PROJECT = 'j0v2zcj0'
const DATASET = 'production'
const API = `https://${PROJECT}.api.sanity.io/v2021-10-21`
const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }

// Map success-story slug -> @ericeira.paws "Adoption Success Story" post
const URLS = {
  'blu-pablo': 'https://www.instagram.com/p/DPBlr4tikyQ/',
  'naga': 'https://www.instagram.com/p/DOqSxB4DbQA/',
  'finn': 'https://www.instagram.com/p/DOYnxykCD3o/',
  'pido': 'https://www.instagram.com/p/DOGmmxpCMrh/',
}
const slugs = Object.keys(URLS)

// 1. Resolve slugs -> document ids
const groq = encodeURIComponent(
  `*[_type == "animal" && slug.current in ${JSON.stringify(slugs)}]{ _id, "slug": slug.current }`,
)
const qres = await fetch(`${API}/data/query/${DATASET}?query=${groq}`, { headers })
if (!qres.ok) throw new Error(`Query failed: ${qres.status} ${await qres.text()}`)
const { result: docs } = await qres.json()

const missing = slugs.filter((s) => !docs.some((d) => d.slug === s))
if (missing.length) console.warn('No record found for slug(s):', missing.join(', '))

// 2. Patch each record
const mutations = docs.map((d) => {
  console.log(`Patching ${d.slug} (${d._id}) -> ${URLS[d.slug]}`)
  return { patch: { id: d._id, set: { instagramUrl: URLS[d.slug] } } }
})

const mres = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ mutations }),
})
if (!mres.ok) throw new Error(`Mutate failed: ${mres.status} ${await mres.text()}`)
console.log(`Done — set instagramUrl on ${mutations.length} record(s).`)
