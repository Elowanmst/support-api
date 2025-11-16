# Support API - Système de Support Client

## Description
API REST pour un système de support client utilisant Node.js, Express et MongoDB.

## Table des matières
- [Installation](#installation)
- [Configuration Git et GitHub](#configuration-git-et-github)
- [Workflow de développement](#workflow-de-développement)
- [API Documentation](#api-documentation)
- [Tests](#tests)

## Installation

```bash
npm install
npm start
```

## Configuration Git et GitHub

### Protection de la branche `main`

#### Règles de protection appliquées

![Required Status Checks](screen/config-github-rule.png)

![Protection de branche - Settings](screen/config-github-rule-2.png)


#### Règles configurées :
- ❌ **Pas de push direct sur main**
- ✅ **Pull Request obligatoire avant merge**
- ✅ **Status checks obligatoires** :
  - `code-quality` (ESLint + Prettier)
  - `tests` (Tests unitaires + coverage)
- ✅ **Branches à jour obligatoire avant merge**

#### Pourquoi ces règles sont importantes :

**1. Protection contre les erreurs humaines**
- Évite les commits accidentels sur la branche principale
- Force la revue de code via Pull Requests
- Réduit les risques de régression

**2. Qualité du code garantie**
- `code-quality` : Assure le respect des standards ESLint/Prettier
- `tests` : Vérifie que toutes les fonctionnalités marchent
- Empêche l'intégration de code défaillant

**3. Collaboration efficace**
- Historique Git propre et traçable
- Discussions sur les changements via PR
- Documentation automatique des modifications

**4. Intégration continue**
- Validation automatique avant chaque merge
- Détection précoce des problèmes
- Déploiement sécurisé

## Workflow de développement

### Étapes du workflow :

1. **Créer une branche feature**
   ```bash
   git checkout -b feature/nom-de-la-feature
   ```

2. **Développement avec commits structurés**
   ```bash
   git commit -m "feat: description de la fonctionnalité"
   ```

3. **Push et création de PR**
   ```bash
   git push -u origin feature/nom-de-la-feature
   ```

4. **Validation automatique**
   - Checks CI/CD s'exécutent automatiquement
   - Merge possible uniquement si tous les checks ✅

5. **Merge et nettoyage**
   - Merge via GitHub (pas de push direct)
   - Suppression automatique de la branche

## Pull Requests réalisées

- [x] **PR #1** : Configuration initiale (ESLint, Prettier, CI/CD)
- [x] **PR #2** : Modèle RequestType et routes MongoDB  
- [x] **PR #3** : Tests unitaires et documentation finale

## API Documentation

[À compléter avec les endpoints de votre API]

## Tests

```bash
npm test              # Lancer les tests
npm run test:coverage # Coverage des tests
```