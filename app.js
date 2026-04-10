const API_URL = "http://localhost:3000/projets";

let projets = [];
let references = {};
let apiDisponible = false;
let projetSelectionneId = null;
let toastTimeoutId = null;

const projetsDemo = [
    {
        id: "portfolio-1",
        title: "Portfolio Motion",
        image: "images/projet1.jpg",
        stack: ["HTML", "CSS", "JavaScript"],
        description: "Landing page éditoriale avec mise en avant du storytelling, transitions douces et hiérarchie visuelle premium.",
        link: "https://example.com/portfolio-motion"
    },
    {
        id: "portfolio-2",
        title: "Studio Data UI",
        image: "images/projet2.jpg",
        stack: ["Dashboard", "API REST", "UI"],
        description: "Interface d'analyse pour suivre des indicateurs de performance et mettre en scène les données de manière lisible.",
        link: "https://example.com/studio-data-ui"
    },
    {
        id: "portfolio-3",
        title: "Creative Case Study",
        image: "images/Projet3.jpg",
        stack: ["Responsive", "Branding", "UX"],
        description: "Présentation d'un cas client avec blocs narratifs, détail du process créatif et galerie optimisée pour mobile.",
        link: "https://example.com/creative-case-study"
    }
];

function referencerContenusHTML() {
    references = {
        form: document.querySelector("#project-form"),
        projectsContainer: document.querySelector("#projects-container"),
        countBadge: document.querySelector("#project-count-badge"),
        statsProjects: document.querySelector("#stats-projets"),
        statsSource: document.querySelector("#stats-source"),
        refreshButton: document.querySelector("#refresh-projects"),
        toast: document.querySelector("#toast"),
        apiDot: document.querySelector("#api-dot"),
        apiStatusTitle: document.querySelector("#api-status-title"),
        apiStatusText: document.querySelector("#api-status-text"),
        detailPanel: document.querySelector("#project-detail-panel"),
        detailEmpty: document.querySelector("#project-detail-empty"),
        detailContent: document.querySelector("#project-detail-content"),
        detailImage: document.querySelector("#detail-image"),
        detailKicker: document.querySelector("#detail-kicker"),
        detailTitle: document.querySelector("#detail-title"),
        detailDescription: document.querySelector("#detail-description"),
        detailTags: document.querySelector("#detail-tags"),
        detailId: document.querySelector("#detail-id"),
        detailLink: document.querySelector("#detail-link"),
        detailDelete: document.querySelector("#detail-delete")
    };
}

