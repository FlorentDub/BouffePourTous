import { NextResponse } from 'next/server'
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || ''
)

const tableName = process.env.AIRTABLE_TABLE_NAME || 'Ressources alimentaires'

export async function GET() {
  try {
    const records = await base(tableName)
      .select({
        filterByFormula: 'valide = TRUE()',
        sort: [{ field: 'derniere_mise_a_jour', direction: 'desc' }],
      })
      .all()

    const data = records.map((record) => {
      const fields = record.fields
      return {
        id: record.id,
        customId: fields.id,
        name_fr: fields.name_fr,
        name_en: fields.name_en,
        type_fr: fields.type_fr,
        type_en: fields.type_en,
        description_fr: fields.description_fr,
        description_en: fields.description_en,
        adresse: fields.adresse,
        ville: fields.ville,
        code_postal: fields.code_postal,
        latitude: fields.latitude,
        longitude: fields.longitude,
        horaire_fr: fields.horaire_fr,
        horaire_en: fields.horaire_en,
        conditions_fr: fields.conditions_fr,
        conditions_en: fields.conditions_en,
        contact: fields.contact,
        derniere_mise_a_jour: fields.derniere_mise_a_jour,
      }
    })

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erreur Airtable :', error)
    return NextResponse.json(
      { error: 'Erreur Airtable : ' + error.message },
      { status: 500 }
    )
  }
}