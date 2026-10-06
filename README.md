# BouffePourTous — FoodForAll

<div align="center">

**🇫🇷** Carte collaborative des ressources alimentaires de solidarité — banques alimentaires, frigos communautaires, repas partagés — pour que personne ne cherche où manger dans le vide.

**🇬🇧** A collaborative map of community food resources — food banks, community fridges, shared meals — so that no one has to wonder where to find their next meal.

</div>

---

## 🇫🇷 À propos

BouffePourTous recense sur une carte interactive les lieux qui offrent de la nourriture gratuitement ou à bas prix : banques alimentaires, frigos communautaires, repas solidaires. Le projet est bilingue (français/anglais) et pensé pour le Québec, mais adaptable partout.

Le site fonctionne grâce à trois briques simples :

- **Une carte interactive** (OpenStreetMap / Leaflet) où chaque lieu validé apparaît
- **Un formulaire de soumission** simple, que chacun peut remplir — les traductions sont générées automatiquement (DeepL)
- **Une base de données Airtable** où les soumissions sont modérées avant publication

## 🚀 Démarrage rapide

```bash
git clone https://github.com/FlorentDub/BouffePourTous.git
cd BouffePourTous
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

Créez un fichier `.env.local` à la racine :

```
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Ressources alimentaires
DEEPL_API_KEY=your_deepl_key
```

| Variable | Description | Obligatoire |
|---|---|---|
| `AIRTABLE_API_KEY` | Clé API Airtable (jeton d'accès personnel) | ✅ |
| `AIRTABLE_BASE_ID` | Identifiant de la base (commence par `app...`) | ✅ |
| `AIRTABLE_TABLE_NAME` | Nom de la table | ✅ (défaut : `Ressources alimentaires`) |
| `DEEPL_API_KEY` | Clé DeepL (offre gratuite) pour la traduction automatique des soumissions | Non — sans elle, pas de traduction auto |

La table Airtable doit contenir les colonnes : `id, name_fr, name_en, type_fr, type_en, description_fr, description_en, numero, rue, ville, code_postal, latitude, longitude, horaire_fr, horaire_en, conditions_fr, conditions_en, contact, valide, derniere_mise_a_jour`.

## 🛠️ Stack technique

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript strict
- [Tailwind CSS v4](https://tailwindcss.com)
- [Leaflet](https://leafletjs.com) / react-leaflet — carte OpenStreetMap
- [Airtable](https://airtable.com) — base de données
- [DeepL API](https://www.deepl.com) — traduction automatique (offre gratuite)

## 📁 Architecture

```
src/app/page.tsx            Page d'accueil : carte des ressources + FR/EN
src/app/ajouter/            Formulaire public de soumission
src/app/api/ressources/     API GET : ressources validées
src/app/api/ajouter/        API POST : soumission (validation + rate limiting + traduction)
components/                 Carte Leaflet (affichage + sélection d'adresse)
lib/airtable.ts             Connexion Airtable partagée + mapping
lib/validation.ts           Validation serveur des soumissions
lib/rateLimit.ts            Limitation de débit (anti-robot)
lib/translate.ts            Traduction DeepL + correspondance des types
lib/types.ts                Types partagés
```

## ✅ Qualité

Avant chaque soumission de code, les trois vérifications doivent passer :

```bash
npm run lint        # qualité du code (0 erreur)
npx tsc --noEmit    # typage (0 erreur)
npm run build       # build de production
```

La CI GitHub Actions exécute ces vérifications automatiquement sur chaque PR et sur `main`.

## 🤝 Contribuer

Les contributions sont bienvenues ! Consultez les [issues ouvertes](https://github.com/FlorentDub/BouffePourTous/issues) — une bonne façon de commencer est de chercher une issue à votre portée, puis :

1. Forkez le projet et créez votre branche
2. Faites passer les trois vérifications ci-dessus
3. Ouvrez une Pull Request avec une description claire

Pas développeur ? Vous pouvez aussi aider en **soumettant des ressources** via le formulaire du site, ou en **modérant les soumissions** dans Airtable.

## 📄 Licence

À définir par le propriétaire du projet (suggestion : [MIT](https://opensource.org/licenses/MIT) pour une adoption libre).

---

<div align="center">

Made with ❤️ for everyone who deserves to eat well.

</div>
