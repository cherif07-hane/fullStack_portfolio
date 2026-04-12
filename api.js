const API_URL = "http://localhost:3000/projets";

export async function fetchTousProjets() {
    const reponse = await fetch(API_URL);

    if (!reponse.ok) {
        throw new Error(`GET /projets -> ${reponse.status}`);
    }

    return reponse.json();
}

export async function fetchProjet(id) {
    const reponse = await fetch(`${API_URL}/${id}`);

    if (!reponse.ok) {
        throw new Error(`GET /projets/${id} -> ${reponse.status}`);
    }

    return reponse.json();
}

export async function postProjet(projet) {
    const reponse = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projet)
    });

    if (!reponse.ok) {
        throw new Error(`POST /projets -> ${reponse.status}`);
    }

    return reponse.json();
}

export async function putProjet(id, projet) {
    const reponse = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projet)
    });

    if (!reponse.ok) {
        throw new Error(`PUT /projets/${id} -> ${reponse.status}`);
    }

    return reponse.json();
}

export async function deleteProjet(id) {
    const reponse = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!reponse.ok) {
        throw new Error(`DELETE /projets/${id} -> ${reponse.status}`);
    }
}
