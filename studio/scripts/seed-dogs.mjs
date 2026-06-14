import { createClient } from '@sanity/client'
import { randomUUID } from 'crypto'

const TOKEN = process.env.SANITY_TOKEN
if (!TOKEN) {
  console.error('Error: SANITY_TOKEN env var is not set.')
  console.error('Run: SANITY_TOKEN=sk... node scripts/seed-dogs.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: 'j0v2zcj0',
  dataset: 'production',
  token: TOKEN,
  apiVersion: '2021-10-21',
  useCdn: false,
})

const key = () => randomUUID().replace(/-/g, '').slice(0, 8)

function block(text) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

function blocks(...texts) {
  return texts.map(block)
}

function fact(en) {
  return { _key: key(), pt: '', en }
}

// ---------------------------------------------------------------------------
// PATCHES — 7 dogs already in Sanity, enriched with age + content
// ---------------------------------------------------------------------------

const PATCHES = [
  {
    slug: 'joca',
    ageYears: 8,
    personalityTraits: ['gentle', 'affectionate', 'friendly'],
    shortQuote: { pt: '', en: 'I just need a calm home and someone to cuddle with.' },
    personality: {
      en: blocks(
        "Gentle and friendly — nervous in the kennel but loving one-on-one. Absolutely loves affection and being close to people. Spend time with him and you'll quickly see his true nature: a sweet boy who just wants to feel safe."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Joca was found wandering the streets and brought to safety. Now he's waiting for a new chapter — one filled with love, security, and lots of cuddles."
      ),
      pt: [],
    },
    quickFacts: [fact('Loves cuddles and affection'), fact('Needs a calm, patient home'), fact('8 years young')],
  },
  {
    slug: 'duke',
    ageYears: 11,
    personalityTraits: ['gentle', 'affectionate', 'playful'],
    shortQuote: { pt: '', en: 'Treats are the way to my heart — and cuddles come close.' },
    personality: {
      en: blocks(
        "Incredibly affectionate and trusting despite everything he's been through. Food-motivated — treats go a long way! His playful side begins to shine once he feels safe and settled."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Duke once had an owner who loved him, but sadly couldn't continue caring for him due to experiencing homelessness. Through no fault of his own, he found himself at the shelter. He has a facial injury that is currently healing."
      ),
      pt: [],
    },
    quickFacts: [
      fact('Food-motivated — treats are the way to his heart'),
      fact('Facial injury currently healing'),
      fact('Would thrive in a calm, loving home'),
    ],
  },
  {
    slug: 'mel',
    ageYears: 1,
    size: 'large',
    personalityTraits: ['energetic', 'playful', 'affectionate', 'friendly'],
    shortQuote: { pt: '', en: 'Fetch? Always. Cuddles after? Absolutely.' },
    personality: {
      en: blocks(
        "Big, gentle giant with a heart as soft as her eyes. Strong and beautifully muscular — she'll benefit from some lead training, but her eagerness to please means she'll pick it up in no time. Happiest when moving, exploring, and soaking up affection."
      ),
      pt: [],
    },
    history: {
      en: blocks('Mel was found in Ribamar at around 1 year old, and is now ready for her next chapter.'),
      pt: [],
    },
    quickFacts: [fact('Loves playing fetch'), fact('Benefits from lead training'), fact('Suits an active family')],
  },
  {
    slug: 'loki',
    ageYears: 2,
    personalityTraits: ['calm', 'curious', 'independent'],
    shortQuote: {
      pt: '',
      en: "I've been through a lot — I just need someone steady to show me what home feels like.",
    },
    personality: {
      en: blocks(
        "Calm, curious, and appreciative of every bit of kindness. Friendly with everyone who has cared for him. Prefers to be the only dog — his independent spirit thrives with someone confident and steady who can give him the guidance and structure he deserves."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Loki came to us after a call about an injured dog on the street. He had two wounds on his back legs that required stitches. He arrived skinny, injured, and alone — but has healed beautifully and is ready for a future filled with safety and love."
      ),
      pt: [],
    },
    quickFacts: [
      fact('Prefers to be the only dog'),
      fact('Calm and curious'),
      fact('Came to us injured from the street — now fully healed'),
    ],
  },
  {
    slug: 'taxi',
    personalityTraits: ['energetic', 'independent'],
    shortQuote: { pt: '', en: "Give me time and space, and I'll show you who I really am." },
    personality: {
      en: blocks(
        "Lively little soul with a big personality and plenty of energy to share. Loves movement and back cuddles. Still learning to trust — especially around his neck and head — so needs a calm, experienced handler who understands canine boundaries. With patience and consistency, he has so much potential to blossom."
      ),
      pt: [],
    },
    quickFacts: [
      fact('Best with experienced dog owners'),
      fact('Loves back cuddles'),
      fact('Needs patient, consistent handling'),
    ],
  },
  {
    slug: 'caju',
    dateJoined: '2025-05-01',
    personalityTraits: ['affectionate', 'friendly', 'calm'],
    shortQuote: { pt: '', en: "I've been waiting patiently. I just want a home to call my own." },
    personality: {
      en: blocks(
        "Absolutely loves humans and thrives on affection. Enjoys walks, treats, exploring new smells, and a good run when the mood strikes. The kind of dog who fits happily into family life or becomes your loyal sidekick."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Caju has been waiting patiently in the shelter since May 2025, dreaming of something simple: a home of his own."
      ),
      pt: [],
    },
    quickFacts: [
      fact('In shelter since May 2025'),
      fact('Loves walks, treats, and new smells'),
      fact('Great family companion'),
    ],
  },
  {
    slug: 'rex',
    ageYears: 2,
    personalityTraits: ['energetic', 'playful', 'friendly', 'good_with_dogs'],
    shortQuote: { pt: '', en: "I love to run, I love to play, and I'll love you unconditionally." },
    personality: {
      en: blocks(
        "Joyful and full of energy. Loves to run, play outside, and soak up every bit of freedom beyond the shelter walls. Incredibly positive, affectionate, and always ready for fun. Very social — gets along well with both people and other dogs."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Rex used to be a hunting dog, so he thrives with space and regular activity to help him release his energy."
      ),
      pt: [],
    },
    quickFacts: [
      fact('Good with other dogs'),
      fact('Ex-hunting dog — loves space and activity'),
      fact('Around 2–3 years old'),
    ],
  },
]

