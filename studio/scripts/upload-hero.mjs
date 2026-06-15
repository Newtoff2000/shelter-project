// One-off: upload the background-removed hero cutout and point siteSettings.heroPhoto at it.
// Usage: node studio/scripts/upload-hero.mjs "<absolute path to PNG>"
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

const TOKEN = process.env.SANITY_API_WRITE_TOKEN
if (!TOKEN) throw new Error('SANITY_API_WRITE_TOKEN not set')

const file = process.argv[2]
if (!file) throw new Error('Pass the image path as the first argument')

const client = createClient({
  projectId: 'j0v2zcj0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

const bytes = readFileSync(file)
console.log(`Uploading ${file} (${bytes.length} bytes)…`)
const asset = await client.assets.upload('image', bytes, {
  filename: 'ericeira-hero-cutout.png',
})
console.log('Asset uploaded:', asset._id)

const res = await client
  .patch('siteSettings')
  .set({heroPhoto: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}})
  .commit()
console.log('siteSettings.heroPhoto updated ->', res._id, asset.url)
