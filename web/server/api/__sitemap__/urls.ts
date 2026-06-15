export default defineSitemapEventHandler(async () => {
  const slugs = await sanityFetch<{ slug: string }[]>(
    `*[_type == "animal"] { "slug": slug.current }`
  )
  return slugs.map(({ slug }) => ({
    loc: `/animals/${slug}`,
    _i18nTransform: true,
  }))
})
