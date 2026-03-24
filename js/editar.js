import "./lib/manejaErrores.js"
import { consume } from "./lib/consume.js"
import { recibeJson } from "./lib/recibeJson.js"
import { enviaFormRecibeJson } from "./lib/enviaFormRecibeJson.js"

/** @type {HTMLFormElement | null} */
const editForm = document.querySelector("#edit-form")

/** @type {HTMLInputElement | null} */
const editId = document.querySelector("#edit-id")

/** @type {HTMLInputElement | null} */
const editTitle = document.querySelector("#edit-title")

/** @type {HTMLSelectElement | null} */
const editGenre = document.querySelector("#edit-genre")

/** @type {HTMLInputElement | null} */
const editReleaseYear = document.querySelector("#edit-release_year")

/** @type {HTMLDivElement | null} */
const editSuccess = document.querySelector("#edit-success")

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
    const cargarJuego = async () => {
        const res = await consume(recibeJson(`php/db_service.php?id=${encodeURIComponent(id)}`))
        const game = await res.json()

        if (editId) editId.value = game.id
        if (editTitle) editTitle.value = game.title
        if (editGenre) editGenre.value = game.genre
        if (editReleaseYear) editReleaseYear.value = game.release_year

        /** @type {NodeListOf<HTMLInputElement>} */
        const checkboxes = document.querySelectorAll('input[name="platforms[]"]')
        const plataformas = game.platforms.split(",").map(p => p.trim())
        checkboxes.forEach(cb => {
            cb.checked = plataformas.includes(cb.value)
        })
    }

    cargarJuego()

    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault()

            await consume(enviaFormRecibeJson("php/edit_service.php", editForm))

            if (editSuccess) {
                editSuccess.textContent = "¡Juego actualizado exitosamente!"
                editSuccess.classList.remove("hidden")
            }

            setTimeout(() => {
                window.location.href = "index.html"
            }, 1200)
        })
    }
}
