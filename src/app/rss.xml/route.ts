import { buildCatalog } from "../../../lib/catalog"
import { SITE_NAME_FR, SITE_URL } from "../../../lib/site"

export const dynamic = "force-dynamic"

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  let items = ""
  try {
    const catalog = await buildCatalog()
    items = catalog
      .split("\n")
      .filter(Boolean)
      .map((line: string) => `      <item><title>${escapeXml(line)}</title></item>`)
      .join("\n")
  } catch {
    items = ""
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME_FR)}</title>
    <link>${SITE_URL}</link>
    <description>Ressources d'aide alimentaire au Québec</description>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
