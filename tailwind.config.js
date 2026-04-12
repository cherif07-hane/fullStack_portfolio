/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./ajouter-projet.html",
        "./lister-projets.html",
        "./detailler-projet.html",
        "./*.js",
    ],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            colors: {
                brand: {
                    light: "#f8fafc",
                    soft: "#e0f2fe",
                    primary: "#0f766e",
                    accent: "#facc15",
                    dark: "#0f172a",
                    danger: "#be123c",
                },
            },
            fontFamily: {
                body: ["Segoe UI", "sans-serif"],
            },
        },
    },
    plugins: [],
};
