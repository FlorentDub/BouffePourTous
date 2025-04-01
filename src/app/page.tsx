'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 text-slate-800 p-4 flex flex-col items-center">
      <header className="text-center mb-8">
        <img src="/logo.png" alt="BouffePourTous logo" className="h-24 mx-auto mb-6" />
        <p className="text-lg max-w-xl">
          Répertoire collaboratif des ressources d’aide alimentaire à travers le Québec.
        </p>
      </header>

      <section className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4">
        <h2 className="text-xl font-semibold mb-2">Carte des ressources</h2>
        <Map />
      </section>
    </main>
  )
}