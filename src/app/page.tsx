'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">BouffePourTous</h1>
      <p className="mb-6">
        Trouvez des ressources d’aide alimentaire près de chez vous.
      </p>
      <Map />
    </main>
  )
}