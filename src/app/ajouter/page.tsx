'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import MapSelector from '../../../components/MapSelector'

export default function AjouterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [position, setPosition] = useState<[number, number]>([46.8139, -71.2082])
  const [numero, setNumero] = useState('')
  const [rue, setRue] = useState('')
  const [ville, setVille] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [geoError, setGeoError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const fullAddress = `${numero} ${rue}, ${ville}, ${codePostal}, Québec, Canada`
    const timer = setTimeout(async () => {
      if (numero || rue || ville || codePostal) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`)
          const data = await res.json()
          if (data && data.length > 0) {
            setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
            setGeoError(null)
          } else {
            setGeoError('Adresse introuvable. Vous pouvez ajuster manuellement le curseur.')
          }
        } catch (err) {
          setGeoError("Erreur lors de la géolocalisation.")
        }
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [numero, rue, ville, codePostal])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    if (!form.checkValidity()) {
      setError('Veuillez remplir tous les champs requis.')
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const formData = new FormData(form)
    formData.set('latitude', String(position[0]))
    formData.set('longitude', String(position[1]))

    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/ajouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Erreur lors de la soumission.')

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8EDEB] text-[#3D2C2C] p-6">
        <header className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="BouffePourTous / FoodForAll" className="h-20 mb-4" />
          <Link href="/">
            <button className="bg-[#6B1E1E] text-white px-4 py-2 rounded hover:bg-[#842525]">
              ← Retour à l'accueil
            </button>
          </Link>
        </header>
        <p className="text-center text-green-700">Merci! Votre ressource a été soumise pour validation.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8EDEB] text-[#3D2C2C] p-6">
      <header className="flex flex-col items-center mb-8">
        <img src="/logo.png" alt="BouffePourTous / FoodForAll" className="h-20 mb-4" />
        <Link href="/">
          <button className="bg-[#6B1E1E] text-white px-4 py-2 rounded hover:bg-[#842525]">
            ← Retour à l'accueil
          </button>
        </Link>
      </header>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-[#6B1E1E]">Ajouter une ressource</h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-8" noValidate>
          <fieldset className="border border-[#6B1E1E] rounded p-4">
            <legend className="text-lg font-medium text-[#6B1E1E]">Identification</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
              <label>Nom (français)</label><input name="name_fr" required className="p-2 border rounded bg-white" />
              <label>Name (English)</label><input name="name_en" required className="p-2 border rounded bg-white" />
              <label>Type (français)</label>
              <select name="type_fr" required className="p-2 border rounded bg-white">
                <option value="">Sélectionnez</option>
                <option value="Banque alimentaire">Banque alimentaire</option>
                <option value="Frigo">Frigo</option>
                <option value="Repas">Repas</option>
                <option value="Autre">Autre</option>
              </select>
              <label>Type (English)</label>
              <select name="type_en" required className="p-2 border rounded bg-white">
                <option value="">Select</option>
                <option value="Food bank">Food bank</option>
                <option value="Fridge">Fridge</option>
                <option value="Meal">Meal</option>
                <option value="Other">Other</option>
              </select>
              <label>Description (français)</label><textarea name="description_fr" required className="p-2 border rounded bg-white" />
              <label>Description (English)</label><textarea name="description_en" required className="p-2 border rounded bg-white" />
            </div>
          </fieldset>

          <fieldset className="border border-[#6B1E1E] rounded p-4">
            <legend className="text-lg font-medium text-[#6B1E1E]">Coordonnées</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
              <label>Numéro civique</label><input name="numero" required className="p-2 border rounded bg-white" value={numero} onChange={e => setNumero(e.target.value)} />
              <label>Rue</label><input name="rue" required className="p-2 border rounded bg-white" value={rue} onChange={e => setRue(e.target.value)} />
              <label>Ville</label><input name="ville" required className="p-2 border rounded bg-white" value={ville} onChange={e => setVille(e.target.value)} />
              <label>Code postal</label><input name="code_postal" required className="p-2 border rounded bg-white" value={codePostal} onChange={e => setCodePostal(e.target.value)} />
              <label>Latitude</label><input name="latitude" value={position[0]} readOnly className="p-2 border rounded bg-gray-200 text-gray-600" />
              <label>Longitude</label><input name="longitude" value={position[1]} readOnly className="p-2 border rounded bg-gray-200 text-gray-600" />
            </div>
            {geoError && <p className="text-red-600 text-sm mt-2">{geoError}</p>}
            <MapSelector position={position} setPosition={setPosition} />
          </fieldset>

          <fieldset className="border border-[#6B1E1E] rounded p-4">
            <legend className="text-lg font-medium text-[#6B1E1E]">Horaires et conditions</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
              <label>Horaire (français)</label><input name="horaire_fr" required className="p-2 border rounded bg-white" />
              <label>Schedule (English)</label><input name="horaire_en" required className="p-2 border rounded bg-white" />
              <label>Conditions (français)</label><input name="conditions_fr" required className="p-2 border rounded bg-white" />
              <label>Conditions (English)</label><input name="conditions_en" required className="p-2 border rounded bg-white" />
            </div>
          </fieldset>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#6B1E1E] text-white px-4 py-2 rounded w-full hover:bg-[#842525]"
            >
              {loading ? 'Envoi en cours...' : 'Soumettre la ressource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
