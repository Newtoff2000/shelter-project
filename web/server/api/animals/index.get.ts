import { sanityFetch } from '~/server/utils/sanity'

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

export default defineEventHandler(async () => {
  return await sanityFetch<any[]>(ANIMALS_QUERY)
})
