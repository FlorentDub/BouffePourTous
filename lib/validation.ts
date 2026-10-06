export type NewResourceInput = {
  name_fr: string
  name_en: string
  type_fr: string
  type_en: string
  description_fr: string
  description_en: string
  adresse: string
  ville: string
  code_postal: string
  latitude: number
  longitude: number
  horaire_fr: string
  horaire_en: string
  conditions_fr: string
  conditions_en: string
  contact?: string
}

const TEXT_FIELDS = [
  'name_fr',
  'name_en',
  'type_fr',
  'type_en',
  'description_fr',
  'description_en',
  'adresse',
  'ville',
  'code_postal',
  'horaire_fr',
  'horaire_en',
  'conditions_fr',
  'conditions_en',
] as const

const TYPES_FR = ['Banque alimentaire', 'Frigo', 'Repas', 'Autre']
const TYPES_EN = ['Food bank', 'Fridge', 'Meal', 'Other']

const MAX_TEXT_LENGTH = 2000

export const validateNewResource = (body: unknown): NewResourceInput | null => {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>

  for (const field of TEXT_FIELDS) {
    const value = b[field]
    if (typeof value !== 'string' || value.trim().length === 0) return null
    if (value.length > MAX_TEXT_LENGTH) return null
  }

  if (!TYPES_FR.includes(b.type_fr as string) || !TYPES_EN.includes(b.type_en as string)) return null

  if (b.contact !== undefined && b.contact !== '') {
    if (typeof b.contact !== 'string' || b.contact.length > 500) return null
  }

  const latitude = Number(b.latitude)
  const longitude = Number(b.longitude)
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null

  return {
    name_fr: b.name_fr as string,
    name_en: b.name_en as string,
    type_fr: b.type_fr as string,
    type_en: b.type_en as string,
    description_fr: b.description_fr as string,
    description_en: b.description_en as string,
    adresse: b.adresse as string,
    ville: b.ville as string,
    code_postal: b.code_postal as string,
    latitude,
    longitude,
    horaire_fr: b.horaire_fr as string,
    horaire_en: b.horaire_en as string,
    conditions_fr: b.conditions_fr as string,
    conditions_en: b.conditions_en as string,
    contact: typeof b.contact === 'string' ? b.contact : undefined,
  }
}
