'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AjouterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
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
    } finally {
      setLoading(false)
    }
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

      {submitted ? (
        <p className="text-center text-green-700">Merci! Votre ressource a été soumise pour validation.</p>
      ) : (
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4 text-[#6B1E1E]">Ajouter une ressource</h1>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Identification */}
            <fieldset className="border border-[#6B1E1E] rounded p-4">
              <legend className="text-lg font-medium text-[#6B1E1E]">Identification</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
                <label>Nom (français)</label><input name="name_fr" required className="p-2 border rounded" />
                <label>Name (English)</label><input name="name_en" required className="p-2 border rounded" />

                <label>Type (français)</label>
                <select name="type_fr" required className="p-2 border rounded">
                  <option value="">Sélectionnez</option>
                  <option value="Banque alimentaire">Banque alimentaire</option>
                  <option value="Frigo">Frigo</option>
                  <option value="Repas">Repas</option>
                  <option value="Autre">Autre</option>
                </select>

                <label>Type (English)</label>
                <select name="type_en" required className="p-2 border rounded">
                  <option value="">Select</option>
                  <option value="Food bank">Food bank</option>
                  <option value="Fridge">Fridge</option>
                  <option value="Meal">Meal</option>
                  <option value="Other">Other</option>
                </select>

                <label>Description (français)</label><textarea name="description_fr" className="p-2 border rounded" />
                <label>Description (English)</label><textarea name="description_en" className="p-2 border rounded" />
              </div>
            </fieldset>

            {/* Coordonnées */}
            <fieldset className="border border-[#6B1E1E] rounded p-4">
              <legend className="text-lg font-medium text-[#6B1E1E]">Coordonnées</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
                <label>Adresse</label><input name="adresse" className="p-2 border rounded" />
                <label>Ville</label><input name="ville" className="p-2 border rounded" />
                <label>Code postal</label><input name="code_postal" className="p-2 border rounded" />
                <label>Latitude</label><input name="latitude" type="number" step="any" className="p-2 border rounded" />
                <label>Longitude</label><input name="longitude" type="number" step="any" className="p-2 border rounded" />
                <label>Contact ou lien</label><input name="contact" className="p-2 border rounded" />
              </div>
            </fieldset>

            {/* Accessibilité */}
            <fieldset className="border border-[#6B1E1E] rounded p-4">
              <legend className="text-lg font-medium text-[#6B1E1E]">Horaires et conditions</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
                <label>Horaire (français)</label><input name="horaire_fr" className="p-2 border rounded" />
                <label>Schedule (English)</label><input name="horaire_en" className="p-2 border rounded" />
                <label>Conditions (français)</label><input name="conditions_fr" className="p-2 border rounded" />
                <label>Conditions (English)</label><input name="conditions_en" className="p-2 border rounded" />
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
      )}
    </div>
  )
}