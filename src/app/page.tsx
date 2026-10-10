'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import type { Resource } from '../../lib/types'
import { TYPE_MAP } from '../../lib/translate'
import ResourceList, { resolveTypeKey } from '../../components/ResourceList'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [resources, setResources] = useState<Resource[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [view, setView] = useState<'carte' | 'liste'>('carte')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/ressources')
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`)
        const data = await res.json()
        setResources(data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const counts: Record<string, number> = {}
  for (const r of resources) {
    const key = resolveTypeKey(r)
    if (key) counts[key] = (counts[key] || 0) + 1
  }
  const filtered = activeType ? resources.filter((r) => resolveTypeKey(r) === activeType) : resources

  const switchBtn = (target: 'carte' | 'liste', label: string) => (
    <button
      className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium ${
        view === target ? 'bg-primary text-white' : 'text-primary hover:bg-white'
      }`}
      onClick={() => setView(target)}
      aria-pressed={view === target}
    >
      {label}
    </button>
  )

  return (
    <main className="min-h-screen bg-cream text-ink flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-line sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="BouffePourTous / FoodForAll"
            width={140}
            height={56}
            className="h-10 md:h-14 w-auto"
            priority
          />
          <div
            className="inline-flex items-center rounded-full bg-primary-soft border border-line p-1"
            role="group"
            aria-label={lang === 'fr' ? 'Choix de la langue' : 'Language selection'}
          >
            <button
              className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium ${
                lang === 'fr' ? 'bg-primary text-white' : 'text-primary hover:bg-white'
              }`}
              onClick={() => setLang('fr')}
              aria-pressed={lang === 'fr'}
            >
              FR
            </button>
            <button
              className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm font-medium ${
                lang === 'en' ? 'bg-primary text-white' : 'text-primary hover:bg-white'
              }`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <section className="max-w-5xl w-full mx-auto px-4 pt-10 pb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-3">
            {lang === 'fr'
              ? 'Trouvez de la nourriture gratuite près de chez vous'
              : 'Find free food near you'}
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Banques alimentaires, frigos communautaires, repas et épiceries communautaires — partout au Québec.'
              : 'Food banks, community fridges, meals and community grocery stores — across Quebec.'}
          </p>
        </section>

        <section className="max-w-5xl w-full mx-auto px-4 pb-6 flex-1 flex flex-col">
          <div className="bg-white rounded-3xl shadow-lg shadow-primary/5 p-4 md:p-6 border border-line flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-primary" />
                {lang === 'fr' ? 'Ressources' : 'Resources'} ({filtered.length})
              </h2>
              <div
                className="inline-flex items-center rounded-full bg-primary-soft border border-line p-1"
                role="group"
                aria-label={lang === 'fr' ? 'Mode d\u2019affichage' : 'Display mode'}
              >
                {switchBtn('carte', lang === 'fr' ? 'Carte' : 'Map')}
                {switchBtn('liste', lang === 'fr' ? 'Liste' : 'List')}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={lang === 'fr' ? 'Filtrer par type de ressource' : 'Filter by resource type'}>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${activeType === null ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-line hover:border-primary'}`}
                onClick={() => setActiveType(null)}
                aria-pressed={activeType === null}
              >
                {lang === 'fr' ? 'Tous' : 'All'} ({resources.length})
              </button>
              {Object.keys(TYPE_MAP).map((key) => {
                const label = lang === 'fr' ? TYPE_MAP[key].fr : TYPE_MAP[key].en
                return (
                  <button
                    key={key}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${activeType === key ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-line hover:border-primary'}`}
                    onClick={() => setActiveType(activeType === key ? null : key)}
                    aria-pressed={activeType === key}
                  >
                    {label} ({counts[key] || 0})
                  </button>
                )
              })}
            </div>

            {loading && (
              <p className="text-center py-8 text-muted">
                {lang === 'fr' ? 'Chargement...' : 'Loading...'}
              </p>
            )}
            {error && <p className="text-red-600 text-center py-8">{error}</p>}

            {!loading && !error && view === 'carte' && (
              <Map lang={lang} resources={filtered} />
            )}
            {!loading && !error && view === 'liste' && (
              <ResourceList resources={filtered} lang={lang} />
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/ajouter" className="w-full max-w-md">
              <button className="bg-primary text-white font-medium px-6 py-3.5 rounded-full shadow-md hover:bg-primary-hover hover:shadow-lg transition-all duration-200 w-full">
                {lang === 'fr' ? '+ Ajouter une ressource' : '+ Add a resource'}
              </button>
            </Link>
            <p className="text-sm text-muted text-center max-w-md">
              {lang === 'fr'
                ? 'Vous connaissez un lieu qui donne de la nourriture ? Partagez-le avec la communauté.'
                : 'Know a place that gives out food? Share it with the community.'}
            </p>
          </div>
        </section>
      </div>

      <footer className="text-center text-sm text-muted p-6 border-t border-line bg-white/60">
        BouffePourTous / FoodForAll © {new Date().getFullYear()} — Créé avec ❤️ au Québec
      </footer>
    </main>
  )
}
