import Airtable, { type FieldSet } from 'airtable'
import type { Resource } from './types'

export const getBase = () =>
  new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID || ''
  )

export const tableName = process.env.AIRTABLE_TABLE_NAME || 'Ressources alimentaires'

export const mapRecord = (record: Airtable.Record<FieldSet>): Resource => {
  const fields = record.fields
  return {
    id: record.id,
    customId: fields.id as string,
    name_fr: fields.name_fr as string,
    name_en: fields.name_en as string,
    type_fr: fields.type_fr as string,
    type_en: fields.type_en as string,
    description_fr: fields.description_fr as string,
    description_en: fields.description_en as string,
    adresse: fields.adresse as string,
    ville: fields.ville as string,
    code_postal: fields.code_postal as string,
    latitude: fields.latitude as number,
    longitude: fields.longitude as number,
    horaire_fr: fields.horaire_fr as string,
    horaire_en: fields.horaire_en as string,
    conditions_fr: fields.conditions_fr as string,
    conditions_en: fields.conditions_en as string,
    contact: fields.contact as string,
    derniere_mise_a_jour: fields.derniere_mise_a_jour as string,
  }
}
