import { TYPE_MAP } from './translate'

export type SourceLang = 'fr' | 'en'

export type NewResourceInput = {
  sourceLang: SourceLang
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

const MAX_TEXT_LENGTH = 2000

const str = (v: unknown): string | null =>
  typeof v === 'string' && v.trim().length > 0 ? v : null

export const validateNewResource = (
  body: unknown
): NewResourceInput | null => {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>

  const sourceLang: SourceLang = b.sourceLang === 'en' ? 'en' : 'fr'

  const name = str(b.name)
  const description = str(b.description)
  const horaire = str(b.horaire)
  const conditions = str(b.conditions)
  const numero = str(b.numero)
  const rue = str(b.rue)
  const ville = str(b.ville)
  const codePostal = str(b.code_postal)
  const typeKey = str(b.type_key)

  if (!name || !description || !horaire || !conditions) return null
  if (!numero || !rue || !ville || !codePostal) return null
  if (!typeKey || !(typeKey in TYPE_MAP)) return null

  if ([name, description, horaire, conditions].some((v) => v.length > MAX_TEXT_LENGTH)) return null

  const nameOther = str(b[`name_${sourceLang === 'fr' ? 'en' : 'fr'}`])
  const descriptionOther = str(b[`description_${sourceLang === 'fr' ? 'en' : 'fr'}`])
  const horaireOther = str(b[`horaire_${sourceLang === 'fr' ? 'en' : 'fr'}`])
  const conditionsOther = str(b[`conditions_${sourceLang === 'fr' ? 'en' : 'fr'}`])
  if ([nameOther, descriptionOther, horaireOther, conditionsOther].some((v) => v !== null && v.length > MAX_TEXT_LENGTH)) return null

  const latitude = Number(b.latitude)
  const longitude = Number(b.longitude)
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null

  if (b.contact !== undefined && b.contact !== '') {
    if (typeof b.contact !== 'string' || b.contact.length > 500) return null
  }

  const type = TYPE_MAP[typeKey]
  const fr = sourceLang === 'fr'
  const input: NewResourceInput = {
    sourceLang,
    name_fr: (fr ? name : nameOther) ?? '',
    name_en: (fr ? nameOther : name) ?? '',
    type_fr: type.fr,
    type_en: type.en,
    description_fr: (fr ? description : descriptionOther) ?? '',
    description_en: (fr ? descriptionOther : description) ?? '',
    adresse: `${numero} ${rue}`,
    ville,
    code_postal: codePostal,
    latitude,
    longitude,
    horaire_fr: (fr ? horaire : horaireOther) ?? '',
    horaire_en: (fr ? horaireOther : horaire) ?? '',
    conditions_fr: (fr ? conditions : conditionsOther) ?? '',
    conditions_en: (fr ? conditionsOther : conditions) ?? '',
    contact: typeof b.contact === 'string' ? b.contact : undefined,
  }
  return input
}
