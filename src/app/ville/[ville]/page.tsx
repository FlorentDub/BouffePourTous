import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getCities, slugify } from "../../../../lib/cities"
import StaticResourceList from "../../../../components/StaticResourceList"
import { SITE_URL } from "../../../../lib/site"
import { TYPE_MAP } from "../../../../lib/translate"

export const dynamic = "force-dynamic"

type Params = { ville: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { ville } = await params
  const cities = await getCities()
  const city = cities.find((c) => c.slug === ville)
  if (!city) return {}
  const count = city.resources.length
  const title = `Ressources alimentaires à ${city.name} — banques alimentaires, frigos, repas`
  const description = `${count} ressources d'aide alimentaire à ${city.name} : banques alimentaires, frigos communautaires, repas communautaires et épiceries communautaires. Adresses et horaires.`
  return {
    title,
    description,
    alternates: { canonical: `/ville/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ville/${city.slug}`,
    },
  }
}

export default async function VillePage({ params }: { params: Promise<Params> }) {
  const { ville } = await params
  const cities = await getCities()
  const city = cities.find((c) => c.slug === ville)
  if (!city) notFound()

  const typeCounts: Record<string, number> = {}
  for (const r of city.resources) {
    const key = resolveTypeKeyStaticLocal(r)
    if (key) typeCounts[key] = (typeCounts[key] || 0) + 1
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Ressources alimentaires à ${city.name}`,
    numberOfItems: city.resources.length,
    itemListElement: city.resources.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": r.type_fr?.toLowerCase().includes("frigo")
          ? "NonProfit"
          : "LocalBusiness",
        name: r.name_fr,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${r.numero} ${r.rue}`,
          addressLocality: r.ville,
          postalCode: r.code_postal,
          addressCountry: "CA",
        },
        ...(r.latitude && r.longitude
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: r.latitude,
                longitude: r.longitude,
              },
            }
          : {}),
        ...(r.contact ? { url: r.contact } : {}),
      },
    })),
  }

  return (
    <main className="min-h-screen bg-cream text-ink flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-line sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="BouffePourTous / FoodForAll"
              width={140}
              height={56}
              className="h-10 md:h-14 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-primary text-sm font-medium underline"
          >
            ← Voir la carte
          </Link>
        </div>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="max-w-5xl w-full mx-auto px-4 pt-10 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-3">
          Ressources alimentaires à {city.name}
        </h1>
        <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
          {city.resources.length} ressources d&apos;aide alimentaire : banques
          alimentaires, frigos communautaires, repas et épiceries communautaires
          à {city.name}.
        </p>
      </section>
      <section className="max-w-5xl w-full mx-auto px-4 pb-10 flex-1">
        <StaticResourceList resources={city.resources} lang="fr" />
        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/villes" className="underline text-primary">
            Voir toutes les villes
          </Link>
        </p>
      </section>
    </main>
  )
}

function resolveTypeKeyStaticLocal(r: {
  type_fr: string
  type_en: string
}): string {
  const fr = (r.type_fr || "").trim()
  const en = (r.type_en || "").trim()
  for (const [key, labels] of Object.entries(TYPE_MAP)) {
    if (fr === labels.fr || en === labels.en) return key
  }
  return ""
}
