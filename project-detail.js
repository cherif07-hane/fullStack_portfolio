import { fetchProjet } from "./api.js";
import { creerTag } from "./detailProjet.js";
import { normaliserProjet } from "./projet.js";

const detailRefs = {
    image: document.querySelector("#page-detail-image"),
    kind: document.querySelector("#page-detail-kind"),
    title: document.querySelector("#page-detail-title"),
    description: document.querySelector("#page-detail-description"),
    period: document.querySelector("#page-detail-period"),
    link: document.querySelector("#page-detail-link"),
    tags: document.querySelector("#page-detail-tags"),
    points: document.querySelector("#page-detail-points"),
    copy: document.querySelector("#page-detail-copy")
};

function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
}

function fillProjectPage(project) {
    detailRefs.image.src = project.image;
    detailRefs.image.alt = project.title;
    detailRefs.kind.textContent = project.kind;
    detailRefs.title.textContent = project.title;
    detailRefs.description.textContent = project.description;
    detailRefs.period.textContent = project.id;
    detailRefs.copy.textContent = project.description;

    if (project.link && project.link !== "#") {
        detailRefs.link.href = project.link;
        detailRefs.link.textContent = "Voir la ressource";
    } else {
        detailRefs.link.href = "lister-projets.html";
        detailRefs.link.textContent = "Retour projets";
    }

    detailRefs.tags.innerHTML = "";
    project.stack.forEach((item) => {
        detailRefs.tags.appendChild(creerTag(item));
    });

    detailRefs.points.innerHTML = "";
    project.points.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        detailRefs.points.appendChild(li);
    });

    document.title = `${project.title} | Thierno Cherif HANE`;
}

function showMissingProject() {
    document.body.innerHTML = `
        <div class="page-shell detail-shell">
            <section class="workspace-panel">
                <div class="panel-heading">
                    <p class="eyebrow">Projet</p>
                    <h2>Projet introuvable</h2>
                </div>
                <p class="detail-copy-block">Le projet demande n'existe pas ou n'est plus disponible.</p>
                <a class="button button-primary" href="lister-projets.html">Retour a la liste</a>
            </section>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {
    const idProjet = getProjectIdFromUrl();

    if (!idProjet) {
        showMissingProject();
        return;
    }

    try {
        const project = normaliserProjet(await fetchProjet(idProjet));
        fillProjectPage(project);
    } catch (error) {
        console.error("Impossible de charger le detail du projet.", error);
        showMissingProject();
    }
});
