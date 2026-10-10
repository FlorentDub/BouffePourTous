'use client'

import { useState } from 'react'
import type { Resource } from '../lib/types'
import { TYPE_MAP, LEGACY_TYPE_MAP } from '../lib/translate'

export const resolveTypeKey = (r: Resource): string => {
  const fr = (r.type_fr || '').trim()
  const en = (r.type_en || '').trim()
  for (const [key, labels] of Object.entries(TYPE_MAP)) {
    if (fr === labels.fr || en === labels.en) return key
  }
  for (const [label, labels] of Object.entries(LEGACY_TYPE_MAP)) {
    if (fr === label || en === label) {
      return Object.entries(TYPE_MAP).find(([, v]) => v === labels)?.[0] ?? ''
    }
  }
  return ''
}

export default function ResourceList({
  resources,
  lang,
}: {
  resources: Resource[]
  lang: 'fr' | 'en'
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const pick = (fr: string | undefined, en: string | undefined) =>
    (lang === 'en' ? en || fr : fr || en) || ''

  const typeLabel = (key: string) => {
    if (TYPE_MAP[key]) return lang === 'fr' ? TYPE_MAP[key].fr : TYPE_MAP[key].en
    return key
  }

  if (resources.length === 0) {
    return (
      <p className="text-center text-muted py-8">
        {lang === 'fr'
          ? 'Aucune ressource ne correspond à ce filtre.'
          : 'No resource matches this filter.'}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {resources.map((r) => {
        const key = resolveTypeKey(r)
        const isOpen = expanded === r.id
        const address = [r.numero, r.rue].filter(Boolean).join(' ')
        return (
          <li key={r.id} className="bg-white rounded-2xl border border-line p-4">
            <button
              className="w-full text-left flex items-start justify-between gap-3"
              aria-expanded={isOpen}
              onClick={() => setExpanded(isOpen ? null : r.id)}
            >
              <div>
                <span className="font-semibold text-ink block">{pick(r.name_fr, r.name_en)}</span>
                <span className="text-sm text-primary">{key ? typeLabel(key) : pick(r.type_fr, r.type_en)}</span>
                {address && <span className="text-sm text-muted block">📍 {address}, {r.ville}</span>}
              </div>
              <span aria-hidden="true" className="text-muted shrink-0">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="mt-3 pt-3 border-t border-line text-sm space-y-1">
                {pick(r.description_fr, r.description_en) && (
                  <p>{pick(r.description_fr, r.description_en)}</p>
                )}
                <p>🕑 {pick(r.horaire_fr, r.horaire_en)}</p>
                <p>🚨 {pick(r.conditions_fr, r.conditions_en)}</p>
                {r.contact && (
                  <p>
                    🔗{' '}
                    <a href={r.contact} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                      {lang === 'fr' ? 'Voir le lien' : 'View link'}
                    </a>
                  </p>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
