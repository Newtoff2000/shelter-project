const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'j0v2zcj0'
const DATASET = process.env.SANITY_DATASET || 'production'
const API_VERSION = '2024-01-01'

export async function sanityFetch<T = any>(
  query: string,
  params: Record<string, any> = {},
): Promise<T> {
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`

  const searchParams = new URLSearchParams({ query })
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(`$${key}`, JSON.stringify(value))
  }

  const response = await $fetch<{ result: T }>(`${url}?${searchParams.toString()}`)
  return response.result
}
