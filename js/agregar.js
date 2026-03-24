import "./lib/manejaErrores.js"
import { consume } from "./lib/consume.js"
import { enviaFormRecibeJson } from "./lib/enviaFormRecibeJson.js"

/** @type {HTMLFormElement | null} */
const gameForm = document.querySelector("#game-form")

/** @type {HTMLButtonElement | null} */
const btnSubmitForm = document.querySelector("#btn-submit-form")

/** @type {HTMLDivElement | null} */
const formError = document.querySelector("#form-error")

/** @type {HTMLDivElement | null} */
const formSuccess = document.querySelector("#form-success")

if (gameForm) {
    gameForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (formError) formError.classList.add("hidden")
        if (formSuccess) formSuccess.classList.add("hidden")

        const originalBtnText = btnSubmitForm ? btnSubmitForm.textContent : "Guardar"
        if (btnSubmitForm) {
            btnSubmitForm.textContent = "Guardando..."
            btnSubmitForm.disabled = true
        }

        const res = await consume(enviaFormRecibeJson("php/form_service.php", gameForm))
        const result = await res.json()

        if (formSuccess) {
            formSuccess.textContent = result.message || "Guardado con éxito."
            formSuccess.classList.remove("hidden")
        }
        gameForm.reset()

        if (btnSubmitForm) {
            btnSubmitForm.textContent = originalBtnText
            btnSubmitForm.disabled = false
        }
    })
}
