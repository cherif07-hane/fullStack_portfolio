# Portfolio Lab SPA en Vanilla JavaScript

## 1. Présentation de JavaScript

JavaScript est le langage de programmation qui rend les pages web interactives. Il permet de manipuler le contenu HTML, de répondre aux actions de l'utilisateur, de communiquer avec une API et de mettre à jour l'interface sans recharger la page.

Dans ce projet, JavaScript est utilisé pour :

- gérer le tableau `projets` en mémoire ;
- créer dynamiquement les cartes de projets dans le DOM ;
- afficher les détails d'un projet sélectionné ;
- ajouter et supprimer des projets ;
- persister les données via `json-server`.

## 2. Inclusion du JavaScript

Le script principal est inclus dans [index.html](./index.html) avec l'attribut `defer` :

```html
<script src="app.js" defer></script>
```

Cela garantit que le HTML est déjà chargé avant l'exécution du script.

## 3. Concepts

### a) Variable

Le projet utilise notamment :

- `let projets = []` pour stocker tous les projets ;
- `let references = {}` pour centraliser les nœuds HTML ;
- `let apiDisponible = false` pour connaître l'état du serveur REST.

### b) Opérateurs

Des opérateurs sont utilisés pour :

- comparer (`===`) ;
- fournir une valeur de secours (`||`, `??`) ;
- construire des chaînes dynamiques avec les template strings ;
- accéder sans erreur à certaines API avec l'opérateur optionnel (`?.`).

### c) Entrée / Sortie de base

- Entrée : lecture des champs du formulaire avec `FormData`.
- Sortie : affichage dynamique des cartes, des détails et des notifications dans l'interface.

### d) Structures de contrôle

Le code utilise :

- `if` pour la validation ;
- `try/catch` pour la gestion des erreurs AJAX ;
- `forEach`, `find`, `filter`, `map` pour parcourir et transformer les tableaux.

### e) Fonctions

Le script contient :

- des fonctions nommées : `creerProjet()`, `ajouterProjet()`, `detaillerProjet()`, `supprimerProjet()` ;
- des fonctions fléchées dans les écouteurs d'événements ;
- des callbacks pour les boutons et les traitements asynchrones.

### f) Événements

Les événements utilisés sont :

- `DOMContentLoaded` ;
- `submit` sur le formulaire ;
- `click` sur les actions de chaque projet ;
- `hashchange` pour permettre une sélection depuis l'URL.

### g) Objets

Chaque projet est un objet JavaScript :

```js
{
  id: "portfolio-1",
  title: "Portfolio Motion",
  image: "images/projet1.jpg",
  stack: ["HTML", "CSS", "JavaScript"],
  description: "Description...",
  link: "https://example.com"
}
```

### h) Objet Array

Le tableau `projets` exploite plusieurs méthodes natives :

- `unshift()` pour placer un nouveau projet en première position ;
- `find()` pour récupérer un projet précis ;
- `filter()` pour supprimer un projet ;
- `map()` pour normaliser les données venant de l'API.

### i) Objet Document

L'objet `document` est utilisé pour :

- référencer les éléments HTML ;
- écouter des événements ;
- créer des nœuds avec `document.createElement()` ;
- injecter du contenu dans la SPA.

### j) Objet Form

Le formulaire HTML est piloté en JavaScript avec :

- `addEventListener("submit", ...)` ;
- `new FormData(formulaire)` ;
- `form.reset()`.

### k) Requêtes AJAX

Le projet utilise `fetch()` pour :

- récupérer les projets : `GET /projets` ;
- ajouter un projet : `POST /projets` ;
- supprimer un projet : `DELETE /projets/:id`.

## 4. Références

- MDN JavaScript : https://developer.mozilla.org/fr/docs/Web/JavaScript
- MDN DOM : https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model
- MDN Fetch API : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API
- json-server : https://github.com/typicode/json-server

## 5. Demo

### Objectif

Réaliser une application Web SPA de gestion de portfolio avec du Vanilla JavaScript.

### Fonctionnalités livrées

- prototypage de l'application en une seule page ;
- référencement des contenus HTML manipulés par JS ;
- déclaration du tableau `projets` ;
- fonction `creerProjet()` pour créer le nœud d'un projet ;
- fonction `ajouterProjet()` pour ajouter en mémoire, dans le DOM et via l'API ;
- fonction `detaillerProjet()` pour afficher les caractéristiques ;
- fonction `supprimerProjet()` pour retirer un projet de la mémoire et de l'interface ;
- intégration d'un faux serveur REST via `json-server`.

### Fichiers principaux

- [index.html](./index.html)
- [app.js](./app.js)
- [styles.css](./styles.css)
- [db.json](./db.json)
- [package.json](./package.json)

### Lancer la démo

Installer les dépendances :

```powershell
npm.cmd install
```

Lancer le faux serveur API :

```powershell
npm.cmd run api
```

Ouvrir ensuite `index.html` dans le navigateur.

Si `json-server` n'est pas lancé, l'application fonctionne quand même avec des données locales de démonstration.
