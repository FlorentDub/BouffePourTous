'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import type { Resource } from '../lib/types'
import { LEGACY_TYPE_MAP } from '../lib/translate'

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
L.Marker.prototype.options.icon = DefaultIcon

const UserIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<span style="display:block;width:18px;height:18px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.3), 0 2px 6px rgba(0,0,0,0.4);"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const normalizeType = (value: string | undefined, lang: 'fr' | 'en'): string => {
  if (!value) return ''
  const legacy = LEGACY_TYPE_MAP[value]
  if (legacy) return lang === 'fr' ? legacy.fr : legacy.en
  return value
}

const pick = (fr: string | undefined, en: string | undefined) => {
  if (typeof window !== 'undefined') {
    const lang = document.documentElement.lang
    if (lang === 'en') return en || fr
  }
  return fr || en
}

function LocateControl({
  onLocate,
  lang,
  locating,
}: {
  onLocate: () => void
  lang: 'fr' | 'en'
  locating: boolean
}) {
  const map = useMap()
  useEffect(() => {
    const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-locate')
    button.innerHTML = `◎ ${lang === 'fr' ? 'Ma position' : 'My location'}`
    button.setAttribute('aria-label', lang === 'fr' ? 'Afficher ma position sur la carte' : 'Show my location on the map')
    button.style.cssText =
      'padding:6px 12px;background:white;border:none;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.3);font:inherit;font-size:14px;font-weight:500;color:#6B1E1E;cursor:pointer;'
    if (locating) {
      button.style.opacity = '0.6'
      button.disabled = true
    }
    button.onclick = (e) => {
      L.DomEvent.preventDefault(e)
      L.DomEvent.stopPropagation(e)
      onLocate()
    }
    const container = map.getContainer()
    container.appendChild(button)
    return () => {
      container.removeChild(button)
    }
  }, [map, onLocate, lang, locating])
  return null
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 1.2 })
  }, [map, target])
  return null
}

export default function Map({ lang }: { lang: 'fr' | 'en' }) {
  const [resources, setResources] = useState<Resource[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoMsg, setGeoMsg] = useState<string | null>(null)

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

  const handleLocate = () => {
    if (!('geolocation' in navigator)) {
      setGeoMsg(lang === 'fr' ? 'La géolocalisation n\u2019est pas supportée par votre navigateur.' : 'Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setGeoMsg(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserPos(coords)
        setFlyTarget(coords)
        setLocating(false)
      },
      () => {
        setGeoMsg(
          lang === 'fr'
            ? 'Position introuvable. Vérifiez que la géolocalisation est autorisée.'
            : 'Location not found. Check that geolocation is allowed.'
        )
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  if (loading) return <p className="text-center mt-4">{lang === 'fr' ? 'Chargement de la carte...' : 'Loading map...'}</p>
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>

  return (
    <div className="h-[500px] w-full relative">
      <MapContainer center={[46.8139, -71.2082]} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl shadow">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateControl onLocate={handleLocate} lang={lang} locating={locating} />
        <FlyTo target={flyTarget} />
        {userPos && (
          <Marker position={userPos} icon={UserIcon} aria-label={lang === 'fr' ? 'Votre position' : 'Your location'}>
            <Popup>{lang === 'fr' ? 'Vous êtes ici' : 'You are here'}</Popup>
          </Marker>
        )}
        {resources.map((r) => (
          <Marker key={r.id} position={[r.latitude, r.longitude]}>
            <Popup>
              <div className="text-sm">
                <strong>{pick(r.name_fr, r.name_en)}</strong><br />
                <em>{normalizeType(pick(r.type_fr, r.type_en), lang)}</em><br />
                <p className="mt-1">{pick(r.description_fr, r.description_en)}</p>
                <p className="mt-2">
                  📍 {[r.numero, r.rue].filter(Boolean).join(' ')}<br />
                  🕒 {pick(r.horaire_fr, r.horaire_en)}<br />
                  🚨 {pick(r.conditions_fr, r.conditions_en)}<br />
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
      {geoMsg && (
        <p role="alert" className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2 shadow-md">
          {geoMsg}
        </p>
      )}
    </div>
  )
}
