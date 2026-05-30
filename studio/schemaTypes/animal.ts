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
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ageYears',
      title: 'Age (years)',
      type: 'number',
      description: 'Age in years. Age group (young/middle/senior) is computed automatically on the website.',
      validation: (Rule) => Rule.required().min(0),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dateJoined',
      title: 'Date joined shelter',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'neutered',
      title: 'Neutered / Spayed',
      type: 'boolean',
      initialValue: false,
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
