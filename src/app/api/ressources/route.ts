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
        description_fr: fields.description_fr,
        latitude: fields.latitude,
        longitude: fields.longitude,
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