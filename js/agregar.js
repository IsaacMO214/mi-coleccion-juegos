import "./lib/manejaErrores.js"
import { submitAccion } from "./lib/submitAccion.js"

/** @type {HTMLFormElement | null} */
const gameForm = document.querySelector("#game-form")

if (gameForm) {
    gameForm.addEventListener("submit", event =>
        submitAccion(event, "php/form_service.php", gameForm, "index.html")
    )
}
