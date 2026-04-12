const projets = Array.isArray(window.PORTFOLIO_PROJECTS) ? [...window.PORTFOLIO_PROJECTS] : [];
const STORAGE_KEY = "thierno-hane-portfolio-projects";

const references = {
    viewLinks: [],
    views: [],
    projectsContainer: null,
    countBadge: null,
    statsProjects: null,
    searchInput: null,
    kindFilter: null,
    sortSelect: null,
    editId: null,
    titleInput: null,
    periodInput: null,
    imageInput: null,
    stackInput: null,
    linkInput: null,
    descriptionInput: null,
    submitButton: null,
    deleteModal: null,
    deleteModalText: null,
    cancelDelete: null,
    confirmDelete: null,
    form: null,
    toast: null,
    imageFile: null
};

let toastTimeoutId = null;
let projetASupprimerId = null;
const state = {
    search: "",
    kind: "all",
    sort: "recent"
};

function referencerContenusHTML() {
    references.viewLinks = Array.from(document.querySelectorAll("[data-view-link]"));
    references.views = Array.from(document.querySelectorAll("[data-view]"));
    references.projectsContainer = document.querySelector("#projects-container");
    references.countBadge = document.querySelector("#project-count-badge");
    references.statsProjects = document.querySelector("#stats-projets");
    references.searchInput = document.querySelector("#project-search");
    references.kindFilter = document.querySelector("#project-kind-filter");
    references.sortSelect = document.querySelector("#project-sort");
    references.editId = document.querySelector("#project-edit-id");
    references.titleInput = document.querySelector("#project-title");
    references.periodInput = document.querySelector("#project-period");
    references.imageInput = document.querySelector("#project-image");
    references.stackInput = document.querySelector("#project-stack");
    references.linkInput = document.querySelector("#project-link");
    references.descriptionInput = document.querySelector("#project-description");
    references.submitButton = document.querySelector("#project-submit-button");
    references.deleteModal = document.querySelector("#delete-modal");
    references.deleteModalText = document.querySelector("#delete-modal-text");
    references.cancelDelete = document.querySelector("#cancel-delete");
    references.confirmDelete = document.querySelector("#confirm-delete");
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

function sauvegarderProjets() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projets));
}

function chargerProjetsDepuisLocalStorage() {
    const projetsSauvegardes = localStorage.getItem(STORAGE_KEY);

    if (!projetsSauvegardes) {
        return;
    }

    try {
        const donnees = JSON.parse(projetsSauvegardes);

        if (Array.isArray(donnees)) {
            projets.length = 0;
            donnees.forEach((projet) => projets.push(projet));
        }
    } catch (erreur) {
        console.error("Impossible de relire les projets locaux.", erreur);
    }
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

    const modifier = document.createElement("button");
    modifier.type = "button";
    modifier.className = "mini-button";
    modifier.textContent = "Modifier";
    modifier.addEventListener("click", () => chargerProjetDansFormulaire(projet.id));

    actions.appendChild(voirPlus);
    actions.appendChild(modifier);
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

function chargerProjetDansFormulaire(idProjet) {
    const projet = projets.find((item) => item.id === idProjet);

    if (!projet) {
        return;
    }

    references.editId.value = projet.id;
    references.titleInput.value = projet.title;
    references.periodInput.value = projet.id;
    references.imageInput.value = projet.image.startsWith("data:") ? "" : projet.image;
    references.stackInput.value = projet.stack.join(", ");
    references.linkInput.value = projet.link === "#" ? "" : projet.link;
    references.descriptionInput.value = projet.description;
    references.submitButton.textContent = "Mettre a jour le projet";
    afficherVue("projets");
    allerVersCible("add-project-panel");
}

function filtrerProjets() {
    const projetsFiltres = projets.filter((projet) => {
        const recherche = state.search.toLowerCase();
        const correspondRecherche = !recherche
            || projet.title.toLowerCase().includes(recherche)
            || projet.description.toLowerCase().includes(recherche)
            || projet.stack.some((item) => item.toLowerCase().includes(recherche));

        const correspondType = state.kind === "all" || projet.kind === state.kind;
        return correspondRecherche && correspondType;
    });

    if (state.sort === "title") {
        projetsFiltres.sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.sort === "kind") {
        projetsFiltres.sort((a, b) => a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title));
    }

    return projetsFiltres;
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

    projetASupprimerId = idProjet;
    references.deleteModalText.textContent = `Le projet "${projets[index].title}" sera retire du portfolio.`;
    references.deleteModal.classList.remove("hidden");
}

function fermerConfirmationSuppression() {
    projetASupprimerId = null;
    references.deleteModal.classList.add("hidden");
}

function confirmerSuppressionProjet() {
    const index = projets.findIndex((item) => item.id === projetASupprimerId);

    if (index === -1) {
        fermerConfirmationSuppression();
        return;
    }

    const [supprime] = projets.splice(index, 1);
    rendreProjets();
    sauvegarderProjets();
    fermerConfirmationSuppression();
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
    const editId = String(donnees.get("editId") || "").trim();

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
        points: ["Projet ajoute depuis le portfolio"],
        editId
    };
}

async function ajouterProjet(evenement) {
    evenement.preventDefault();

    const nouveauProjet = await lireFormulaire();

    if (!nouveauProjet.id || !nouveauProjet.title || !nouveauProjet.description) {
        afficherToast("Renseigne la periode, le titre et la description.");
        return;
    }

    if (nouveauProjet.editId) {
        const index = projets.findIndex((item) => item.id === nouveauProjet.editId);

        if (index !== -1) {
            projets[index] = {
                ...projets[index],
                ...nouveauProjet,
                editId: undefined
            };
            afficherToast(`Projet mis a jour : ${nouveauProjet.title}`);
        }
    } else {
        projets.unshift(nouveauProjet);
        afficherToast(`Projet ajoute : ${nouveauProjet.title}`);
    }

    references.form.reset();
    references.editId.value = "";
    references.submitButton.textContent = "Ajouter le projet";
    rendreProjets();
    sauvegarderProjets();
    afficherVue("projets");
    window.location.hash = "#projets";
}

function gererHash() {
    const hash = window.location.hash || "#accueil";
    const vue = hash.replace("#", "") || "accueil";
    afficherVue(vue);
}

function initialiserEvenements() {
    window.addEventListener("hashchange", gererHash);
    references.form.addEventListener("submit", ajouterProjet);
    references.cancelDelete.addEventListener("click", fermerConfirmationSuppression);
    references.confirmDelete.addEventListener("click", confirmerSuppressionProjet);
    references.deleteModal.addEventListener("click", (event) => {
        if (event.target === references.deleteModal) {
            fermerConfirmationSuppression();
        }
    });
    references.searchInput.addEventListener("input", (event) => {
        state.search = event.target.value.trim();
        rendreProjets();
    });
    references.kindFilter.addEventListener("change", (event) => {
        state.kind = event.target.value;
        rendreProjets();
    });
    references.sortSelect.addEventListener("change", (event) => {
        state.sort = event.target.value;
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
    chargerProjetsDepuisLocalStorage();
    initialiserEvenements();
    rendreProjets();
    gererHash();
}

document.addEventListener("DOMContentLoaded", initialiserApplication);
