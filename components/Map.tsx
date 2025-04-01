// components/Map.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Corrige l'icône par défaut de Leaflet qui ne s'affiche pas dans Next.js
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
})
L.Marker.prototype.options.icon = DefaultIcon

const fakeResources = [
  {
    id: 1,
    name: 'Banque alimentaire St-Roch',
    lat: 46.8139,
    lng: -71.2082,
    description: 'Distribution les mardis et jeudis, inscription requise.'
  },
  {
    id: 2,
    name: 'Frigo communautaire Limoilou',
    lat: 46.8298,
    lng: -71.2252,
    description: 'Accessible 24/7, déposez ou prenez librement.'
  }
]

export default function Map() {
  useEffect(() => {
    // Évite erreur hydration côté client
  }, [])

  return (
    <div className="h-[500px] w-full">
      <MapContainer center={[46.8139, -71.2082]} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl shadow">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fakeResources.map(resource => (
          <Marker key={resource.id} position={[resource.lat, resource.lng]}>
            <Popup>
              <strong>{resource.name}</strong><br />
              {resource.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
