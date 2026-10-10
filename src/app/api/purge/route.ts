import { NextResponse } from 'next/server'
import { getBase, tableName } from '../../../../lib/airtable'

export async function POST(req: Request) {
  const secret = process.env.PURGE_SECRET || 'bpt-purge-temporaire'
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'Non autorise' }, { status: 401 })
  }
  try {
    const table = getBase()(tableName)
    let total = 0
    for (;;) {
      const existing = await table.select({ maxRecords: 100 }).all()
      if (existing.length === 0) break
      const ids = existing.map((r) => r.id)
      for (let i = 0; i < ids.length; i += 10) {
        await table.destroy(ids.slice(i, i + 10))
        total += Math.min(10, ids.length - i)
      }
    }
    return NextResponse.json({ success: true, purged: total })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
