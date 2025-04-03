"use client"

import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('./MapWithLeaflet'), {
  ssr: false
})

export default function MapSelector({ position, setPosition }: {
  position: [number, number],
  setPosition: (pos: [number, number]) => void
}) {
  return (
    <div className="mt-4">
      <MapWithNoSSR position={position} setPosition={setPosition} />
    </div>
  )
}