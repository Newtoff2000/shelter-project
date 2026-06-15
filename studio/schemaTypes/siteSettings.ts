import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'object',
      fields: [
        {name: 'pt', title: 'Português', type: 'string'},
        {name: 'en', title: 'English', type: 'string'},
      ],
    }),
    defineField({
      name: 'heroPhoto',
      title: 'Hero Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Email address where adoption enquiries and contact form messages will be sent',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {name: 'email', invert: false}).error(
          'Must be a valid email address',
        ),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'volunteerRoles',
      title: 'Volunteer Roles',
      description: 'Open team positions shown on the /volunteer page. Toggle isOpen off to hide without deleting.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Role title',
              type: 'object',
              fields: [
                {name: 'pt', title: 'Português', type: 'string'},
                {name: 'en', title: 'English', type: 'string'},
              ],
            },
            {
              name: 'description',
              title: 'Description',
              type: 'object',
              fields: [
                {name: 'pt', title: 'Português', type: 'text', rows: 4},
                {name: 'en', title: 'English', type: 'text', rows: 4},
              ],
            },
            {
              name: 'commitment',
              title: 'Time commitment',
              description: 'e.g. "3-4 horas/semana" / "3-4 hours/week"',
              type: 'object',
              fields: [
                {name: 'pt', title: 'Português', type: 'string'},
                {name: 'en', title: 'English', type: 'string'},
              ],
            },
            {
              name: 'isOpen',
              title: 'Position is open',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: {titleEn: 'title.en', isOpen: 'isOpen'},
            prepare({titleEn, isOpen}: any) {
              return {title: titleEn || 'Untitled role', subtitle: isOpen ? '● Open' : '○ Closed'}
            },
          },
        },
      ],
    }),
  ],
})
