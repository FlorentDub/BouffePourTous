import { NextResponse } from 'next/server'
import { getBase, tableName } from '../../../../lib/airtable'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const record = await getBase()(tableName).create([
      {
        fields: {
          id: Date.now().toString(),
          name_fr: body.name_fr,
          name_en: body.name_en,
          type_fr: body.type_fr,
          type_en: body.type_en,
          description_fr: body.description_fr,
          description_en: body.description_en,
          adresse: body.adresse,
          ville: body.ville,
          code_postal: body.code_postal,
          latitude: parseFloat(body.latitude || 0),
          longitude: parseFloat(body.longitude || 0),
          horaire_fr: body.horaire_fr,
          horaire_en: body.horaire_en,
          conditions_fr: body.conditions_fr,
          conditions_en: body.conditions_en,
          contact: body.contact,
          valide: false,
          derniere_mise_a_jour: new Date().toISOString(),
        },
      },
    ])
    return NextResponse.json({ success: true, id: record[0].id })
  } catch (error: unknown) {
    console.error('Erreur lors de la création Airtable :', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
