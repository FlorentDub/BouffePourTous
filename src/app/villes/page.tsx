import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getCities } from "../../../lib/cities"
import { SITE_URL } from "../../../lib/site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Toutes les villes — ressources alimentaires au Québec",
  description:
    "Liste des villes couvertes par BouffePourTous : banques alimentaires, frigos communautaires, repas et épiceries communautaires au Québec.",
  alternates: { canonical: "/villes" },
}

export default async function VillesPage() {
  const cities = await getCities()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Villes couvertes par BouffePourTous",
    numberOfItems: cities.length,
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/ville/${c.slug}`,
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
          <Link href="/" className="text-primary text-sm font-medium underline">
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
          Ressources alimentaires par ville
        </h1>
        <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
          {cities.length} villes couvertes au Québec. Sélectionnez votre ville
          pour voir les banques alimentaires, frigos communautaires, repas et
          épiceries communautaires près de chez vous.
        </p>
      </section>
      <section className="max-w-5xl w-full mx-auto px-4 pb-10 flex-1">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/ville/${c.slug}`}
                className="block bg-white rounded-2xl border border-line p-4 hover:border-primary transition-colors"
              >
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="block text-sm text-muted">
                  {c.resources.length}{" "}
                  {c.resources.length > 1 ? "ressources" : "ressource"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
