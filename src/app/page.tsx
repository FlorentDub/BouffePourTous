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
    <main className="min-h-screen bg-[#F8EDEB] text-[#3D2C2C] flex flex-col">
      <header className="bg-white border-b border-[#6B1E1E]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/logo.png"
            alt="BouffePourTous / FoodForAll"
            className="h-12 md:h-16"
          />
          <div className="inline-flex items-center rounded-full bg-[#F8EDEB] border border-[#6B1E1E] p-1" role="group" aria-label={lang === 'fr' ? 'Choix de la langue' : 'Language selection'}>
            <button
              className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm ${lang === 'fr' ? 'bg-[#6B1E1E] text-white' : 'text-[#6B1E1E]'}`}
              onClick={() => setLang('fr')}
              aria-pressed={lang === 'fr'}
            >
              FR
            </button>
            <button
              className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm ${lang === 'en' ? 'bg-[#6B1E1E] text-white' : 'text-[#6B1E1E]'}`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <section className="max-w-4xl w-full mx-auto px-4 pt-6 pb-2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#6B1E1E] mb-2">
            {lang === 'fr'
              ? 'Trouvez de la nourriture gratuite près de chez vous'
              : 'Find free food near you'}
          </h1>
          <p className="text-base md:text-lg">
            {lang === 'fr'
              ? 'Banques alimentaires, frigos communautaires, repas et épiceries communautaires — partout au Québec.'
              : 'Food banks, community fridges, meals and community grocery stores — across Quebec.'}
          </p>
        </section>

        <section className="max-w-4xl w-full mx-auto px-4 pb-6 flex-1 flex flex-col">
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-[#6B1E1E] flex-1">
            <h2 className="text-lg font-semibold mb-2 text-[#6B1E1E]">
              {lang === 'fr' ? 'Carte des ressources' : 'Resource map'}
            </h2>
            <Map lang={lang} />
          </div>
          <div className="mt-4 flex flex-col items-center gap-2">
            <Link href="/ajouter" className="w-full max-w-md">
              <button className="bg-[#6B1E1E] text-white font-medium px-4 py-3 rounded shadow hover:bg-[#842525] w-full">
                {lang === 'fr' ? '+ Ajouter une ressource' : '+ Add a resource'}
              </button>
            </Link>
            <p className="text-sm text-[#6B1E1E]">
              {lang === 'fr'
                ? 'Vous connaissez un lieu qui donne de la nourriture ? Partagez-le avec la communauté.'
                : 'Know a place that gives out food? Share it with the community.'}
            </p>
          </div>
        </section>
      </div>

      <footer className="text-center text-sm text-[#6B1E1E] p-4 border-t border-[#6B1E1E] bg-[#F8EDEB]">
        BouffePourTous / FoodForAll © {new Date().getFullYear()} — Créé avec ❤️ au Québec
      </footer>
    </main>
  )
}
