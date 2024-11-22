# Projet Pokedex avec CI/CD

## Vue d'ensemble

Ce projet est une application Pokedex construite avec React et TypeScript. L'application permet aux utilisateurs de parcourir et de rechercher des Pokémon et de voir leurs détail. Le projet utilise un pipeline CI/CD pour assurer la qualité du code et automatiser les tests.

## Rôle du Pipeline

Le pipeline CI/CD de ce projet est conçu pour automatiser les tâches suivantes :

1. **Vérifications de la qualité du code** : Assure que le code respecte les normes et les meilleures pratiques du projet.
2. **Tests automatisés** : Exécute des tests d'intégration et des tests de e2e pour vérifier la fonctionnalité de l'application.
3. **Construction et déploiement** : Construit l'application et la déploie dans l'environnement de staging ou de production.

## Les tests de la pipeline

Pour exécuter les tests localement, utilisez les commandes suivantes :

```bash
# Check le repo Github
actions/checkout@v4

# Setup Node.js avec la version 20 et utilise le cache de npm
actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

# Installe les dépendances
npm ci

# Check les fichiers pour respecter TypeScript
npx tsc --noEmit

# Check les fichiers pour respecter Prettier
npx prettier --check .

# Check les fichiers pour respecter ESLint
npx eslint .

# Lance les tests Cypress
npx cypress open

# Build le projet
npm run build
```

Pour vérifier que tous les cas fonctionnent, j'ai effectué différents commits qui ont provoqué l'échec du pipeline.
