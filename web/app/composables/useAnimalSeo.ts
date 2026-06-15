import type { Ref } from 'vue'
import { ogImageUrl, jsonLdScript } from '~/utils/sanity-image'

/**
 * Sets share-preview meta (Open Graph / Twitter), canonical + hreflang, and
 * Product/Offer JSON-LD for a single animal profile page.
 *
 * All values are reactive on `animal`. Under SSG (`nuxt generate`) Nuxt awaits
 * the page's `useFetch` before serializing, so the resolved animal data lands in
 * the static HTML — which is what share/SEO crawlers (no JS) read.
 *
 * There is no `schema.org/Pet` type; an adoptable animal is modelled as a
 * `Product` with a €0 `Offer` whose availability mirrors the adoption status.
 */
export function useAnimalSeo(animal: Ref<any>) {
  const { locale, t } = useI18n()
  const route = useRoute()
  const siteUrl = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')

  const lang = computed(() => (locale.value === 'pt' ? 'pt' : 'en'))
  const pageUrl = computed(() => siteUrl + route.path)
  const siteName = computed(() => t('meta.ogSiteName'))

  function blocksToText(blocks: any): string {
    if (!Array.isArray(blocks)) return ''
    return blocks
      .filter((b: any) => b._type === 'block')
      .map((b: any) => (b.children ?? []).map((c: any) => c.text ?? '').join(''))
      .join(' ')
      .trim()
  }

  function localizedText(field: any): string {
    if (!field) return ''
    return blocksToText(field[lang.value]) || blocksToText(field.en) || blocksToText(field.pt)
  }

  function truncate(text: string, max = 160): string {
    if (text.length <= max) return text
    const slice = text.slice(0, max)
    const cut = slice.lastIndexOf(' ')
    return `${(cut > 0 ? slice.slice(0, cut) : slice).trimEnd()}…`
  }

  const description = computed(() => {
    const a = animal.value
    if (!a) return ''
    const quote = a.shortQuote?.[lang.value] || a.shortQuote?.pt || a.shortQuote?.en
    if (quote) return quote
    const personality = localizedText(a.personality)
    if (personality) return truncate(personality)
    return t('meta.animalDescription', { name: a.name })
  })

  const metaTitle = computed(() =>
    animal.value ? `${animal.value.name} — ${siteName.value}` : t('profile.notFound'),
  )

  const ogImage = computed(() => {
    const a = animal.value
    const cover = a?.coverPhotoUrl ? ogImageUrl(a.coverPhotoUrl) : ''
    return cover || `${siteUrl}/og-default.png`
  })

  // OG / Twitter share preview. Getters keep it reactive on the fetched data.
  useSeoMeta({
    title: () => metaTitle.value,
    description: () => description.value || undefined,
    ogTitle: () => metaTitle.value,
    ogDescription: () => description.value || undefined,
    ogType: 'website', // 'profile' is for a person; the real type lives in JSON-LD
    ogUrl: () => pageUrl.value,
    ogSiteName: () => siteName.value,
    ogImage: () => ogImage.value,
    ogImageWidth: () => (animal.value ? 1200 : undefined),
    ogImageHeight: () => (animal.value ? 630 : undefined),
    ogImageAlt: () => animal.value?.coverPhotoAlt || animal.value?.name || undefined,
    twitterCard: 'summary_large_image',
    twitterTitle: () => metaTitle.value,
    twitterDescription: () => description.value || undefined,
    twitterImage: () => ogImage.value,
    robots: () => (animal.value ? undefined : 'noindex'),
  })

  // <html lang>, canonical, hreflang alternates (pt-PT / en-US / x-default),
  // og:locale — emitted by i18n given i18n.baseUrl. Absolute because of baseUrl.
  useHead(useLocaleHead())

  // Product + Offer JSON-LD — only when the animal resolved.
  const productLd = computed(() => {
    const a = animal.value
    if (!a) return null
    const availability: Record<string, string> = {
      available: 'https://schema.org/InStock',
      reserved: 'https://schema.org/LimitedAvailability',
      adopted: 'https://schema.org/SoldOut',
    }
    const additionalProperty: any[] = [
      { '@type': 'PropertyValue', name: 'species', value: a.species },
    ]
    if (a.gender) additionalProperty.push({ '@type': 'PropertyValue', name: 'gender', value: a.gender })
    if (a.ageYears != null) additionalProperty.push({ '@type': 'PropertyValue', name: 'age', value: a.ageYears, unitText: 'YEAR' })
    if (a.size) additionalProperty.push({ '@type': 'PropertyValue', name: 'size', value: a.size })
    additionalProperty.push({ '@type': 'PropertyValue', name: 'neutered', value: Boolean(a.neutered) })

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: a.name,
      description: description.value,
      image: ogImage.value,
      url: pageUrl.value,
      category: a.species === 'dog' ? 'Dog' : 'Cat',
      inLanguage: lang.value === 'pt' ? 'pt-PT' : 'en-US',
      additionalProperty,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        url: pageUrl.value,
        availability: availability[a.status] ?? 'https://schema.org/InStock',
        seller: {
          '@type': 'AnimalShelter',
          name: 'Ericeira Paws',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mafra',
            addressRegion: 'Lisboa',
            addressCountry: 'PT',
          },
        },
      },
    }
  })

  useHead(() => ({
    script: productLd.value
      ? [{ type: 'application/ld+json', innerHTML: jsonLdScript(productLd.value) }]
      : [],
  }))
}
