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
    <main className="min-h-screen bg-[#F8EDEB] text-[#3D2C2C] flex flex-col md:flex-row">
      {/* Bandeau latéral ou haut en mobile */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#6B1E1E] p-4 flex flex-col items-center gap-6 shadow-md">
        <img
          src="/logo.png"
          alt="BouffePourTous / FoodForAll logo"
          className="h-20"
        />
        <Link href="/ajouter">
          <button className="bg-[#6B1E1E] text-white font-medium px-4 py-2 rounded shadow hover:bg-[#842525]">
            + Ajouter une ressource
          </button>
        </Link>

        {/* Toggle langue moderne */}
        <div className="mt-2">
          <div className="inline-flex items-center rounded-full bg-[#F8EDEB] border border-[#6B1E1E] p-1">
            <button
              className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm ${lang === 'fr' ? 'bg-[#6B1E1E] text-white' : 'text-[#6B1E1E]'}`}
              onClick={() => setLang('fr')}
            >
              FR
            </button>
            <button
              className={`px-3 py-1 rounded-full transition-colors duration-200 text-sm ${lang === 'en' ? 'bg-[#6B1E1E] text-white' : 'text-[#6B1E1E]'}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-6 flex flex-col items-center">
          <header className="text-center mb-8">
            <p className="text-lg max-w-xl">
              {lang === 'fr'
                ? 'Répertoire collaboratif des ressources d’aide alimentaire à travers le Québec'
                : 'Collaborative directory of food assistance resources across Quebec'}
            </p>
          </header>

          <section className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4 border border-[#6B1E1E]">
            <h2 className="text-xl font-semibold mb-2 text-[#6B1E1E]">
              {lang === 'fr' ? 'Carte des ressources' : 'Resource Map'}
            </h2>
            <Map lang={lang} />
          </section>
        </div>

        <footer className="text-center text-sm text-[#6B1E1E] p-4 border-t border-[#6B1E1E] bg-[#F8EDEB]">
          BouffePourTous / FoodForAll © {new Date().getFullYear()} — Créé avec ❤️ au Québec
        </footer>
      </div>
    </main>
  )
}
