'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MapSelector from '../../../components/MapSelector'

const LABELS = {
  fr: {
    langLabel: 'Langue du formulaire',
    required: 'Les champs marqués * sont obligatoires.',
    identification: 'Identification',
    name: 'Nom de la ressource *',
    namePh: 'ex : Frigo communautaire Saint-Roch',
    type: 'Type *',
    typeOptions: { banque_alimentaire: 'Banque alimentaire', frigo: 'Frigo', repas: 'Repas', autre: 'Autre' },
    description: 'Description *',
    descriptionPh: 'ex : Frigo en libre accès devant l\u2019entrée, accessible 24h/24.',
    coordonnees: 'Coordonnées',
    numero: 'Numéro civique *',
    numeroPh: 'ex : 123',
    rue: 'Rue *',
    ruePh: 'ex : rue Saint-Joseph',
    ville: 'Ville *',
    villePh: 'ex : Québec',
    codePostal: 'Code postal *',
    codePostalPh: 'ex : G1K 4T2',
    latitude: 'Latitude',
    longitude: 'Longitude',
    geoError: 'Adresse introuvable. Vous pouvez ajuster manuellement le curseur.',
    geoErrorTech: 'Erreur lors de la géolocalisation.',
    horaires: 'Horaires et conditions',
    horaire: 'Horaires *',
    horairePh: 'ex : Lundi au vendredi, 9h à 17h',
    conditions: 'Conditions d\u2019accès *',
    conditionsPh: 'ex : Aucune condition, apporter ses propres sacs.',
    contact: 'Contact (lien web, optionnel)',
    contactPh: 'https://...',
    otherLang: 'Ajouter la version anglaise (optionnel)',
    nameEn: 'Name (English)',
    descriptionEn: 'Description (English)',
    horaireEn: 'Schedule (English)',
    conditionsEn: 'Conditions (English)',
    submit: 'Soumettre la ressource',
    submitting: 'Envoi en cours...',
    errorRequired: 'Veuillez remplir tous les champs requis.',
    backHome: 'Retour à l\u2019accueil',
    thanks: 'Merci ! Votre ressource a été soumise pour validation.',
    legend: 'Identification',
    legendCoord: 'Coordonnées',
    legendHoraires: 'Horaires et conditions',
  },
  en: {
    langLabel: 'Form language',
    required: 'Fields marked * are required.',
    identification: 'Identification',
    name: 'Resource name *',
    namePh: 'e.g. Saint-Roch Community Fridge',
    type: 'Type *',
    typeOptions: { banque_alimentaire: 'Food bank', frigo: 'Fridge', repas: 'Meal', autre: 'Other' },
    description: 'Description *',
    descriptionPh: 'e.g. Freely accessible fridge at the entrance, open 24/7.',
    coordonnees: 'Location',
    numero: 'Civic number *',
    numeroPh: 'e.g. 123',
    rue: 'Street *',
    ruePh: 'e.g. Saint-Joseph Street',
    ville: 'City *',
    villePh: 'e.g. Quebec City',
    codePostal: 'Postal code *',
    codePostalPh: 'e.g. G1K 4T2',
    latitude: 'Latitude',
    longitude: 'Longitude',
    geoError: 'Address not found. You can adjust the marker manually.',
    geoErrorTech: 'Geolocation error.',
    horaires: 'Schedule and conditions',
    horaire: 'Schedule *',
    horairePh: 'e.g. Monday to Friday, 9am to 5pm',
    conditions: 'Access conditions *',
    conditionsPh: 'e.g. No conditions, bring your own bags.',
    contact: 'Contact (web link, optional)',
    contactPh: 'https://...',
    otherLang: 'Add the French version (optional)',
    nameEn: 'Nom (français)',
    descriptionEn: 'Description (français)',
    horaireEn: 'Horaire (français)',
    conditionsEn: 'Conditions (français)',
    submit: 'Submit resource',
    submitting: 'Sending...',
    errorRequired: 'Please fill in all required fields.',
    backHome: 'Back to home',
    thanks: 'Thank you! Your resource has been submitted for validation.',
    legend: 'Identification',
    legendCoord: 'Location',
    legendHoraires: 'Schedule and conditions',
  },
} as const

