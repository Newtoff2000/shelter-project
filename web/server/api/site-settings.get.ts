const QUERY = `*[_id == "siteSettings"][0] {
  heroHeadline,
  "heroPhotoUrl": heroPhoto.asset->url,
  contactEmail,
  instagramUrl
}`

export default defineEventHandler(async () => {
  return await sanityFetch<any>(QUERY)
})
