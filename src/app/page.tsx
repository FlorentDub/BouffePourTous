'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8EDEB] text-[#3D2C2C] p-4 flex flex-col items-center">
      <header className="text-center mb-8">
        <img
          src="/logo.png"
          alt="BouffePourTous / FoodForAll logo"
          className="h-24 mx-auto mb-4"
        />
        <p className="text-lg max-w-xl">
          Répertoire collaboratif des ressources d’aide alimentaire à travers le Québec /<br />
          Collaborative directory of food assistance resources across Quebec.
        </p>
      </header>

      <section className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4 border border-[#6B1E1E]">
        <h2 className="text-xl font-semibold mb-2 text-[#6B1E1E]">
          Carte des ressources / Resource Map
        </h2>
        <Map />
      </section>
    </main>
  )
}