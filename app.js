const projets = Array.isArray(window.PORTFOLIO_PROJECTS) ? [...window.PORTFOLIO_PROJECTS] : [];

const references = {
    viewLinks: [],
    views: [],
    projectsContainer: null,
    countBadge: null,
    statsProjects: null,
    searchInput: null,
    kindFilter: null,
    form: null,
    toast: null,
    imageFile: null
};

let toastTimeoutId = null;
const state = {
    search: "",
    kind: "all"
};

function referencerContenusHTML() {
    references.viewLinks = Array.from(document.querySelectorAll("[data-view-link]"));
    references.views = Array.from(document.querySelectorAll("[data-view]"));
    references.projectsContainer = document.querySelector("#projects-container");
    references.countBadge = document.querySelector("#project-count-badge");
    references.statsProjects = document.querySelector("#stats-projets");
    references.searchInput = document.querySelector("#project-search");
    references.kindFilter = document.querySelector("#project-kind-filter");
    references.form = document.querySelector("#project-form");
    references.toast = document.querySelector("#toast");
    references.imageFile = document.querySelector("#project-image-file");
}

function afficherVue(nomVue) {
    const vuesDisponibles = ["accueil", "projets", "parcours", "contact"];
    const vueDemandee = vuesDisponibles.includes(nomVue) ? nomVue : "accueil";

    references.views.forEach((vue) => {
        vue.classList.toggle("active", vue.dataset.view === vueDemandee);
    });

    references.viewLinks.forEach((lien) => {
        lien.classList.toggle("active", lien.dataset.viewLink === vueDemandee);
    });
}

