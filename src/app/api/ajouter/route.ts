import { NextResponse } from 'next/server'
import { getBase, tableName } from '../../../../lib/airtable'
import { validateNewResource } from '../../../../lib/validation'

export async function POST(req: Request) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Corps de requête invalide (JSON attendu).' },
        { status: 400 }
      )
    }

    const input = validateNewResource(body)
    if (!input) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Données invalides : champs requis manquants ou vides, type inconnu, coordonnées hors limites, ou texte trop long (max 2000 caractères).',
        },
        { status: 400 }
      )
    }

    const record = await getBase()(tableName).create([
      {
        fields: {
          id: Date.now().toString(),
          name_fr: input.name_fr,
          name_en: input.name_en,
          type_fr: input.type_fr,
          type_en: input.type_en,
          description_fr: input.description_fr,
          description_en: input.description_en,
          adresse: input.adresse,
          ville: input.ville,
          code_postal: input.code_postal,
          latitude: input.latitude,
          longitude: input.longitude,
          horaire_fr: input.horaire_fr,
          horaire_en: input.horaire_en,
          conditions_fr: input.conditions_fr,
          conditions_en: input.conditions_en,
          contact: input.contact ?? '',
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
