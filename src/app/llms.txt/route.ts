import { SITE_DESCRIPTION_FR, SITE_NAME_FR, SITE_URL } from "../../../lib/site"

export const dynamic = "force-dynamic"

export async function GET() {
  const content = `# ${SITE_NAME_FR} (FoodForAll)

> ${SITE_DESCRIPTION_FR}

Le site BouffePourTous est une carte collaborative des ressources d'aide alimentaire au Québec : banques alimentaires, frigos communautaires, repas communautaires et épiceries communautaires.

## Ressources

- [Accueil / carte des ressources](${SITE_URL}): carte et liste des ressources alimentaires validées, avec filtres par type et bascule FR/EN.
- [Ajouter une ressource](${SITE_URL}/ajouter): formulaire public pour soumettre une nouvelle ressource (validée avant publication).
- [Ressources par ville](${SITE_URL}/villes): index des pages villes.
- [Page exemple](${SITE_URL}/ville/quebec): ressources alimentaires d'une ville, rendues en HTML statique.

## Données

- [Catalogue complet des ressources (llms-full.txt)](${SITE_URL}/llms-full.txt): la liste complète de toutes les ressources au format texte.
- [API publique JSON](${SITE_URL}/api/ressources): toutes les ressources validées au format JSON.

## À propos

- Site: ${SITE_URL}
- Code source: https://github.com/FlorentDub/BouffePourTous
- Langues: français, anglais
- Couverture: Québec (Canada)
`

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
