import "./lib/manejaErrores.js"
import { consume } from "./lib/consume.js"
import { recibeJson } from "./lib/recibeJson.js"

/** @type {HTMLDivElement | null} */
const recResults = document.querySelector("#recommendations-results")

/** @type {HTMLDivElement | null} */
const apiErrorMsg = document.querySelector("#api-error-msg")

/** @type {HTMLButtonElement | null} */
const btnRefreshRecs = document.querySelector("#btn-refresh-recommendations")

const fetchRecommendations = async () => {
    if (!apiErrorMsg || !recResults) return

    apiErrorMsg.classList.add("hidden")
    recResults.innerHTML = "<p>Conectando con la API y buscando juegos gratis...</p>"

    const res = await consume(recibeJson("php/third_party_service.php"))
    const data = await res.json()

    if (data && data.length > 0) {
        const selected = data.sort(() => 0.5 - Math.random()).slice(0, 12)
        recResults.innerHTML = selected.map(game => `
            <div class="game-card">
                <img src="${game.thumbnail}" alt="${game.title}" style="aspect-ratio: auto; min-height:140px; background:#e5e5e5;">
                <h3>${game.title}</h3>
                <div class="tag">${game.genre}</div>
                <div class="meta" style="margin-top:auto;">
                    Plataforma: ${game.platform} <br>
                    Desarrollador: ${game.developer}
                </div>
                <div class="card-actions" style="margin-top:10px;">
                    <a href="${game.game_url}" target="_blank" class="btn-primary"
                        style="display:block; text-align:center; text-decoration:none; width:100%;">
                        Obtener Juego
                    </a>
                </div>
            </div>
        `).join("")
    } else {
        recResults.innerHTML = "<p>No se encontraron juegos gratuitos en este momento.</p>"
    }
}

if (btnRefreshRecs) {
    btnRefreshRecs.addEventListener("click", fetchRecommendations)
}

fetchRecommendations()
