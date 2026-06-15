// Single source of truth for the siteSettings singleton (hero + Instagram URL).
// Both the layout and the homepage need it; useFetch already dedupes by the
// shared key so this is one fetch per render — the composable just gives both
// callers a typed handle instead of duplicating the URL + `any`.
// Shape mirrors the GROQ projection in server/api/site-settings.get.ts.
export interface SiteSettings {
  heroHeadline?: { pt?: string; en?: string }
  heroPhotoUrl?: string
  instagramUrl?: string
}

// Returns the full useFetch result so callers keep the codebase's
// `const { data } = await useSiteSettings()` pattern (Suspense-aware SSR).
// The shared `key` is what dedupes the two callers into one request.
export function useSiteSettings() {
  return useFetch<SiteSettings>('/api/site-settings', { key: 'site-settings' })
}
