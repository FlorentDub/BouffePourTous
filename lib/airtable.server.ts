import { getBase, tableName, mapRecord } from './airtable'

export const fetchResources = async () => {
  const records = await getBase()(tableName)
    .select({
      filterByFormula: 'valide = TRUE()',
      sort: [{ field: 'derniere_mise_a_jour', direction: 'desc' }],
    })
    .all()
  return records.map(mapRecord)
}
