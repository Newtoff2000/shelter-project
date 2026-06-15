export type AgeGroup = 'young' | 'middle' | 'senior'
export type TimeAtShelter = 'less_than_1' | '1_year' | '2_years' | '3_plus'

export function getAgeGroup(ageYears: number): AgeGroup {
  if (ageYears <= 2) return 'young'
  if (ageYears <= 7) return 'middle'
  return 'senior'
}

export function getTimeAtShelter(dateJoined: string): TimeAtShelter {
  const years = (Date.now() - new Date(dateJoined).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  if (years < 1) return 'less_than_1'
  if (years < 2) return '1_year'
  if (years < 3) return '2_years'
  return '3_plus'
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  young: 'Young (0–2y)',
  middle: 'Middle-age (3–7y)',
  senior: 'Senior (8y+)',
}

export const TIME_AT_SHELTER_LABELS: Record<TimeAtShelter, string> = {
  less_than_1: 'Less than 1 year',
  '1_year': '1 year',
  '2_years': '2 years',
  '3_plus': '3+ years',
}

// ── Animal shape (loose — the API returns `any`, these helpers read a subset) ──
export interface AnimalLike {
  _id?: string
  name?: string
  slug?: string
  status?: string
  species?: string
  gender?: string
  ageYears?: number
  size?: string
  dateJoined?: string
  coverPhotoUrl?: string
  personalityTraits?: string[]
}

// ── Feed filtering (lifted from index.vue so the homepage and /animals share it) ──
// Age is a continuous [ageMin, ageMax] range (years). `AGE_UNBOUNDED` is the
// open-ended default for ageMax — any value ≥ it means "no upper limit".
export const AGE_UNBOUNDED = 999

export interface AnimalFilters {
  name: string
  species: string
  gender: string
  ageMin: number
  ageMax: number
  size: string
  timeAtShelter: string
  traits: string[]
}

export function filterAnimals<T extends AnimalLike>(animals: T[], f: AnimalFilters): T[] {
  return animals.filter((a) => {
    if (f.name && !(a.name ?? '').toLowerCase().includes(f.name.toLowerCase())) return false
    if (f.species && a.species !== f.species) return false
    if (f.gender && a.gender !== f.gender) return false
    // Age range is lenient: animals with no recorded age are never hidden by it
    // (~half the catalog lacks ageYears — hiding them would empty the feed).
    if (a.ageYears != null) {
      if (a.ageYears < f.ageMin) return false
      if (a.ageYears > f.ageMax) return false
    }
    if (f.size && a.size !== f.size) return false
    if (f.timeAtShelter && (!a.dateJoined || getTimeAtShelter(a.dateJoined) !== f.timeAtShelter)) return false
    if (f.traits.length > 0) {
      const animalTraits = a.personalityTraits ?? []
      if (!f.traits.some((tr) => animalTraits.includes(tr))) return false
    }
    return true
  })
}

/** Largest whole-year age across the catalog, floored at 8 so the senior range is
 *  always reachable. Drives the age slider's right bound. */
export function maxAnimalAge(animals: AnimalLike[]): number {
  const ages = animals.map((a) => a.ageYears).filter((n): n is number => n != null)
  return Math.max(8, ...ages.map((n) => Math.ceil(n)))
}

// ── Match quiz ───────────────────────────────────────────────────────────────
// The quiz produces three soft preferences. They RANK animals (sort best-fit to
// the top) — they never filter, so sparse trait data can never empty the result.
export type Vibe = 'calm' | 'sporty'
export type Home = 'full' | 'solo'
export type SizePref = 'compact' | 'big'

export interface MatchAnswers {
  vibe?: Vibe
  home?: Home
  size?: SizePref
}

// Trait pools per quiz answer. Tokens are unique across axes, so the query string
// can be parsed order-independently.
const VIBE_TRAITS: Record<Vibe, string[]> = {
  calm: ['calm', 'gentle', 'affectionate'],
  sporty: ['energetic', 'playful', 'curious'],
}
const HOME_FULL_TRAITS = ['good_with_kids', 'good_with_dogs', 'good_with_cats']
const HOME_SOLO_TRAITS = ['independent', 'calm'] // a chill dog happy as your only companion
const SIZE_COMPACT: string[] = ['small', 'medium']

const VIBE_TOKENS: Vibe[] = ['calm', 'sporty']
const HOME_TOKENS: Home[] = ['full', 'solo']
const SIZE_TOKENS: SizePref[] = ['compact', 'big']

function countOverlap(traits: string[], pool: string[]): number {
  return pool.reduce((n, tr) => (traits.includes(tr) ? n + 1 : n), 0)
}

export function scoreAnimalMatch(animal: AnimalLike, answers: MatchAnswers): number {
  const traits = animal.personalityTraits ?? []
  let score = 0

  if (answers.vibe) score += 2 * countOverlap(traits, VIBE_TRAITS[answers.vibe])

  if (answers.home === 'full') score += 2 * countOverlap(traits, HOME_FULL_TRAITS)
  else if (answers.home === 'solo') score += countOverlap(traits, HOME_SOLO_TRAITS)

  if (answers.size === 'compact' && animal.size && SIZE_COMPACT.includes(animal.size)) score += 3
  else if (answers.size === 'big' && animal.size === 'large') score += 3

  return score
}

export function hasAnyMatch(answers: MatchAnswers): boolean {
  return Boolean(answers.vibe || answers.home || answers.size)
}

/** Stable sort by match score (desc). Ties keep the incoming order (API already
 *  returns `featured desc, dateJoined asc`). Returns a new array. */
export function rankByMatch<T extends AnimalLike>(animals: T[], answers: MatchAnswers): T[] {
  if (!hasAnyMatch(answers)) return [...animals]
  return [...animals].sort((a, b) => scoreAnimalMatch(b, answers) - scoreAnimalMatch(a, answers))
}

/** Serialize answers to a comma list, e.g. "calm,full,compact". */
export function stringifyMatch(answers: MatchAnswers): string {
  return [answers.vibe, answers.home, answers.size].filter(Boolean).join(',')
}

/** Parse a `match` query value (string | string[] | undefined) into answers.
 *  Order-independent; unknown tokens are ignored. */
export function parseMatch(value: unknown): MatchAnswers {
  const raw = Array.isArray(value) ? value.join(',') : typeof value === 'string' ? value : ''
  const tokens = raw.split(',').map((t) => t.trim())
  const answers: MatchAnswers = {}
  for (const tok of tokens) {
    if ((VIBE_TOKENS as string[]).includes(tok)) answers.vibe = tok as Vibe
    else if ((HOME_TOKENS as string[]).includes(tok)) answers.home = tok as Home
    else if ((SIZE_TOKENS as string[]).includes(tok)) answers.size = tok as SizePref
  }
  return answers
}

// ── Quiz archetype faces ───────────────────────────────────────────────────────
// Each quiz option shows a real, currently-available dog ("…like Mel") chosen from
// the dataset at build time — never hardcoded, so it self-heals every build.
export interface AnimalFace {
  name: string
  slug: string
  coverPhotoUrl: string
}

export type QuizAxis = 'vibe' | 'home' | 'size'
export type ArchetypeFaces = Record<QuizAxis, Record<string, AnimalFace | null>>

function toFace(a: AnimalLike): AnimalFace | null {
  if (!a.name || !a.slug || !a.coverPhotoUrl) return null
  return { name: a.name, slug: a.slug, coverPhotoUrl: a.coverPhotoUrl }
}

/** Pick a representative dog for one quiz side: the available, photographed dog
 *  with the strongest signal for that side, excluding an already-used id. Falls
 *  back to any photographed dog so a face is always shown when data exists. */
function pickBest(
  pool: AnimalLike[],
  scoreFn: (a: AnimalLike) => number,
  excludeId?: string,
): AnimalLike | null {
  let best: AnimalLike | null = null
  let bestScore = -1
  for (const a of pool) {
    if (a._id && a._id === excludeId) continue
    const s = scoreFn(a)
    if (s > bestScore) {
      best = a
      bestScore = s
    }
  }
  return best
}

export function pickArchetypeFaces(animals: AnimalLike[]): ArchetypeFaces {
  // Only available, photographed dogs are eligible to be a quiz face.
  const eligible = animals.filter(
    (a) => a.status !== 'adopted' && a.species === 'dog' && a.coverPhotoUrl,
  )

  // Pick the two sides of one question together, so the second can exclude the
  // first and the cards never show the same dog twice. scoreFn*10+1 means a dog
  // with zero signal still scores 1 → a face is always returned when data exists.
  const pickPair = (
    scoreA: (a: AnimalLike) => number,
    scoreB: (a: AnimalLike) => number,
  ): [AnimalFace | null, AnimalFace | null] => {
    const a = pickBest(eligible, (x) => scoreA(x) * 10 + 1)
    const b = pickBest(eligible, (x) => scoreB(x) * 10 + 1, a?._id)
    return [a ? toFace(a) : null, b ? toFace(b) : null]
  }

  const traitScore = (pool: string[]) => (a: AnimalLike) => countOverlap(a.personalityTraits ?? [], pool)
  const sizeScore = (sizes: string[]) => (a: AnimalLike) => (a.size && sizes.includes(a.size) ? 1 : 0)

  const [calm, sporty] = pickPair(traitScore(VIBE_TRAITS.calm), traitScore(VIBE_TRAITS.sporty))
  const [full, solo] = pickPair(traitScore(HOME_FULL_TRAITS), traitScore(HOME_SOLO_TRAITS))
  const [compact, big] = pickPair(sizeScore(SIZE_COMPACT), sizeScore(['large']))

  return {
    vibe: { calm, sporty },
    home: { full, solo },
    size: { compact, big },
  }
}
