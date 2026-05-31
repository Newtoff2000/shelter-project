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
