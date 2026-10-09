"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useEffect } from 'react'

// Fix pour icônes Leaflet par défaut
const DefaultIcon = L.icon({
  iconUrl: typeof markerIconUrl === 'string' ? markerIconUrl : markerIconUrl.src,
  shadowUrl: typeof markerShadowUrl === 'string' ? markerShadowUrl : markerShadowUrl.src,
})
L.Marker.prototype.options.icon = DefaultIcon

function LocationSelector({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export default function MapWithLeaflet({
  position,
  setPosition,
}: {
  position: [number, number]
  setPosition: (pos: [number, number]) => void
}) {
  useEffect(() => {
    // S'assure que le code s'exécute uniquement côté client
  }, [])

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target
            const pos = marker.getLatLng()
            setPosition([pos.lat, pos.lng])
          },
        }}
      />
      <LocationSelector setPosition={setPosition} />
    </MapContainer>
  )
}