function allerVersCible(idCible) {
    if (!idCible) {
        return;
    }

    window.setTimeout(() => {
        const cible = document.getElementById(idCible);
        cible?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
}

function afficherToast(message) {
    references.toast.textContent = message;
    references.toast.classList.add("visible");
    window.clearTimeout(toastTimeoutId);
    toastTimeoutId = window.setTimeout(() => {
        references.toast.classList.remove("visible");
    }, 2400);
}

function mettreAJourCompteurs() {
    const total = filtrerProjets().length;
    references.countBadge.textContent = `${total} projet${total > 1 ? "s" : ""}`;
    references.statsProjects.textContent = String(projets.length);
}

function creerTag(texte) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = texte;
    return tag;
}

function creerCarteProjet(projet) {
    const carte = document.createElement("article");
    carte.className = "project-card";

    const image = document.createElement("img");
    image.src = projet.image;
    image.alt = projet.title;
    image.loading = "lazy";

    const corps = document.createElement("div");
    corps.className = "project-card-body";

    const top = document.createElement("div");
    top.className = "project-card-top";

    const type = document.createElement("span");
    type.className = "project-type";
    type.textContent = projet.kind;

    const periode = document.createElement("span");
    periode.className = "project-period";
    periode.textContent = projet.id;

    top.appendChild(type);
    top.appendChild(periode);

    const titre = document.createElement("h3");
    titre.textContent = projet.title;

    const description = document.createElement("p");
    description.textContent = projet.description;

    const tags = document.createElement("div");
    tags.className = "tag-list";
    projet.stack.slice(0, 3).forEach((technologie) => {
        tags.appendChild(creerTag(technologie));
    });

    const actions = document.createElement("div");
    actions.className = "project-card-actions";

    const voirPlus = document.createElement("a");
    voirPlus.className = "mini-button";
    voirPlus.href = `project-detail.html?id=${encodeURIComponent(projet.id)}`;
    voirPlus.target = "_blank";
    voirPlus.rel = "noreferrer";
    voirPlus.textContent = "Voir details";

    const supprimer = document.createElement("button");
    supprimer.type = "button";
    supprimer.className = "mini-button delete";
    supprimer.textContent = "Supprimer";
    supprimer.addEventListener("click", () => supprimerProjet(projet.id));

    actions.appendChild(voirPlus);
    actions.appendChild(supprimer);

    corps.appendChild(top);
    corps.appendChild(titre);
    corps.appendChild(description);
    corps.appendChild(tags);
    corps.appendChild(actions);

    carte.appendChild(image);
    carte.appendChild(corps);

    return carte;
}

function filtrerProjets() {
    return projets.filter((projet) => {
        const recherche = state.search.toLowerCase();
        const correspondRecherche = !recherche
            || projet.title.toLowerCase().includes(recherche)
            || projet.description.toLowerCase().includes(recherche)
            || projet.stack.some((item) => item.toLowerCase().includes(recherche));

        const correspondType = state.kind === "all" || projet.kind === state.kind;
        return correspondRecherche && correspondType;
    });
}

function rendreProjets() {
    references.projectsContainer.innerHTML = "";

    filtrerProjets().forEach((projet) => {
        references.projectsContainer.appendChild(creerCarteProjet(projet));
    });

    mettreAJourCompteurs();
}

function supprimerProjet(idProjet) {
    const index = projets.findIndex((item) => item.id === idProjet);

    if (index === -1) {
        return;
    }

    const projet = projets[index];
    const suppressionConfirmee = window.confirm(`Confirmer la suppression du projet "${projet.title}" ?`);

    if (!suppressionConfirmee) {
        return;
    }

    const [supprime] = projets.splice(index, 1);
    rendreProjets();
    afficherToast(`Projet supprime : ${supprime.title}`);
}

function lireFichierCommeDataURL(fichier) {
    return new Promise((resolve, reject) => {
        const lecteur = new FileReader();
        lecteur.onload = () => resolve(String(lecteur.result || ""));
        lecteur.onerror = () => reject(new Error("Impossible de lire le fichier."));
        lecteur.readAsDataURL(fichier);
    });
}

async function lireFormulaire() {
    const donnees = new FormData(references.form);
    const fichier = references.imageFile.files?.[0];
    let image = String(donnees.get("image") || "").trim();

    if (fichier) {
        image = await lireFichierCommeDataURL(fichier);
    }

    return {
        id: String(donnees.get("period") || "").trim(),
        title: String(donnees.get("title") || "").trim(),
        image: image || "images/projet1.jpg",
        stack: String(donnees.get("stack") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        description: String(donnees.get("description") || "").trim(),
        link: String(donnees.get("link") || "").trim() || "#",
        kind: "Projet personnel",
        points: ["Projet ajoute depuis le portfolio"]
    };
}

async function ajouterProjet(evenement) {
    evenement.preventDefault();

    const nouveauProjet = await lireFormulaire();

    if (!nouveauProjet.id || !nouveauProjet.title || !nouveauProjet.description) {
        afficherToast("Renseigne la periode, le titre et la description.");
        return;
    }

    projets.unshift(nouveauProjet);
    references.form.reset();
    rendreProjets();
    afficherVue("projets");
    window.location.hash = "#projets";
    afficherToast(`Projet ajoute : ${nouveauProjet.title}`);
}

function gererHash() {
    const hash = window.location.hash || "#accueil";
    const vue = hash.replace("#", "") || "accueil";
    afficherVue(vue);
}

function initialiserEvenements() {
    window.addEventListener("hashchange", gererHash);
    references.form.addEventListener("submit", ajouterProjet);
    references.searchInput.addEventListener("input", (event) => {
        state.search = event.target.value.trim();
        rendreProjets();
    });
    references.kindFilter.addEventListener("change", (event) => {
        state.kind = event.target.value;
        rendreProjets();
    });

    references.viewLinks.forEach((lien) => {
        lien.addEventListener("click", () => {
            const vue = lien.dataset.viewLink || "accueil";
            afficherVue(vue);
            allerVersCible(lien.dataset.scrollTarget);
        });
    });
}

function initialiserApplication() {
    referencerContenusHTML();
    initialiserEvenements();
    rendreProjets();
    gererHash();
}

document.addEventListener("DOMContentLoaded", initialiserApplication);
