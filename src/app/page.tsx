'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <main className="min-h-screen bg-cream text-ink flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-line sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/logo.png"
            alt="BouffePourTous / FoodForAll"
            className="h-10 md:h-14"
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
            <h2 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
              <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-primary" />
              {lang === 'fr' ? 'Carte des ressources' : 'Resource map'}
            </h2>
            <Map lang={lang} />
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
