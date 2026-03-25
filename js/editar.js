import "./lib/manejaErrores.js"
import { descargaVista } from "./lib/descargaVista.js"
import { submitAccion } from "./lib/submitAccion.js"

/** @type {HTMLFormElement | null} */
const editForm = document.querySelector("#edit-form")

/** @type {HTMLDivElement | null} */
const loadError = document.querySelector("#load-error")

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

if (!id) {
    if (loadError) {
        loadError.textContent = "No se especificó un ID de juego."
        loadError.classList.remove("hidden")
    }
} else {
    // descargaVista llama a muestraObjeto que rellena el formulario automáticamente
    descargaVista(`php/db_service.php?id=${encodeURIComponent(id)}`)

    if (editForm) {
        editForm.addEventListener("submit", event =>
            submitAccion(event, "php/edit_service.php", editForm, "index.html")
        )
    }
}
