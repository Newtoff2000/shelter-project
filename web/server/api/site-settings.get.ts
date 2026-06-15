// Note: contactEmail is intentionally NOT projected — this endpoint is public,
// and the form's real recipient lives server-side in process.env.CONTACT_EMAIL.
const QUERY = `*[_id == "siteSettings"][0] {
  heroHeadline,
  "heroPhotoUrl": heroPhoto.asset->url,
  instagramUrl
}`

export default defineEventHandler(async () => {
  return await sanityFetch<any>(QUERY)
})
