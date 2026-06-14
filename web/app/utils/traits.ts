// Shared personality-trait config — used by TraitChip, FilterBar/FilterControls.
// Nuxt 4 auto-imports named exports from app/utils, so consumers can use these
// directly without an explicit import.

export const ALL_TRAITS = [
  'friendly',
  'gentle',
  'calm',
  'curious',
  'playful',
  'independent',
  'affectionate',
  'energetic',
  'good_with_kids',
  'good_with_dogs',
  'good_with_cats',
] as const

export type Trait = (typeof ALL_TRAITS)[number]

export const TRAIT_ICONS: Record<string, string> = {
  friendly: '☀️',
  gentle: '🌿',
  calm: '😊',
  curious: '👀',
  playful: '🐾',
  independent: '🛡️',
  affectionate: '❤️',
  energetic: '⚡',
  good_with_kids: '🤝',
  good_with_dogs: '🐕',
  good_with_cats: '🐱',
}
