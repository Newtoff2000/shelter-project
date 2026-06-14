import {defineType, defineField} from 'sanity'

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      {name: 'pt', title: 'Português', type: 'string'},
      {name: 'en', title: 'English', type: 'string'},
    ],
  })

const localizedBlock = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      {name: 'pt', title: 'Português', type: 'blockContent'},
      {name: 'en', title: 'English', type: 'blockContent'},
    ],
  })

// Adopted success-story records (e.g. the @ericeira.paws weekly series) often have
// no feed attributes — make the adoptable-feed fields required only when the animal
// is still available/reserved, not once it's a success story.
const requiredUnlessAdopted = (Rule: any) =>
  Rule.custom((value: unknown, context: any) => {
    if (context.document?.status === 'adopted') return true
    return value === undefined || value === null || value === '' ? 'Required' : true
  })

const onlyAdopted = ({document}: {document?: {status?: string}}) =>
  document?.status !== 'adopted'

export const animal = defineType({
  name: 'animal',
  title: 'Animal',
  type: 'document',
  fields: [
    // — Identity & status —
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Reserved', value: 'reserved'},
          {title: 'Adopted', value: 'adopted'},
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Pin this animal to the top of the feed — use for long-stay animals or urgent cases.',
      initialValue: false,
    }),
    defineField({
      name: 'species',
      title: 'Species',
      type: 'string',
      options: {
        list: [
          {title: 'Dog', value: 'dog'},
          {title: 'Cat', value: 'cat'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverPhoto',
      title: 'Cover Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
      validation: (Rule) => requiredUnlessAdopted(Rule),
    }),

    // — Attributes —
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          {title: 'Male', value: 'male'},
          {title: 'Female', value: 'female'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => requiredUnlessAdopted(Rule),
    }),
    defineField({
      name: 'ageYears',
      title: 'Age (years)',
      type: 'number',
      description: 'Age in years. Age group (young/middle/senior) is computed automatically on the website.',
      validation: (Rule) => requiredUnlessAdopted(Rule).min(0),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => requiredUnlessAdopted(Rule),
    }),
    defineField({
      name: 'dateJoined',
      title: 'Date joined shelter',
      type: 'date',
      validation: (Rule) => requiredUnlessAdopted(Rule),
    }),
    defineField({
      name: 'neutered',
      title: 'Neutered / Spayed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'personalityTraits',
      title: 'Personality Traits',
      type: 'array',
      description: 'Select up to 5 traits. Shown as chips on the animal card and filterable in the feed.',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: '☀️  Friendly',         value: 'friendly'},
          {title: '🌿  Gentle',           value: 'gentle'},
          {title: '😊  Calm',             value: 'calm'},
          {title: '👀  Curious',          value: 'curious'},
          {title: '🐾  Playful',          value: 'playful'},
          {title: '🛡  Independent',      value: 'independent'},
          {title: '❤️  Affectionate',     value: 'affectionate'},
          {title: '⚡  Energetic',        value: 'energetic'},
          {title: '🤝  Good with kids',   value: 'good_with_kids'},
          {title: '🐕  Good with dogs',   value: 'good_with_dogs'},
          {title: '🐱  Good with cats',   value: 'good_with_cats'},
        ],
        layout: 'grid',
      },
      validation: (Rule) => Rule.max(5),
    }),

    // — Gallery & media —
    defineField({
      name: 'photos',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional — YouTube, Instagram, or direct video link',
    }),

    // — Bilingual content —
    defineField({
      name: 'shortQuote',
      title: 'Short Quote',
      description: 'One sentence in the animal\'s voice, shown on their card. e.g. "Loves long walks and meeting every stranger like an old friend."',
      type: 'object',
      fields: [
        {name: 'pt', title: 'Português', type: 'string'},
        {name: 'en', title: 'English',   type: 'string'},
      ],
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'array',
      description: 'Short bullet points (e.g. "Good with kids"). Add both Portuguese and English for each fact.',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'pt', title: 'Português', type: 'string'},
            {name: 'en', title: 'English', type: 'string'},
          ],
          preview: {select: {title: 'pt', subtitle: 'en'}},
        },
      ],
    }),
    localizedBlock('personality', 'Personality'),
    localizedBlock('history', 'History'),
    localizedBlock('health', 'Health'),
    localizedBlock('interestingFacts', 'Interesting Facts'),

    // — Success story (only shown once status = Adopted) —
    defineField({
      name: 'adopterNames',
      title: 'Adopter names',
      type: 'string',
      description: 'The family or person who adopted — e.g. "Caroline & David". Shown on the success story card.',
      hidden: onlyAdopted,
    }),
    defineField({
      name: 'dateAdopted',
      title: 'Date adopted',
      type: 'date',
      description: 'When they found their home. Drives the "Found their home · Month Year" line and the adoption counter.',
      hidden: onlyAdopted,
    }),
    defineField({
      name: 'testimonial',
      title: 'Adopter testimonial',
      type: 'object',
      description: 'A short first-person quote from the adopter, in their own voice.',
      hidden: onlyAdopted,
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'object',
          fields: [
            {name: 'pt', title: 'Português', type: 'text', rows: 3},
            {name: 'en', title: 'English', type: 'text', rows: 3},
          ],
        },
        {
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
          description: 'Optional — who said it, e.g. "Caroline".',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'status',
      media: 'coverPhoto',
    },
    prepare({title, subtitle, media}) {
      const statusLabel: Record<string, string> = {
        available: '✅ Available',
        reserved: '⏳ Reserved',
        adopted: '🏠 Adopted',
      }
      return {title, subtitle: statusLabel[subtitle] ?? subtitle, media}
    },
  },
})
