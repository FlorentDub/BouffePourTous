# BouffePourTous / FoodForAll

Carte collaborative des ressources alimentaires (banques alimentaires, frigos communautaires, repas) — Next.js + Airtable + Leaflet.

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Ressources alimentaires
```

- `AIRTABLE_API_KEY` : clé API Airtable ([doc](https://support.airtable.com/docs/how-do-i-get-my-api-key))
- `AIRTABLE_BASE_ID` : identifiant de la base (commence par `app...`)
- `AIRTABLE_TABLE_NAME` : nom de la table (défaut : `Ressources alimentaires`)

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Construit le site pour la production |
| `npm run start` | Lance le site construit |
| `npm run lint` | Vérifie la qualité du code |

## Architecture

- `src/app/page.tsx` — page d'accueil avec la carte
- `src/app/ajouter/` — formulaire de soumission d'une ressource
- `src/app/api/ressources/` — API GET : ressources validées (Airtable)
- `src/app/api/ajouter/` — API POST : création d'une ressource (non validée)
- `components/` — composants carte Leaflet (affichage + sélection)
- `lib/airtable.ts` — connexion Airtable partagée + mapping des enregistrements
- `lib/types.ts` — types partagés (`Resource`)

## Déploiement

Le plus simple : [Vercel](https://vercel.com/new) (créateurs de Next.js). Configurer les variables d'environnement ci-dessus dans le projet Vercel.
