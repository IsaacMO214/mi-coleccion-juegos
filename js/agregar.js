import { consume } from './lib/consume.js';
import { muestraError } from './lib/muestraError.js';

document.addEventListener("DOMContentLoaded", () => {
    // ---- Form Service Logic ----
    const gameForm = document.getElementById("game-form");
    const btnSubmitForm = document.getElementById("btn-submit-form");
    const formError = document.getElementById("form-error");
    const formSuccess = document.getElementById("form-success");

    if (gameForm) {
        gameForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (formError) formError.classList.add("hidden");
            if (formSuccess) formSuccess.classList.add("hidden");
            
            const originalBtnText = btnSubmitForm ? btnSubmitForm.textContent : "Guardar";
            if (btnSubmitForm) {
                btnSubmitForm.textContent = "Guardando...";
                btnSubmitForm.disabled = true;
            }

            try {
                const formData = new FormData(gameForm);
                
                const res = await consume(fetch("php/form_service.php", {
                    method: "POST",
                    body: formData
                }));

                const result = await res.json();
                if (formSuccess) {
                    formSuccess.textContent = result.message || "Guardado con éxito.";
                    formSuccess.classList.remove("hidden");
                }
                gameForm.reset();

            } catch (err) {
                if (formError) {
                    formError.textContent = err.message || "Error desconocido";
                    formError.classList.remove("hidden");
                }
                muestraError(err);
            } finally {
                if (btnSubmitForm) {
                    btnSubmitForm.textContent = originalBtnText;
                    btnSubmitForm.disabled = false;
                }
            }
        });
    }
});
