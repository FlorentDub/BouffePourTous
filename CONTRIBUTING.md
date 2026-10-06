# Contribuer à BouffePourTous 🤝

Merci de vouloir aider ! Ce guide vous explique comment participer, que vous soyez développeur ou non.

## Contribuer sans coder

- **Soumettre une ressource** : utilisez le formulaire du site ([/ajouter](https://bouffepourtous.vercel.app/ajouter)). Une soumission = une aide concrète.
- **Signaler un bug ou une idée** : ouvrez une [issue](https://github.com/FlorentDub/BouffePourTous/issues/new) en décrivant le problème ou la suggestion.
- **Modérer les soumissions** : contactez le propriétaire du projet pour rejoindre l'équipe de modération (accès Airtable).

## Contribuer avec du code

### Par où commencer

Regardez les issues marquées `good first issue` — elles sont pensées pour une première contribution. Ensuite :

1. **Forkez** le dépôt et créez une branche : `git checkout -b mon-sujet`
2. **Développez** en local (voir le [README](README.md) pour l'installation)
3. **Vérifiez** que les trois contrôles passent (voir ci-dessous)
4. **Ouvrez une Pull Request** avec une description claire : quoi, pourquoi, comment tester

### Les trois contrôles obligatoires

```bash
npm run lint        # qualité du code — 0 erreur
npx tsc --noEmit    # typage — 0 erreur
npm run build       # build de production — succès
```

La CI les exécute automatiquement sur votre PR. Une PR dont la CI est rouge ne sera pas fusionnée.

### Conventions du projet

- **Langue** : français pour les échanges, issues, PR et commits
- **Une PR = un sujet** : petites modifications focalisées plutôt que gros fours-tout
- **Pas de `any`** en TypeScript — typage strict
- **Aucune dépendance nouvelle** sans justification dans la PR
- **Aucun secret dans le code** : les clés (Airtable, DeepL) vivent dans `.env.local` en local et dans les variables d'environnement en production
- **Bilingue** : toute chaîne visible par l'utilisateur existe en `_fr` et `_en`

### Ouvrir une bonne issue

- Décrivez le **comportement observé** et le **comportement attendu**
- Ajoutez les **étapes pour reproduire** le problème
- Joignez une **capture d'écran** si pertinent
- Copiez le **message d'erreur** complet le cas échéant

## Architecture rapide

Voir le [README](README.md#-architecture) pour la carte du projet, et `AGENTS.md` pour les détails techniques (rôles, règles, décisions).

## Licence

En contribuant, vous acceptez que vos contributions soient sous [licence MIT](LICENSE).
