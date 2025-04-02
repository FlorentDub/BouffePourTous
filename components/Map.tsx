'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
})
L.Marker.prototype.options.icon = DefaultIcon

export default function Map() {
  const [resources, setResources] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/ressources')
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`)
        const data = await res.json()
        setResources(data)
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="text-center mt-4">{lang === 'fr' ? 'Chargement de la carte...' : 'Loading map...'}</p>
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>
  if (resources.length === 0) return <p className="text-center mt-4">{lang === 'fr' ? 'Aucune ressource trouvée pour l’instant.' : 'No resources found at the moment.'}</p>

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="bg-slate-200 text-slate-800 px-3 py-1 rounded shadow hover:bg-slate-300"
        >
          {lang === 'fr' ? 'English version' : 'Version française'}
        </button>
      </div>

      <div className="h-[500px] w-full">
        <MapContainer center={[46.8139, -71.2082]} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl shadow">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {resources.map((r) => (
            <Marker key={r.id} position={[r.latitude, r.longitude]}>
              <Popup>
                <div className="text-sm">
                  <strong>{lang === 'fr' ? r.name_fr : r.name_en}</strong><br />
                  <em>{lang === 'fr' ? r.type_fr : r.type_en}</em><br />
                  <p className="mt-1">{lang === 'fr' ? r.description_fr : r.description_en}</p>
                  <p className="mt-2">
                    📍 {r.adresse}<br />
                    🕒 {lang === 'fr' ? r.horaire_fr : r.horaire_en}<br />
                    🛂 {lang === 'fr' ? r.conditions_fr : r.conditions_en}<br />
                    🔗 {r.contact && (
                      <a href={r.contact} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                        {lang === 'fr' ? 'Voir le lien' : 'View link'}
                      </a>
                    )}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
