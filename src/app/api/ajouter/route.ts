import { NextResponse } from 'next/server'
import { getBase, tableName } from '../../../../lib/airtable'
import { validateNewResource } from '../../../../lib/validation'
import { translateResource } from '../../../../lib/translate'
import { rateLimit, getClientIp, makeRateLimitCookie, checkRateLimitCookie } from '../../../../lib/rateLimit'
import { notifyNewResource } from '../../../../lib/notify'
import type { Resource } from '../../../../lib/types'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MIN_INTERVAL_MS = 60 * 1000

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed, retryAfterSec } = rateLimit(
    `ajouter:${ip}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  )
  const cookieCheck = checkRateLimitCookie(
    req.headers.get('cookie'),
    RATE_LIMIT_MIN_INTERVAL_MS
  )
  if (!allowed || !cookieCheck.allowed) {
    const wait = Math.max(retryAfterSec, cookieCheck.retryAfterSec)
    return NextResponse.json(
      {
        success: false,
        error: `Trop de soumissions. Réessayez dans ${wait} secondes.`,
      },
      { status: 429, headers: { 'Retry-After': String(wait) } }
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
        numero: input.numero, rue: input.rue, ville: input.ville, code_postal: input.code_postal,
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
          numero: final.numero, rue: final.rue,
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
    const submitted: Resource = {
      id: record[0].id,
      customId: record[0].fields.id as string,
      name_fr: final.name_fr,
      name_en: final.name_en,
      type_fr: final.type_fr,
      type_en: final.type_en,
      description_fr: final.description_fr,
      description_en: final.description_en,
      numero: final.numero,
      rue: final.rue,
      ville: final.ville,
      code_postal: final.code_postal,
      latitude: final.latitude,
      longitude: final.longitude,
      horaire_fr: final.horaire_fr,
      horaire_en: final.horaire_en,
      conditions_fr: final.conditions_fr,
      conditions_en: final.conditions_en,
      contact: final.contact ?? '',
      derniere_mise_a_jour: new Date().toISOString(),
    }

    try {
      await getBase()('Soumissions').create([
        {
          fields: {
            ressource_id: submitted.customId,
            ressource_nom: submitted.name_fr || submitted.name_en,
            type: submitted.type_fr || submitted.type_en,
            ville: submitted.ville,
            ip: ip,
            user_agent: req.headers.get('user-agent') || '',
            date_soumission: new Date().toISOString(),
          },
        },
      ])
    } catch (logError: unknown) {
      console.error('Erreur lors du journal Soumissions :', logError)
    }

    const userAgent = req.headers.get('user-agent') || ''
    try {
      await notifyNewResource(submitted, { ip, userAgent })
    } catch (notifyError: unknown) {
      console.error('Erreur lors de l envoi du courriel :', notifyError)
    }

    const cookie = makeRateLimitCookie(Date.now())
    return NextResponse.json(
      { success: true, id: record[0].id },
      {
        headers: {
          'Set-Cookie': `bpt_rl=${cookie}; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)}; Path=/`,
        },
      }
    )
  } catch (error: unknown) {
    console.error('Erreur lors de la création Airtable :', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
