import { projetsParDefaut } from "./project-data.js";

const IMAGE_PAR_DEFAUT = "images/projet1.jpg";
const TYPE_PAR_DEFAUT = "Projet personnel";
const POINT_PAR_DEFAUT = "Projet presente dans le portfolio";

function normaliserListeTexte(valeur) {
    if (Array.isArray(valeur)) {
        return valeur.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(valeur || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function creerProjet(
    id,
    title,
    description = "",
    image = "",
    stack = [],
    link = "",
    kind = TYPE_PAR_DEFAUT,
    points = []
) {
    const technologies = normaliserListeTexte(stack);
    const jalons = normaliserListeTexte(points);

    return {
        id: String(id || "").trim(),
        title: String(title || "").trim(),
        description: String(description || "").trim(),
        image: String(image || "").trim() || IMAGE_PAR_DEFAUT,
        stack: technologies,
        link: String(link || "").trim() || "#",
        kind: String(kind || "").trim() || TYPE_PAR_DEFAUT,
        points: jalons.length ? jalons : [POINT_PAR_DEFAUT]
    };
}

export function normaliserProjet(projet) {
    const source = projet || {};

    return creerProjet(
        source.id,
        source.title,
        source.description,
        source.image,
        source.stack,
        source.link,
        source.kind,
        source.points
    );
}

export let projets = [];

export function setProjets(liste) {
    const source = Array.isArray(liste) ? liste : projetsParDefaut;
    projets.length = 0;
    source.forEach((projet) => {
        projets.push(normaliserProjet(projet));
    });
}

export function ajouterEnMemoire(projet) {
    projets.unshift(normaliserProjet(projet));
}

export function remplacerEnMemoire(id, projet) {
    const index = projets.findIndex((item) => item.id == id);

    if (index === -1) {
        return;
    }

    projets[index] = normaliserProjet(projet);
}

export function supprimerEnMemoire(id) {
    const index = projets.findIndex((item) => item.id == id);

    if (index !== -1) {
        projets.splice(index, 1);
    }
}

export function trouverProjet(id) {
    return projets.find((projet) => projet.id == id);
}