// ---------------------------------------------------------------------------
// NEW DOGS — 9 dogs from the CSV not yet in Sanity
// ---------------------------------------------------------------------------

const NEW_DOGS = [
  {
    name: 'Ben',
    slug: { _type: 'slug', current: 'ben' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 6,
    size: 'medium',
    personalityTraits: ['gentle', 'affectionate', 'calm'],
    shortQuote: {
      pt: '',
      en: "I'm still figuring things out. I just need someone patient by my side.",
    },
    personality: {
      en: blocks(
        "Gentle and sweet soul. Scared in the kennel, but once outside he's a much more confident, happy boy. With volunteers he trusts, his personality really shines — he even does little happy hops when running around. Very gentle with treats, and just needs a bit of patience and reassurance."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Ben's world changed suddenly when his owner passed away at the end of 2025. He was sadly left alone in the house for a few days before being discovered and brought to the shelter. His chip lists him as born around 2020."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Lost his home when his owner passed away"),
      fact("Confident and happy outside the kennel"),
      fact("Does the sweetest little happy hops!"),
    ],
  },
  {
    name: 'Willa',
    slug: { _type: 'slug', current: 'willa' },
    species: 'dog',
    status: 'available',
    gender: 'female',
    ageYears: 0,
    size: 'medium',
    personalityTraits: ['friendly', 'affectionate', 'playful'],
    shortQuote: { pt: '', en: "I'm only 9 months old and already can't wait to love you." },
    personality: {
      en: blocks(
        "Incredibly sweet, friendly, and eager to learn. Trusts anyone she meets. Full of puppy energy and potential — even if you can't be her forever home, fostering her until that's found would be amazing."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Found on the streets with her sister. Her sister has since been adopted — Willa is still waiting for her person."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Only 9 months old"),
      fact("Sister has been adopted — Willa is next!"),
      fact("Loves and trusts everyone she meets"),
    ],
  },
  {
    name: 'Átila',
    slug: { _type: 'slug', current: 'atila' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 5,
    size: 'medium',
    personalityTraits: ['affectionate', 'friendly', 'playful'],
    shortQuote: { pt: '', en: "Despite everything, I still trust people with my whole heart." },
    personality: {
      en: blocks(
        "Cuddly, playful, and full of joy. Lights up when he's outside and has freedom beyond the shelter walls. Adores people and welcomes affection with his whole heart. Prefers to be the only dog — though with time and patience he has potential to grow more comfortable around others."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Found on the street in very poor condition — skinny and without any history. Despite everything he's been through, he still trusts humans deeply."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Found in very poor condition on the street"),
      fact("Loves people and cuddles"),
      fact("Prefers to be the only dog"),
    ],
  },
  {
    name: 'Pimpo',
    slug: { _type: 'slug', current: 'pimpo' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 8,
    size: 'large',
    personalityTraits: ['affectionate', 'gentle', 'independent'],
    shortQuote: {
      pt: '',
      en: "It took time to trust again — but once I do, I'm yours forever.",
    },
    personality: {
      en: blocks(
        "Majestic Alaskan Malamute — 45kg with a thick black-and-white coat and a proud straight tail. Loyal and affectionate with people he knows; loves snacks, treats, and a good back scratch.",
        "Walks well on the leash and hasn't shown reactivity toward other dogs. Needs an experienced dog owner with confidence and consistency — with the right person, he has the potential to become the most devoted friend you could ask for."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Found chained and muzzled in the woods, scared and unsure of people. After nearly a year in the shelter, a few dedicated volunteers earned his trust — and he's been showing his true colours ever since: loyal, affectionate, and incredibly sweet."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Alaskan Malamute, 45 kg"),
      fact("Best with experienced dog owners"),
      fact("Walks well on the leash"),
    ],
  },
  {
    name: 'Zouk',
    slug: { _type: 'slug', current: 'zouk' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 8,
    size: 'medium',
    personalityTraits: ['gentle', 'affectionate', 'calm'],
    shortQuote: { pt: '', en: "I miss having a family. I'd make the most loyal companion." },
    personality: {
      en: blocks(
        "Gentle, fluffy, and incredibly loving. Comfortable with every volunteer and leans in for affection at any chance he gets. You can feel how much he misses being part of a family. He deserves someone who sees the loyal, older soul behind his eyes."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Zouk's owner became very ill and couldn't keep him. Through no fault of his own, this sweet boy went from a loving home to a shelter cage — a hard change that he feels deeply."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Lost his home when his owner became ill"),
      fact("Gentle and very affectionate"),
      fact("Loves walks and being close to people"),
    ],
  },
  {
    name: 'Thumper',
    slug: { _type: 'slug', current: 'thumper' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 1,
    size: 'medium',
    personalityTraits: ['affectionate', 'playful', 'energetic', 'friendly'],
    shortQuote: { pt: '', en: "15 months in a shelter. All I need is one chance." },
    personality: {
      en: blocks(
        "Young, affectionate, and playful boy who adores people and loves nothing more than to run, play, and share cuddles. Full of joy and energy — every wag of his tail shows how resilient and loving he is. Can be a little selective with other dogs, but with time and patience he can absolutely learn to trust."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Found abandoned on the street — tied to a post — and brought to the shelter. It's been fifteen long months since then, and he's still waiting for someone to give him the love and home he truly deserves."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Found tied to a post on the street"),
      fact("Has been at the shelter for 15 months"),
      fact("Full of joy and energy"),
    ],
  },
  {
    name: 'Príncipe',
    slug: { _type: 'slug', current: 'principe' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 3,
    size: 'medium',
    personalityTraits: ['friendly', 'affectionate', 'energetic', 'curious'],
    shortQuote: {
      pt: '',
      en: "I've been learning so fast. Imagine what I could do with you.",
    },
    personality: {
      en: blocks(
        "Smart, eager to please, and incredibly fast to learn. Now walks well on the lead — especially when given focus and direction. Absolutely loves people and will happily soak up all the cuddles you have to give. Full of potential and ready to shine in the right home."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Found wandering alone in Ericeira, nervous and unsure of the world. Thanks to training sessions, he's learning fast and has made amazing progress. Even with the challenges of kennel life, his true character is shining through — imagine what he could achieve with a real home."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Smart and learns incredibly fast"),
      fact("Walks well on the lead"),
      fact("Loves people and is full of potential"),
    ],
  },
  {
    name: 'Benson',
    slug: { _type: 'slug', current: 'benson' },
    species: 'dog',
    status: 'available',
    gender: 'male',
    ageYears: 7,
    size: 'large',
    dateJoined: '2023-12-01',
    personalityTraits: ['playful', 'affectionate', 'friendly'],
    shortQuote: {
      pt: '',
      en: "I know tricks. I give the best cuddles. I just need someone to take me home.",
    },
    personality: {
      en: blocks(
        "Handsome, gentle Labrador who is playful, loyal, and full of love. Loves showing off his tricks for a tasty treat and is always eager to make friends. Once he knows you, he showers you with love and devotion — the kind only a Labrador can give."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Benson came to the shelter back in December 2023 and has spent almost two years dreaming of the day someone will see how special he is."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Labrador"),
      fact("In shelter since December 2023"),
      fact("Knows tricks and loves treats"),
    ],
  },
  {
    name: 'Morsa',
    slug: { _type: 'slug', current: 'morsa' },
    species: 'dog',
    status: 'available',
    gender: 'female',
    ageYears: 4,
    size: 'medium',
    dateJoined: '2023-01-01',
    personalityTraits: ['energetic', 'affectionate', 'friendly', 'good_with_dogs'],
    shortQuote: {
      pt: '',
      en: "I've been waiting since 2023. I'm still smiling — are you the one?",
    },
    personality: {
      en: blocks(
        "Joyful, affectionate soul who loves people and the company of other dogs. Endless enthusiasm for walks, playtime, and adventure. Once she's had her playtime, she settles beautifully — calm, gentle, and full of love."
      ),
      pt: [],
    },
    history: {
      en: blocks(
        "Morsa was found alone on the streets in 2023. She's been at the shelter ever since, waiting far too long for her forever home."
      ),
      pt: [],
    },
    quickFacts: [
      fact("Good with other dogs"),
      fact("Found on the streets in 2023"),
      fact("Loves active adventures"),
    ],
  },
]

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

console.log('Fetching existing animals from Sanity...')
const existing = await client.fetch(`*[_type == "animal"]{_id, "slug": slug.current}`)
const bySlug = Object.fromEntries(existing.map((a) => [a.slug, a._id]))
console.log(`Found ${existing.length} existing animals\n`)

console.log('--- Patching existing dogs ---')
for (const patch of PATCHES) {
  const { slug, ...fields } = patch
  const id = bySlug[slug]
  if (!id) {
    console.error(`  ✗ Not found in Sanity: ${slug}`)
    continue
  }
  try {
    await client.patch(id).set(fields).commit()
    console.log(`  ✓ Patched: ${slug}`)
  } catch (err) {
    console.error(`  ✗ Failed to patch ${slug}:`, err.message)
  }
}

console.log('\n--- Creating new dogs ---')
for (const dog of NEW_DOGS) {
  try {
    const doc = await client.create({ _type: 'animal', ...dog })
    console.log(`  ✓ Created: ${dog.name} (${doc._id})`)
  } catch (err) {
    console.error(`  ✗ Failed to create ${dog.name}:`, err.message)
  }
}

console.log('\nDone. Open https://shelter.sanity.studio to verify.')