export default function AjouterPage() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOtherLang, setShowOtherLang] = useState(false)
  const [position, setPosition] = useState<[number, number]>([46.8139, -71.2082])
  const [numero, setNumero] = useState('')
  const [rue, setRue] = useState('')
  const [ville, setVille] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [geoError, setGeoError] = useState<string | null>(null)
  const t = LABELS[lang]

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
            setGeoError(t.geoError)
          }
        } catch {
          setGeoError(t.geoErrorTech)
        }
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [numero, rue, ville, codePostal, t])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    if (!form.checkValidity()) {
      setError(t.errorRequired)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const formData = new FormData(form)
    formData.set('latitude', String(position[0]))
    formData.set('longitude', String(position[1]))
    formData.set('sourceLang', lang)

    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/ajouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de la soumission.')
      setSubmitted(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la soumission.'
      setError(message)
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
              ← {t.backHome}
            </button>
          </Link>
        </header>
        <p className="text-center text-green-700">{t.thanks}</p>
      </div>
    )
  }

  const inputClass = 'p-2 border rounded bg-white'

  return (
    <div className="min-h-screen bg-[#F8EDEB] text-[#3D2C2C] p-6">
      <header className="flex flex-col items-center mb-8">
        <img src="/logo.png" alt="BouffePourTous / FoodForAll" className="h-20 mb-4" />
        <Link href="/">
          <button className="bg-[#6B1E1E] text-white px-4 py-2 rounded hover:bg-[#842525]">
            ← {t.backHome}
          </button>
        </Link>
      </header>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2 text-[#6B1E1E]">{t.identification} — {lang === 'fr' ? 'Ajouter une ressource' : 'Add a resource'}</h1>
        <p className="text-sm text-[#6B1E1E] mb-4">{t.required}</p>

        <div className="mb-6">
          <span className="text-sm block mb-1">{t.langLabel}</span>
          <div className="inline-flex items-center rounded-full bg-white border border-[#6B1E1E] p-1">
            <button
              className={`px-3 py-1 rounded-full transition-colors text-sm ${lang === 'fr' ? 'bg-[#6B1E1E] text-white' : 'text-[#6B1E1E]'}`}
              onClick={() => setLang('fr')}
              type="button"
            >
              FR
            </button>
            <button
              className={`px-3 py-1 rounded-full transition-colors text-sm ${lang === 'en' ? 'bg-[#6B1E1E] text-white' : 'text-[#6B1E1E]'}`}
              onClick={() => setLang('en')}
              type="button"
            >
              EN
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <fieldset className="border border-[#6B1E1E] rounded p-4">
            <legend className="text-lg font-medium text-[#6B1E1E]">{t.legend}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
              <label>{t.name}</label>
              <input name="name" required placeholder={t.namePh} className={inputClass} />
              <label>{t.type}</label>
              <select name="type_key" required className={inputClass} defaultValue="">
                <option value="" disabled>{lang === 'fr' ? 'Sélectionnez' : 'Select'}</option>
                {Object.entries(t.typeOptions).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <label>{t.description}</label>
              <textarea name="description" required placeholder={t.descriptionPh} className={inputClass} />
            </div>
          </fieldset>

          <fieldset className="border border-[#6B1E1E] rounded p-4">
            <legend className="text-lg font-medium text-[#6B1E1E]">{t.legendCoord}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
              <label>{t.numero}</label>
              <input name="numero" required placeholder={t.numeroPh} value={numero} onChange={e => setNumero(e.target.value)} className={inputClass} />
              <label>{t.rue}</label>
              <input name="rue" required placeholder={t.ruePh} value={rue} onChange={e => setRue(e.target.value)} className={inputClass} />
              <label>{t.ville}</label>
              <input name="ville" required placeholder={t.villePh} value={ville} onChange={e => setVille(e.target.value)} className={inputClass} />
              <label>{t.codePostal}</label>
              <input name="code_postal" required placeholder={t.codePostalPh} value={codePostal} onChange={e => setCodePostal(e.target.value)} className={inputClass} />
              <label>{t.latitude}</label>
              <input name="latitude" value={position[0]} readOnly className="p-2 border rounded bg-gray-200 text-gray-600" />
              <label>{t.longitude}</label>
              <input name="longitude" value={position[1]} readOnly className="p-2 border rounded bg-gray-200 text-gray-600" />
            </div>
            {geoError && <p className="text-red-600 text-sm mt-2">{geoError}</p>}
            <MapSelector position={position} setPosition={setPosition} />
          </fieldset>

          <fieldset className="border border-[#6B1E1E] rounded p-4">
            <legend className="text-lg font-medium text-[#6B1E1E]">{t.legendHoraires}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
              <label>{t.horaire}</label>
              <input name="horaire" required placeholder={t.horairePh} className={inputClass} />
              <label>{t.conditions}</label>
              <input name="conditions" required placeholder={t.conditionsPh} className={inputClass} />
              <label>{t.contact}</label>
              <input name="contact" type="url" placeholder={t.contactPh} className={inputClass} />
            </div>
          </fieldset>

          <div>
            <button
              type="button"
              onClick={() => setShowOtherLang(!showOtherLang)}
              className="text-[#6B1E1E] underline text-sm"
            >
              {showOtherLang ? '−' : '+'} {t.otherLang}
            </button>
            {showOtherLang && (
              <fieldset className="border border-[#6B1E1E] rounded p-4 mt-4">
                <legend className="text-sm font-medium text-[#6B1E1E]">{t.otherLang}</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
                  <label>{t.nameEn}</label>
                  <input name={`name_${lang === 'fr' ? 'en' : 'fr'}`} className={inputClass} />
                  <label>{t.descriptionEn}</label>
                  <textarea name={`description_${lang === 'fr' ? 'en' : 'fr'}`} className={inputClass} />
                  <label>{t.horaireEn}</label>
                  <input name={`horaire_${lang === 'fr' ? 'en' : 'fr'}`} className={inputClass} />
                  <label>{t.conditionsEn}</label>
                  <input name={`conditions_${lang === 'fr' ? 'en' : 'fr'}`} className={inputClass} />
                </div>
              </fieldset>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#6B1E1E] text-white px-4 py-2 rounded w-full hover:bg-[#842525]"
            >
              {loading ? t.submitting : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
