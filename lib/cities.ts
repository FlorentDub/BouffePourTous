import { fetchResources } from "./airtable.server"
import type { Resource } from "./types"

export type CityResources = {
  slug: string
  name: string
  resources: Resource[]
}

export function slugify(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function getCities(): Promise<CityResources[]> {
  const resources = await fetchResources()
  const byCity = new Map<string, Resource[]>()
  for (const r of resources) {
    const city = (r.ville || "").trim()
    if (!city) continue
    const list = byCity.get(city) ?? []
    list.push(r)
    byCity.set(city, list)
  }
  return Array.from(byCity.entries())
    .map(([name, resources]) => ({
      slug: slugify(name),
      name,
      resources,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    )
}