function genererIdUnique() {
    if (window.crypto?.randomUUID) {
        return crypto.randomUUID();
    }

    return `projet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function normaliserProjet(projet) {
    const pile = Array.isArray(projet.stack)
        ? projet.stack
        : String(projet.stack || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

    return {
        id: String(projet.id),
        title: projet.title || projet.libelle || "Projet sans titre",
        image: projet.image || projet.imageSrc || "images/projet1.jpg",
        stack: pile,
        description: projet.description || "Aucune description fournie.",
        link: projet.link || "#"
    };
}

function afficherToast(message, type = "info") {
    const prefixe = {
        info: "Info",
        success: "Succès",
        error: "Erreur"
    }[type] || "Info";

    references.toast.textContent = `${prefixe} : ${message}`;
    references.toast.classList.add("visible");

    window.clearTimeout(toastTimeoutId);
    toastTimeoutId = window.setTimeout(() => {
        references.toast.classList.remove("visible");
    }, 2600);
}

function mettreAJourEtatApi(disponible, message) {
    apiDisponible = disponible;
    references.apiDot.classList.remove("online", "offline");
    references.apiDot.classList.add(disponible ? "online" : "offline");
    references.apiStatusTitle.textContent = disponible ? "API connectée" : "Mode démo local";
    references.apiStatusText.textContent = message;
    references.statsSource.textContent = disponible ? "json-server" : "Mémoire";
}

function mettreAJourCompteurs() {
    const total = projets.length;
    references.countBadge.textContent = `${total} projet${total > 1 ? "s" : ""}`;
    references.statsProjects.textContent = String(total);
}

function creerBoutonCarte(label, classe, gestionnaire) {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = classe;
    bouton.textContent = label;
    bouton.addEventListener("click", gestionnaire);
    return bouton;
}

function creerProjet(idUnique, libelle, sourceImage, description = "", technologies = [], lien = "#") {
    const carte = document.createElement("article");
    carte.className = "project-card";
    carte.dataset.projectId = idUnique;

    if (projetSelectionneId === idUnique) {
        carte.classList.add("active");
    }

    const image = document.createElement("img");
    image.src = sourceImage;
    image.alt = `Illustration du projet ${libelle}`;
    image.loading = "lazy";

    const corps = document.createElement("div");
    corps.className = "project-card-body";

    const titre = document.createElement("h3");
    titre.textContent = libelle;

    const texte = document.createElement("p");
    texte.textContent = description;

    const tags = document.createElement("div");
    tags.className = "tag-list";
    technologies.slice(0, 3).forEach((technologie) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = technologie;
        tags.appendChild(tag);
    });

    const actions = document.createElement("div");
    actions.className = "project-card-actions";
    actions.appendChild(creerBoutonCarte("Détailler", "mini-button", () => detaillerProjet(idUnique)));
    actions.appendChild(creerBoutonCarte("Supprimer", "mini-button delete", () => supprimerProjet(idUnique)));

    if (lien && lien !== "#") {
        const ouvrir = document.createElement("a");
        ouvrir.className = "mini-button";
        ouvrir.href = lien;
        ouvrir.target = "_blank";
        ouvrir.rel = "noreferrer";
        ouvrir.textContent = "Visiter";
        actions.appendChild(ouvrir);
    }

    corps.appendChild(titre);
    corps.appendChild(texte);

    if (tags.childElementCount > 0) {
        corps.appendChild(tags);
    }

    corps.appendChild(actions);
    carte.appendChild(image);
    carte.appendChild(corps);

    return carte;
}

function rendreListeProjets() {
    references.projectsContainer.innerHTML = "";

    projets.forEach((projet) => {
        const carte = creerProjet(
            projet.id,
            projet.title,
            projet.image,
            projet.description,
            projet.stack,
            projet.link
        );

        references.projectsContainer.appendChild(carte);
    });

    mettreAJourCompteurs();
}

function detaillerProjet(idProjet) {
    const projet = projets.find((item) => item.id === String(idProjet));

    if (!projet) {
        afficherToast("Projet introuvable.", "error");
        return;
    }

    projetSelectionneId = projet.id;
    references.detailEmpty.classList.add("hidden");
    references.detailContent.classList.remove("hidden");
    references.detailImage.src = projet.image;
    references.detailImage.alt = `Aperçu du projet ${projet.title}`;
    references.detailKicker.textContent = "Projet sélectionné";
    references.detailTitle.textContent = projet.title;
    references.detailDescription.textContent = projet.description;
    references.detailId.textContent = projet.id;
    references.detailLink.href = projet.link && projet.link !== "#" ? projet.link : "#";
    references.detailLink.textContent = projet.link && projet.link !== "#" ? "Ouvrir la démo" : "Lien non disponible";
    references.detailLink.setAttribute("aria-disabled", projet.link && projet.link !== "#" ? "false" : "true");
    references.detailDelete.onclick = () => supprimerProjet(projet.id);

    references.detailTags.innerHTML = "";
    projet.stack.forEach((technologie) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = technologie;
        references.detailTags.appendChild(tag);
    });

    document.querySelectorAll(".project-card").forEach((carte) => {
        carte.classList.toggle("active", carte.dataset.projectId === projet.id);
    });
}

function preparerDonneesFormulaire() {
    const donnees = new FormData(references.form);

    return {
        id: genererIdUnique(),
        title: String(donnees.get("title") || "").trim(),
        image: String(donnees.get("image") || "").trim(),
        stack: String(donnees.get("stack") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        description: String(donnees.get("description") || "").trim(),
        link: String(donnees.get("link") || "").trim() || "#"
    };
}

async function ajouterProjet(projet) {
    const nouveauProjet = normaliserProjet(projet);

    try {
        let projetPersistant = nouveauProjet;

        if (apiDisponible) {
            const reponse = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nouveauProjet)
            });

            if (!reponse.ok) {
                throw new Error("La sauvegarde distante a échoué.");
            }

            projetPersistant = normaliserProjet(await reponse.json());
        }

        projets.unshift(projetPersistant);
        const carte = creerProjet(
            projetPersistant.id,
            projetPersistant.title,
            projetPersistant.image,
            projetPersistant.description,
            projetPersistant.stack,
            projetPersistant.link
        );

        references.projectsContainer.prepend(carte);
        mettreAJourCompteurs();
        detaillerProjet(projetPersistant.id);
        afficherToast("Le projet a été ajouté avec succès.", "success");
        return true;
    } catch (erreur) {
        afficherToast(erreur.message || "Impossible d'ajouter le projet.", "error");
        return false;
    }
}

async function supprimerProjet(idProjet) {
    const idNormalise = String(idProjet);
    const projet = projets.find((item) => item.id === idNormalise);

    if (!projet) {
        afficherToast("Le projet à supprimer est introuvable.", "error");
        return;
    }

    try {
        if (apiDisponible) {
            const reponse = await fetch(`${API_URL}/${encodeURIComponent(idNormalise)}`, {
                method: "DELETE"
            });

            if (!reponse.ok) {
                throw new Error("La suppression distante a échoué.");
            }
        }

        projets = projets.filter((item) => item.id !== idNormalise);
        projetSelectionneId = projets[0]?.id ?? null;
        rendreListeProjets();

        if (projetSelectionneId) {
            detaillerProjet(projetSelectionneId);
        } else {
            references.detailContent.classList.add("hidden");
            references.detailEmpty.classList.remove("hidden");
        }

        afficherToast(`Le projet "${projet.title}" a été supprimé.`, "success");
    } catch (erreur) {
        afficherToast(erreur.message || "Suppression impossible.", "error");
    }
}

async function chargerProjets() {
    try {
        const reponse = await fetch(API_URL);

        if (!reponse.ok) {
            throw new Error("Réponse serveur inattendue.");
        }

        const donnees = await reponse.json();
        projets = donnees.map(normaliserProjet);
        mettreAJourEtatApi(true, "Les projets sont chargés depuis json-server.");
    } catch (erreur) {
        projets = projetsDemo.map(normaliserProjet);
        mettreAJourEtatApi(false, "json-server est indisponible, les données de démonstration sont utilisées.");
    }

    rendreListeProjets();

    if (projets[0]) {
        detaillerProjet(projets[0].id);
    }
}

async function gererSoumissionFormulaire(evenement) {
    evenement.preventDefault();

    const projet = preparerDonneesFormulaire();

    if (!projet.title || !projet.image || !projet.description) {
        afficherToast("Renseigne au minimum le libellé, l'image et la description.", "error");
        return;
    }

    const ajoute = await ajouterProjet(projet);

    if (ajoute) {
        references.form.reset();
        window.location.hash = "#studio";
    }
}

function gererHash() {
    if (window.location.hash.startsWith("#projet-")) {
        const idProjet = window.location.hash.replace("#projet-", "");
        detaillerProjet(idProjet);
    }
}

function initialiserEvenements() {
    references.form.addEventListener("submit", gererSoumissionFormulaire);
    references.refreshButton.addEventListener("click", chargerProjets);
    window.addEventListener("hashchange", gererHash);
}

async function initialiserApplication() {
    referencerContenusHTML();
    initialiserEvenements();
    await chargerProjets();
    gererHash();
}

document.addEventListener("DOMContentLoaded", initialiserApplication);
