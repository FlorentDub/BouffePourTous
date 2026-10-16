import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getBase, tableName, mapRecord } from '../../../../lib/airtable'
import { fetchResources } from '../../../../lib/airtable.server'
import seedsAll from "../../../../data/frigos-geocodes.json"


const isAuthorized = (req: Request): boolean => {
  const token = process.env.IMPORT_TOKEN
  if (!token) return false
  const auth = req.headers.get('authorization') || ''
  const provided = auth.replace(/^Bearer\s+/i, '')
  if (provided.length !== token.length) return false
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(token))
  } catch {
    return false
  }
}

type ResourceSeed = {
  name: string
  numero: string
  rue: string
  ville: string
  code_postal: string
  horaire: string
  conditions: string
  source: string
  type?: string
  latitude?: number
  longitude?: number
}

const TYPES: Record<string, { fr: string; en: string }> = {
  frigo_communautaire: { fr: 'Frigo communautaire', en: 'Community fridge' },
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  try {
    const seeds = seedsAll as unknown as ResourceSeed[]

    const base = getBase()(tableName)
    const existing = await base.select().all()
    const existingKeys = new Set(
      existing.map((r) => `${(r.fields.name_fr as string) || ''}|${(r.fields.ville as string) || ''}`)
    )

    const toInsert = seeds.filter(
      (f) => f.latitude != null && f.longitude != null && !existingKeys.has(`${f.name}|${f.ville}`)
    )

    if (toInsert.length === 0) {
      const total = existing.length
      return NextResponse.json({ success: true, inserted: 0, total })
    }

    const records = toInsert.map((f) => ({
      fields: {
        id: `frigo_communautaire-${f.ville.toLowerCase().replace(/[^a-z0-9]/g, '')}-${f.rue.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name_fr: f.name,
        name_en: f.name,
        type_fr: TYPES.frigo_communautaire.fr,
        type_en: TYPES.frigo_communautaire.en,
        description_fr: `${f.conditions} Source: ${f.source}.`,
        description_en: `${f.conditions} Source: ${f.source}.`,
        numero: f.numero,
        rue: f.rue,
        ville: f.ville,
        code_postal: f.code_postal,
        latitude: f.latitude,
        longitude: f.longitude,
        horaire_fr: f.horaire,
        horaire_en: f.horaire,
        conditions_fr: 'Aucune condition, libre-service selon la disponibilite.',
        conditions_en: 'No conditions, self-service according to availability.',
        contact: '',
        valide: true,
        derniere_mise_a_jour: new Date().toISOString(),
      },
    }))

    for (let i = 0; i < records.length; i += 10) {
      const batch = records.slice(i, i + 10)
      await base.create(batch as never)
    }

    const after = await fetchResources()
    return NextResponse.json({
      success: true,
      inserted: records.length,
      skipped: seeds.length - records.length,
      total: after.length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Erreur import: ' + message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
