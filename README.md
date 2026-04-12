# Portfolio Lab en Vanilla JavaScript modulaire

## Presentation

Ce projet est un portfolio HTML/CSS pilote par du JavaScript modulaire, en suivant la methode de la demo PDF :

- un module de donnees partage ;
- un module API pour `fetch()` ;
- un module pour la liste des projets ;
- un module pour le formulaire ;
- un module pour le detail d'un projet.

L'interface visuelle du site est conservee, mais la logique JavaScript est maintenant alignee sur une structure plus simple et plus proche de la demo.

## Structure JavaScript

- [projet.js](./projet.js) : creation et normalisation des projets, tableau partage en memoire
- [api.js](./api.js) : `GET`, `POST`, `PUT`, `DELETE` vers `json-server`
- [detailProjet.js](./detailProjet.js) : affichage du detail d'un projet
- [project-list.js](./project-list.js) : liste, filtres, suppression
- [project-form.js](./project-form.js) : ajout et modification
- [project-detail.js](./project-detail.js) : page detail
- [app.js](./app.js) : interactions de la page d'accueil

Les pages HTML chargent maintenant leurs scripts avec `type="module"`.

## API

Les donnees sont lues dans `db.json` via `json-server` a l'adresse :

```txt
http://localhost:3000/projets
```

Les requetes utilisees sont :

- `GET /projets`
- `GET /projets/:id`
- `POST /projets`
- `PUT /projets/:id`
- `DELETE /projets/:id`

## Lancer le projet

Installer les dependances :

```powershell
npm.cmd install
```

Lancer l'API locale :

```powershell
npm.cmd run api
```

Ouvrir ensuite `index.html`, `lister-projets.html` ou les autres pages du portfolio dans le navigateur.
