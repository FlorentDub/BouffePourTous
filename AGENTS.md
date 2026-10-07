# AGENTS.md — Mode d'emploi du projet pour les agents

Ce document est la référence pour tout agent (IA ou humain) travaillant sur ce dépôt. À lire avant toute intervention.

## Rôles

Le travail agentique sur ce projet suit des rôles nommés :

- **Architecte** : décisions techniques (structure, choix de libs, approches). Écrit la décision dans le ticket avant le code.
- **Tech Lead** : transforme les besoins en issues GitHub précises et indépendantes (contexte, fichiers, critère de réussite).
- **Développeur** : écrit le code, ouvre une Pull Request par ticket.
- **QA** : revue de code, vérification, rapport d'anomalies avec priorités.
- **UI & Accessibilité** : veille à ce que toute modification d'interface soit simple, intuitive et accessible (handicaps visuels, lecteurs d'écran, navigation clavier, contrastes). Toute PR touchant l'UI passe par sa revue.
- **DevOps** : CI, déploiement, secrets.
- **Product Owner** (l'humain) : priorités, validation, fusion des PR.

Boucle standard : besoin → issue (Tech Lead) → code (Développeur) → CI automatique → revue (QA + UI si l'interface est touchée) → validation/fusion (PO).

### Règles UI & accessibilité (permanent — l'agent UI les fait respecter)

- **Tout le monde doit pouvoir utiliser le site** : handicaps visuels, lecteurs d'écran, zoom, navigation clavier.
- Chaque champ de formulaire a un `<label>` lié (`htmlFor`/`id`), pas un label orphelin.
- Contrastes de couleurs conformes WCAG AA (texte ≥ 4.5:1, grands textes ≥ 3:1).
- Boutons et liens identifiables au clavier (`:focus-visible`), ordre de tabulation logique.
- Textes alternatifs (`alt`) sur toutes les images porteuses de sens.
- Langue de la page cohérente (`lang` mis à jour au changement de langue).
- Simplicité d'abord : si une interface demande des explications, elle est trop complexe.
- Les vérifications automatiques possibles (labels, alt, contrastes) sont à ajouter à la CI quand un outil adapté est introduit ; l'agent UI fait la revue manuelle du reste.

## Stack

- **Next.js 15** (App Router, Turbopack) — framework web
- **React 19** + **TypeScript strict** — UI typée
- **Tailwind CSS v4** — styles
- **Leaflet / react-leaflet** — cartes OpenStreetMap
- **Airtable** — base de données (ressources alimentaires)
- Déploiement cible : Vercel

## Architecture

```
src/app/page.tsx          # Accueil : carte des ressources + toggle FR/EN
src/app/ajouter/page.tsx  # Formulaire public de soumission
src/app/api/ressources/   # GET : ressources validées (Airtable)
src/app/api/ajouter/      # POST : création d'une ressource (valide=false)
components/               # Composants carte Leaflet (affichage + sélection)
lib/airtable.ts           # Connexion Airtable partagée + mapping — NE PAS DUPLIQUER
lib/airtable.server.ts    # fetchResources (server-side)
lib/types.ts               # Types partagés (Resource)
```

Règles :
- La connexion Airtable vit uniquement dans `lib/airtable.ts`. Ne jamais recréer un client Airtable ailleurs.
- Les types partagés vivent dans `lib/types.ts`.
- Toute nouvelle donnée affichée doit exister dans le type `Resource` et dans le mapping Airtable.
- Le site est bilingue : chaque champ texte existe en `_fr` et `_en`.

## Variables d'environnement

Requises (voir README) : `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`. En local : `.env.local`. Sur Vercel/GitHub : secrets. Ne jamais committer de clé.

## Commandes

```bash
npm run dev        # développement
npm run lint       # qualité du code
npx tsc --noEmit   # typage
npm run build      # build production
```

## Avant de livrer (obligatoire)

1. `npm run lint` — 0 erreur
2. `npx tsc --noEmit` — 0 erreur
3. `npm run build` — succès
4. Une branche `vibe/<slug>` par ticket, une PR par branche, description avec résumé + vérifications
5. Ne jamais fusionner soi-même ; laisser le Product Owner valider

## Conventions

- Langue des échanges et de la documentation : français
- Commit : impératif, sujet court en français
- Pas de nouvelle dépendance sans justification dans la PR
- Modifs petites et focalisées : un ticket = une PR
- ESLint `strict` : pas de `any`, pas de `console.log` oublié
