import { buildCatalog } from "../../../lib/catalog"
import { SITE_NAME_FR, SITE_URL } from "../../../lib/site"

export const dynamic = "force-dynamic"

export async function GET() {
  let body: string
  try {
    const catalog = await buildCatalog()
    body = catalog
  } catch {
    body = "Catalogue temporairement indisponible."
  }

  const content = `# ${SITE_NAME_FR} — Catalogue complet des ressources

# Liste de toutes les ressources d'aide alimentaire validées (banques alimentaires, frigos communautaires, repas communautaires, épiceries communautaires) au Québec.

# Format: Nom (FR / EN) — Type — Adresse — Horaires — Conditions — Contact

${body}
`

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
