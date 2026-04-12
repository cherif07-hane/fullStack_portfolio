import { fetchTousProjets } from "./api.js";
import { projets, setProjets } from "./projet.js";

const homeRefs = {
    viewLinks: [],
    views: [],
    statsProjects: null
};

function cacheDom() {
    homeRefs.viewLinks = Array.from(document.querySelectorAll("[data-view-link]"));
    homeRefs.views = Array.from(document.querySelectorAll("[data-view]"));
    homeRefs.statsProjects = document.querySelector("#stats-projets");
}

function showView(viewName) {
    const viewNames = homeRefs.views.map((view) => view.dataset.view).filter(Boolean);
    const requestedView = viewNames.includes(viewName) ? viewName : "accueil";

    homeRefs.views.forEach((view) => {
        view.classList.toggle("active", view.dataset.view === requestedView);
    });

    homeRefs.viewLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.viewLink === requestedView);
    });
}

function handleHash() {
    const hash = window.location.hash || "#accueil";
    showView(hash.replace("#", ""));
}

function bindEvents() {
    window.addEventListener("hashchange", handleHash);

    homeRefs.viewLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const viewName = link.dataset.viewLink || "accueil";
            const href = link.getAttribute("href") || "";

            if (link.tagName === "A" && href.startsWith("#")) {
                event.preventDefault();
                window.location.hash = viewName;
                return;
            }

            if (link.tagName === "BUTTON") {
                window.location.hash = viewName;
            }
        });
    });
}

async function loadStats() {
    if (!homeRefs.statsProjects) {
        return;
    }

    try {
        const liste = await fetchTousProjets();
        setProjets(liste);
        homeRefs.statsProjects.textContent = String(projets.length);
    } catch (error) {
        console.error("Impossible de charger les statistiques projets.", error);
        homeRefs.statsProjects.textContent = "0";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    cacheDom();
    bindEvents();
    handleHash();
    await loadStats();
});
