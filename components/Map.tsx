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

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/ressources')
      const data = await res.json()
      setResources(data)
    }
    load()
  }, [])

  return (
    <div className="h-[500px] w-full">
      <MapContainer center={[46.8139, -71.2082]} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl shadow">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {resources.map((resource) => (
          <Marker key={resource.id} position={[resource.latitude, resource.longitude]}>
            <Popup>
              <strong>{resource.name_fr}</strong><br />
              {resource.description_fr}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
