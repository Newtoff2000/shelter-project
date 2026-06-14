const ANIMALS_QUERY = `*[_type == "animal"] | order(featured desc, dateJoined asc) {
  _id,
  name,
  "slug": slug.current,
  status,
  featured,
  species,
  gender,
  ageYears,
  size,
  dateJoined,
  "coverPhotoUrl": coverPhoto.asset->url,
  personalityTraits,
  shortQuote
}`

export default defineEventHandler(async () => {
  return await sanityFetch<any[]>(ANIMALS_QUERY)
})
