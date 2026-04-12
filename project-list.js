import { fetchTousProjets, deleteProjet } from "./api.js";
import { afficherDetailProjet, afficherDetailVide, creerTag } from "./detailProjet.js";
import { projets, setProjets, supprimerEnMemoire } from "./projet.js";

const listRefs = {
    search: document.querySelector("#project-search"),
    kind: document.querySelector("#project-kind-filter"),
    sort: document.querySelector("#project-sort"),
    countBadge: document.querySelector("#project-count-badge"),
    grid: document.querySelector("#projects-container"),
    detailEmpty: document.querySelector("#project-detail-empty"),
    detailContent: document.querySelector("#project-detail-content"),
    detailImage: document.querySelector("#detail-image"),
    detailKicker: document.querySelector("#detail-kicker"),
    detailTitle: document.querySelector("#detail-title"),
    detailDescription: document.querySelector("#detail-description"),
    detailTags: document.querySelector("#detail-tags"),
    detailPoints: document.querySelector("#detail-points"),
    detailId: document.querySelector("#detail-id"),
    detailLink: document.querySelector("#detail-link"),
    detailViewPage: document.querySelector("#detail-view-page"),
    detailEdit: document.querySelector("#detail-edit"),
    detailDelete: document.querySelector("#detail-delete")
};

const listState = {
    search: "",
    kind: "all",
    sort: "recent",
    selectedId: ""
};

let apiDisponible = true;

function summarize(text, maxLength = 150) {
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

function getFilteredProjects() {
    const query = listState.search.toLowerCase();
    const filtered = projets.filter((project) => {
        const matchesSearch = !query
            || project.title.toLowerCase().includes(query)
            || project.description.toLowerCase().includes(query)
            || project.stack.some((item) => item.toLowerCase().includes(query));
        const matchesKind = listState.kind === "all" || project.kind === listState.kind;
        return matchesSearch && matchesKind;
    });

    if (listState.sort === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (listState.sort === "kind") {
        filtered.sort((a, b) => a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title));
    }

    return filtered;
}

function updateCount(count) {
    listRefs.countBadge.textContent = `${count} projet${count > 1 ? "s" : ""}`;
}

function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.tabIndex = 0;

    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.title;
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "project-card-body";

    const top = document.createElement("div");
    top.className = "project-card-top";

    const kind = document.createElement("span");
    kind.className = "project-type";
    kind.textContent = project.kind;

    const period = document.createElement("span");
    period.className = "project-period";
    period.textContent = project.id;

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = summarize(project.description);

    const tags = document.createElement("div");
    tags.className = "tag-list";
    project.stack.slice(0, 2).forEach((item) => {
        tags.appendChild(creerTag(item));
    });

    const actions = document.createElement("div");
    actions.className = "project-card-actions";

    const detailButton = document.createElement("button");
    detailButton.type = "button";
    detailButton.className = "mini-button";
    detailButton.textContent = "Voir le detail";
    detailButton.addEventListener("click", (event) => {
        event.stopPropagation();
        listState.selectedId = project.id;
        afficherDetailProjet(listRefs, project.id);
    });

    top.appendChild(kind);
    top.appendChild(period);
    actions.appendChild(detailButton);
    body.appendChild(top);
    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(tags);
    body.appendChild(actions);
    card.appendChild(image);
    card.appendChild(body);

    card.addEventListener("click", () => {
        listState.selectedId = project.id;
        afficherDetailProjet(listRefs, project.id);
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            listState.selectedId = project.id;
            afficherDetailProjet(listRefs, project.id);
        }
    });

    return card;
}

function renderProjects() {
    const filtered = getFilteredProjects();
    listRefs.grid.innerHTML = "";

    filtered.forEach((project) => {
        listRefs.grid.appendChild(createProjectCard(project));
    });

    updateCount(filtered.length);

    if (filtered.some((project) => project.id === listState.selectedId)) {
        afficherDetailProjet(listRefs, listState.selectedId);
    } else {
        listState.selectedId = "";
        afficherDetailVide(listRefs);
    }
}

function renderLoadingError() {
    listRefs.grid.innerHTML = `
        <article class="workspace-panel">
            <div class="panel-heading">
                <p class="eyebrow">API</p>
                <h2>Impossible de charger les projets</h2>
            </div>
            <p>Demarre json-server avec la commande npm.cmd run api pour retrouver les donnees du portfolio.</p>
        </article>
    `;
    updateCount(0);
    afficherDetailVide(listRefs);
}

async function loadProjects() {
    try {
        const liste = await fetchTousProjets();
        apiDisponible = true;
        setProjets(liste);
        renderProjects();
    } catch (error) {
        console.warn("API indisponible, chargement des projets locaux.", error);
        apiDisponible = false;
        setProjets();
        renderProjects();
    }
}

async function deleteSelectedProject() {
    if (!listState.selectedId) {
        return;
    }

    const project = projets.find((item) => item.id === listState.selectedId);

    if (!project) {
        return;
    }

    const confirmed = window.confirm(`Supprimer le projet "${project.title}" ?`);

    if (!confirmed) {
        return;
    }

    try {
        if (apiDisponible) {
            await deleteProjet(project.id);
        }
        supprimerEnMemoire(project.id);
        listState.selectedId = "";
        renderProjects();
    } catch (error) {
        console.error("Impossible de supprimer le projet.", error);
        if (!apiDisponible) {
            supprimerEnMemoire(project.id);
            listState.selectedId = "";
            renderProjects();
            return;
        }

        window.alert("La suppression a echoue. Verifie que json-server est lance.");
    }
}

function bindEvents() {
    listRefs.search.addEventListener("input", (event) => {
        listState.search = event.target.value.trim();
        renderProjects();
    });

    listRefs.kind.addEventListener("change", (event) => {
        listState.kind = event.target.value;
        renderProjects();
    });

    listRefs.sort.addEventListener("change", (event) => {
        listState.sort = event.target.value;
        renderProjects();
    });

    listRefs.detailDelete.addEventListener("click", deleteSelectedProject);
}

document.addEventListener("DOMContentLoaded", async () => {
    bindEvents();
    await loadProjects();
});
