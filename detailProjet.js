import { trouverProjet } from "./projet.js";

export function creerTag(texte) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = texte;
    return tag;
}

export function afficherDetailVide(references) {
    if (references.detailEmpty) {
        references.detailEmpty.classList.remove("hidden");
    }

    if (references.detailContent) {
        references.detailContent.classList.add("hidden");
    }
}

export function afficherDetailProjet(references, idProjet) {
    const projet = trouverProjet(idProjet);

    if (!projet) {
        afficherDetailVide(references);
        return null;
    }

    if (references.detailEmpty) {
        references.detailEmpty.classList.add("hidden");
    }

    if (references.detailContent) {
        references.detailContent.classList.remove("hidden");
    }

    if (references.detailImage) {
        references.detailImage.src = projet.image;
        references.detailImage.alt = projet.title;
    }

    if (references.detailKicker) {
        references.detailKicker.textContent = projet.kind;
    }

    if (references.detailTitle) {
        references.detailTitle.textContent = projet.title;
    }

    if (references.detailDescription) {
        references.detailDescription.textContent = projet.description;
    }

    if (references.detailId) {
        references.detailId.textContent = projet.id;
    }

    if (references.detailTags) {
        references.detailTags.innerHTML = "";
        projet.stack.forEach((technologie) => {
            references.detailTags.appendChild(creerTag(technologie));
        });
    }

    if (references.detailPoints) {
        references.detailPoints.innerHTML = "";
        projet.points.forEach((point) => {
            const element = document.createElement("li");
            element.textContent = point;
            references.detailPoints.appendChild(element);
        });
    }

    if (references.detailLink) {
        if (projet.link && projet.link !== "#") {
            references.detailLink.href = projet.link;
            references.detailLink.classList.remove("hidden");
        } else {
            references.detailLink.href = "#";
            references.detailLink.classList.add("hidden");
        }
    }

    if (references.detailViewPage) {
        references.detailViewPage.href = `project-detail.html?id=${encodeURIComponent(projet.id)}`;
    }

    if (references.detailEdit) {
        references.detailEdit.href = `ajouter-projet.html?edit=${encodeURIComponent(projet.id)}`;
    }

    return projet;
}
