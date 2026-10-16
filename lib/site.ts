export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bouffe-pour-tous.vercel.app"

export const SITE_NAME_FR = "BouffePourTous"
export const SITE_NAME_EN = "FoodForAll"

export const SITE_DESCRIPTION_FR =
  "Carte collaborative des ressources alimentaires gratuites et abordables au Québec : banques alimentaires, frigos communautaires, repas communautaires et épiceries communautaires. Trouvez de l'aide alimentaire près de chez vous ou contribuez en ajoutant une ressource."

export const SITE_DESCRIPTION_EN =
  "Collaborative map of free and affordable food resources in Quebec: food banks, community fridges, community meals and community grocery stores. Find food help near you or contribute by adding a resource."

export const LOCALES = ["fr", "en"] as const
export const DEFAULT_LOCALE = "fr"
