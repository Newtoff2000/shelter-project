import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {BarChartIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'
import {AnalyticsTool} from './components/AnalyticsTool'

export default defineConfig({
  name: 'default',
  title: 'Shelter Project',

  projectId: 'j0v2zcj0',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Animals')
              .schemaType('animal')
              .child(S.documentTypeList('animal').title('Animals')),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .schemaType('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings'),
              ),
          ]),
    }),
    visionTool(),
  ],

  // Append our Umami dashboard to the default tools (Structure, Vision) so
  // volunteers see "Analytics" in the top nav next to their content.
  tools: (prev) => [
    ...prev,
    {
      name: 'analytics',
      title: 'Analytics',
      icon: BarChartIcon,
      component: AnalyticsTool,
    },
  ],

  schema: {
    types: schemaTypes,
  },
})
