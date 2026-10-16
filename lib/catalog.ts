import { fetchResources } from "./airtable.server"
import type { Resource } from './types'

export function buildCatalog() {
  return fetchResources().then((resources) => {
    const lines: string[] = []
    for (const r of resources) {
      lines.push(
        `- ${r.name_fr}${r.name_en && r.name_en !== r.name_fr ? ` / ${r.name_en}` : ''} — ${typeLabel(r.type_fr)} — ${r.numero} ${r.rue}, ${r.ville} (${r.code_postal}) — ${r.horaire_fr} — ${r.conditions_fr}${r.contact ? ` — ${r.contact}` : ''}`
      )
    }
    return lines.join('\n')
  })
}

function typeLabel(t: string) {
  return t || 'Ressource alimentaire'
}
