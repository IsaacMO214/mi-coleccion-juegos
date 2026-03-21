import { consume } from './lib/consume.js';
import { recibeJson } from './lib/recibeJson.js';
import { muestraError } from './lib/muestraError.js';

document.addEventListener("DOMContentLoaded", () => {
    // ---- Terceros API Logic ----
    const recResults = document.getElementById("recommendations-results");
    const apiErrorMsg = document.getElementById("api-error-msg");
    const btnRefreshRecs = document.getElementById("btn-refresh-recommendations");

    const fetchRecommendations = async () => {
        if (!apiErrorMsg || !recResults) return;

        try {
            apiErrorMsg.classList.add("hidden");
            recResults.innerHTML = "<p>Conectando con la API y buscando juegos gratis...</p>";
            
            const res = await consume(recibeJson("php/third_party_service.php"));
            const data = await res.json();
            
            if(data && data.length > 0) {
                const shuffled = data.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 12);
                
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
                            <a href="${game.game_url}" target="_blank" class="btn-primary" style="display:block; text-align:center; text-decoration:none; width:100%;">
                                Obtener Juego
                            </a>
                        </div>
                    </div>
                `).join("");
            } else {
                recResults.innerHTML = "<p>No se encontraron juegos gratuitos en este momento.</p>";
            }

        } catch(e) {
            recResults.innerHTML = "";
            apiErrorMsg.textContent = "Servicio no disponible actualmente. " + (e.message || "");
            apiErrorMsg.classList.remove("hidden");
            muestraError(e);
        }
    };

    if(btnRefreshRecs) {
        btnRefreshRecs.addEventListener("click", fetchRecommendations);
    }

    // Iniciar automáticamente si abrimos la página
    fetchRecommendations();
});
