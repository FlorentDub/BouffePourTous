import { readFileSync } from 'fs'
import Airtable from 'airtable'


type ResourceType = 'banque_alimentaire' | 'frigo_communautaire' | 'repas_communautaire' | 'epicerie_communautaire'

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
}

const TYPES: Record<ResourceType, { fr: string; en: string }> = {
  banque_alimentaire: { fr: 'Banque alimentaire', en: 'Food bank' },
  frigo_communautaire: { fr: 'Frigo communautaire', en: 'Community fridge' },
  repas_communautaire: { fr: 'Repas communautaire & soupe populaire', en: 'Community meal & soup kitchen' },
  epicerie_communautaire: { fr: 'Épicerie communautaire', en: 'Community grocery store' },
}

const isResourceType = (value: string): value is ResourceType => value in TYPES

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const geocode = async (f: ResourceSeed): Promise<[number, number] | null> => {
  const q = `${f.numero} ${f.rue}, ${f.ville}, Québec, Canada`
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BouffePourTous/1.0 (import initial de frigos communautaires)' },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
    return null
  } catch {
    return null
  }
}



const main = async () => {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Ressources alimentaires'
  const purge = process.argv.includes('--purge')

  if (!apiKey || !baseId) {
    console.error('AIRTABLE_API_KEY et AIRTABLE_BASE_ID requis dans .env.local')
    process.exit(1)
  }

  const frigos: ResourceSeed[] = JSON.parse(
    readFileSync('data/frigos-quebec.json', 'utf8')
  ).map((f: ResourceSeed) => ({ ...f, type: 'frigo_communautaire' }))
  const autres: ResourceSeed[] = JSON.parse(
    readFileSync('data/ressources-quebec.json', 'utf8')
  )
  const seeds = [...frigos, ...autres].filter((f) => f.type && isResourceType(f.type))
  console.log(`${seeds.length} ressources a importer (${frigos.length} frigos, ${autres.length} autres)`)

  const base = new Airtable({ apiKey }).base(baseId)
  const table = base(tableName)

  if (purge) {
    console.log('Purge des entrees existantes...')
    const existing = await table.select().all()
    const ids = existing.map((r) => r.id)
    for (let i = 0; i < ids.length; i += 10) {
      await table.destroy(ids.slice(i, i + 10))
      console.log(`  supprimes ${Math.min(i + 10, ids.length)}/${ids.length}`)
    }
    console.log('Purge terminee.')
  }

  const records: { fields: Record<string, unknown> }[] = []
  const failed: ResourceSeed[] = []

  for (const f of seeds) {
    const coords = await geocode(f)
    if (!coords) {
      console.warn(`  geocodage echoue: ${f.name} (${f.ville}) — ignore`)
      failed.push(f)
    } else {
      const t = TYPES[(f.type as ResourceType)]
      records.push({
        fields: {
          id: `${f.type}-${f.ville.toLowerCase().replace(/[^a-z0-9]/g, '')}-${f.rue.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          name_fr: f.name,
          name_en: f.name,
          type_fr: t.fr,
          type_en: t.en,
          description_fr: `${f.conditions} Source: ${f.source}.`,
          description_en: `${f.conditions} Source: ${f.source}.`,
          numero: f.numero,
          rue: f.rue,
          ville: f.ville,
          code_postal: f.code_postal,
          latitude: coords[0],
          longitude: coords[1],
          horaire_fr: f.horaire,
          horaire_en: f.horaire,
          conditions_fr: 'Aucune condition, libre-service selon la disponibilité.',
          conditions_en: 'No conditions, self-service according to availability.',
          contact: '',
          valide: true,
          derniere_mise_a_jour: new Date().toISOString(),
        },
      })
    }
    await sleep(1100)
  }

  console.log(`${records.length} ressources geocodees avec succes, ${failed.length} echecs`)

  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10)
    await table.create(batch as never)
    console.log(`  insere ${Math.min(i + 10, records.length)}/${records.length}`)
  }

  if (failed.length > 0) {
    console.log('\nRessources ignorees (geocodage impossible) :')
    failed.forEach((f) => console.log(`  - ${f.name} (${f.ville})`))
  }
  console.log('\nImport termine.')
}

main().catch((e) => {
  console.error('Erreur:', e.message)
  process.exit(1)
})
