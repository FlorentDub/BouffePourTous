import { NextResponse } from 'next/server'
import { getBase, tableName } from '../../../../lib/airtable'
import { validateNewResource } from '../../../../lib/validation'
import { translateResource } from '../../../../lib/translate'
import { rateLimit, getClientIp } from '../../../../lib/rateLimit'
import type { Resource } from '../../../../lib/types'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

export async function POST(req: Request) {
  const { allowed, retryAfterSec } = rateLimit(
    `ajouter:${getClientIp(req)}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  )
  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Trop de soumissions. Réessayez dans ${retryAfterSec} secondes.`,
      },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    )
  }

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

    const apiKey = process.env.DEEPL_API_KEY
    let final = input
    if (apiKey) {
      const asResource = {
        id: '', customId: '',
        name_fr: input.name_fr, name_en: input.name_en,
        type_fr: input.type_fr, type_en: input.type_en,
        description_fr: input.description_fr, description_en: input.description_en,
        adresse: input.adresse, ville: input.ville, code_postal: input.code_postal,
        latitude: input.latitude, longitude: input.longitude,
        horaire_fr: input.horaire_fr, horaire_en: input.horaire_en,
        conditions_fr: input.conditions_fr, conditions_en: input.conditions_en,
        contact: input.contact ?? '',
        derniere_mise_a_jour: '',
      } satisfies Resource
      const translated = await translateResource(asResource, apiKey)
      final = {
        ...input,
        name_fr: translated.name_fr || input.name_fr,
        name_en: translated.name_en || input.name_en,
        description_fr: translated.description_fr || input.description_fr,
        description_en: translated.description_en || input.description_en,
        horaire_fr: translated.horaire_fr || input.horaire_fr,
        horaire_en: translated.horaire_en || input.horaire_en,
        conditions_fr: translated.conditions_fr || input.conditions_fr,
        conditions_en: translated.conditions_en || input.conditions_en,
      }
    }

    const record = await getBase()(tableName).create([
      {
        fields: {
          id: crypto.randomUUID(),
          name_fr: final.name_fr,
          name_en: final.name_en,
          type_fr: final.type_fr,
          type_en: final.type_en,
          description_fr: final.description_fr,
          description_en: final.description_en,
          adresse: final.adresse,
          ville: final.ville,
          code_postal: final.code_postal,
          latitude: final.latitude,
          longitude: final.longitude,
          horaire_fr: final.horaire_fr,
          horaire_en: final.horaire_en,
          conditions_fr: final.conditions_fr,
          conditions_en: final.conditions_en,
          contact: final.contact ?? '',
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
