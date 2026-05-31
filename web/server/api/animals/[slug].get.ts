import { sanityFetch } from '~/server/utils/sanity'

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

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  return await sanityFetch<any>(ANIMAL_QUERY, { slug })
})
