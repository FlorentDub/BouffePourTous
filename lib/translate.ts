import type { Resource } from './types'

export const TYPE_MAP: Record<string, { fr: string; en: string }> = {
  banque_alimentaire: { fr: 'Banque alimentaire', en: 'Food bank' },
  frigo_communautaire: { fr: 'Frigo communautaire', en: 'Community fridge' },
  repas_communautaire: { fr: 'Repas communautaire & soupe populaire', en: 'Community meal & soup kitchen' },
  epicerie_communautaire: { fr: 'Épicerie communautaire', en: 'Community grocery store' },
}

export const LEGACY_TYPE_MAP: Record<string, { fr: string; en: string }> = {
  Frigo: TYPE_MAP.frigo_communautaire,
  Fridge: TYPE_MAP.frigo_communautaire,
  Repas: TYPE_MAP.repas_communautaire,
  Meal: TYPE_MAP.repas_communautaire,
  'Banque alimentaire': TYPE_MAP.banque_alimentaire,
  'Food bank': TYPE_MAP.banque_alimentaire,
}

const DEEPL_URL = 'https://api-free.deepl.com/v2/translate'

const translateText = async (
  text: string,
  targetLang: 'fr' | 'en',
  apiKey: string
): Promise<string | null> => {
  if (!text.trim()) return null
  try {
    const res = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase(),
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.translations?.[0]?.text ?? null
  } catch {
    return null
  }
}

export const translateResource = async (
  resource: Resource,
  apiKey: string
): Promise<Resource> => {
  if (!apiKey) return resource
  const result = { ...resource }
  const pairs: [keyof Resource, keyof Resource][] = [
    ['name_fr', 'name_en'],
    ['description_fr', 'description_en'],
    ['horaire_fr', 'horaire_en'],
    ['conditions_fr', 'conditions_en'],
  ]
  for (const [frKey, enKey] of pairs) {
    const fr = resource[frKey] as string
    const en = resource[enKey] as string
    if (fr && !en) {
      const translated = await translateText(fr, 'en', apiKey)
      if (translated) result[enKey] = translated as never
    } else if (en && !fr) {
      const translated = await translateText(en, 'fr', apiKey)
      if (translated) result[frKey] = translated as never
    }
  }
  return result
}
