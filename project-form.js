import { fetchProjet, postProjet, putProjet } from "./api.js";
import { creerProjet } from "./projet.js";

const formRefs = {
    form: document.querySelector("#project-form"),
    editId: document.querySelector("#project-edit-id"),
    title: document.querySelector("#project-title"),
    period: document.querySelector("#project-period"),
    image: document.querySelector("#project-image"),
    link: document.querySelector("#project-link"),
    stack: document.querySelector("#project-stack"),
    description: document.querySelector("#project-description"),
    submit: document.querySelector("#project-submit-button"),
    pageTitle: document.querySelector("#form-page-title"),
    pageCopy: document.querySelector("#form-page-copy"),
    heading: document.querySelector("#project-form-heading")
};

let projetEnEdition = null;

function getEditIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("edit") || "";
}

function fillForm(project) {
    projetEnEdition = project;
    formRefs.editId.value = project.id;
    formRefs.title.value = project.title;
    formRefs.period.value = project.id;
    formRefs.image.value = project.image;
    formRefs.stack.value = project.stack.join(", ");
    formRefs.link.value = project.link === "#" ? "" : project.link;
    formRefs.description.value = project.description;
    formRefs.submit.textContent = "Mettre a jour le projet";
    formRefs.pageTitle.textContent = "Modifier un projet";
    formRefs.pageCopy.textContent = "Cette page sert uniquement a mettre a jour un projet existant.";
    formRefs.heading.textContent = "Modifier le projet";
}

async function initEditMode() {
    const editId = getEditIdFromUrl();

    if (!editId) {
        return;
    }

    try {
        const project = await fetchProjet(editId);
        fillForm(project);
    } catch (error) {
        console.error("Impossible de charger le projet a modifier.", error);
        window.alert("Impossible de charger ce projet. Verifie que json-server est lance.");
    }
}

function readFormProject() {
    const formData = new FormData(formRefs.form);
    const kind = projetEnEdition && projetEnEdition.kind ? projetEnEdition.kind : "Projet personnel";
    const points = projetEnEdition && Array.isArray(projetEnEdition.points) && projetEnEdition.points.length
        ? projetEnEdition.points
        : ["Projet ajoute depuis le portfolio"];

    return creerProjet(
        formData.get("period"),
        formData.get("title"),
        formData.get("description"),
        formData.get("image"),
        formData.get("stack"),
        formData.get("link"),
        kind,
        points
    );
}

async function handleSubmit(event) {
    event.preventDefault();

    const project = readFormProject();
    const originalId = formRefs.editId.value.trim();

    if (!project.id || !project.title || !project.description) {
        window.alert("Renseigne la periode, le titre et la description.");
        return;
    }

    try {
        if (originalId) {
            await putProjet(originalId, project);
        } else {
            await postProjet(project);
        }

        window.location.href = "lister-projets.html";
    } catch (error) {
        console.error("Impossible d'enregistrer le projet.", error);
        window.alert("L'enregistrement a echoue. Verifie que json-server est lance.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await initEditMode();
    formRefs.form.addEventListener("submit", handleSubmit);
});
