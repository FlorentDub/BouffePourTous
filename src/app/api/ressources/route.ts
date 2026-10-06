import { NextResponse } from 'next/server'
import { getBase, tableName, mapRecord } from '../../../../lib/airtable'

export async function GET() {
  try {
    const records = await getBase()(tableName)
      .select({
        filterByFormula: 'valide = TRUE()',
        sort: [{ field: 'derniere_mise_a_jour', direction: 'desc' }],
      })
      .all()
    return NextResponse.json(records.map(mapRecord))
  } catch (error: unknown) {
    console.error('Erreur Airtable :', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Erreur Airtable : ' + message },
      { status: 500 }
    )
  }
}
