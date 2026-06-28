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

// Maps each trait to its Tabler icon component name (imported in consumers).
export const TRAIT_ICON_NAMES: Record<string, string> = {
  friendly:      'IconSun',
  gentle:        'IconLeaf',
  calm:          'IconMoodSmile',
  curious:       'IconEye',
  playful:       'IconBallFootball',
  independent:   'IconShield',
  affectionate:  'IconHeart',
  energetic:     'IconBolt',
  good_with_kids:'IconUsers',
  good_with_dogs:'IconDog',
  good_with_cats:'IconCat',
}
