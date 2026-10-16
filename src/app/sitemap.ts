import type { MetadataRoute } from "next";
import { SITE_URL } from "../../lib/site";
import { getCities } from "../../lib/cities";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/ajouter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/villes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
  try {
    const cities = await getCities();
    for (const c of cities) {
      entries.push({
        url: `${SITE_URL}/ville/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  } catch {
    // Airtable indisponible au build : sitemap de base sans villes
  }
  return entries;
}
