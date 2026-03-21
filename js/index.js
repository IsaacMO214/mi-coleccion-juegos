import { enviaJsonRecibeJson } from './lib/enviaJsonRecibeJson.js';
import { consume } from './lib/consume.js';
import { recibeJson } from './lib/recibeJson.js';
import { muestraError } from './lib/muestraError.js';

document.addEventListener("DOMContentLoaded", () => {
    const dbResults = document.getElementById("db-results");
    const dbErrorMsg = document.getElementById("db-error-msg");
    const searchInput = document.getElementById("search-input");
    
    let allGames = [];
    let searchTimeout = null;

    const renderGames = (gamesToRender) => {
        if(!dbResults) return;
        if(!gamesToRender || gamesToRender.length === 0) {
            dbResults.innerHTML = "<p>No hay juegos que coincidan.</p>";
            return;
        }

        dbResults.innerHTML = gamesToRender.map(game => `
            <div class="game-card">
                <h3>${game.title}</h3>
                <div class="tag">${game.genre}</div>
                <div class="meta">Lanzamiento: ${game.release_year}</div>
                <div class="meta"><i class="fi fi-rr-gamepad"></i> ${game.platforms}</div>
                
                <div class="card-actions">
                    <button class="btn-sm btn-edit" onclick="openEditModal(${game.id})"><i class="fi fi-rr-edit"></i> Editar</button>
                    <button class="btn-sm btn-delete" onclick="deleteGame(${game.id})"><i class="fi fi-rr-trash"></i> Eliminar</button>
                </div>
            </div>
        `).join("");
    };

    const fetchGamesFromDB = async (searchTerm = "") => {
        if (!dbErrorMsg || !dbResults) return;
        try {
            dbErrorMsg.classList.add("hidden");
            dbResults.innerHTML = "<p>Cargando juegos...</p>";
            let res;

            if (searchTerm) {
                res = await consume(enviaJsonRecibeJson("php/db_service.php", { query: searchTerm }, "POST"));
            } else {
                res = await consume(recibeJson("php/db_service.php"));
            }

            allGames = await res.json();
            renderGames(allGames);

        } catch (err) {
            dbResults.innerHTML = "";
            dbErrorMsg.textContent = err.message || "Error desconocido";
            dbErrorMsg.classList.remove("hidden");
            muestraError(err);
        }
    };
    
    window.deleteGame = async (id) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este juego?")) return;
        
        try {
            const formData = new FormData();
            formData.append("id", id);
            
            await consume(fetch("php/delete_service.php", {
                method: "POST",
                body: formData
            }));
            
            await fetchGamesFromDB();
        } catch (err) {
            muestraError(err);
        }
    };

    const handleSearch = () => {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchGamesFromDB(query);
        }, 300);
    };

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    // ---- Edit Service Logic ----
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const editError = document.getElementById("edit-error");
    const btnSubmitEdit = document.getElementById("btn-submit-edit");
    const btnCloseEdit = document.getElementById("btn-close-edit");

    window.openEditModal = (id) => {
        const game = allGames.find(g => g.id == id);
        if (!game || !editModal) return;
        
        document.getElementById("edit-id").value = game.id;
        document.getElementById("edit-title").value = game.title;
        document.getElementById("edit-genre").value = game.genre;
        
        const checkboxes = document.querySelectorAll('#edit-form input[name="platforms[]"]');
        checkboxes.forEach(cb => cb.checked = false);
        const gamePlatforms = game.platforms.split(",").map(p => p.trim());
        checkboxes.forEach(cb => {
            if (gamePlatforms.includes(cb.value)) cb.checked = true;
        });

        document.getElementById("edit-release_year").value = game.release_year;
        
        if (editError) editError.classList.add("hidden");
        editModal.classList.remove("hidden");
    };

    if (btnCloseEdit && editModal) {
        btnCloseEdit.addEventListener("click", () => {
            editModal.classList.add("hidden");
        });
    }

    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (editError) editError.classList.add("hidden");
            
            const originalBtnText = btnSubmitEdit ? btnSubmitEdit.textContent : "Guardar";
            if (btnSubmitEdit) {
                btnSubmitEdit.textContent = "Guardando...";
                btnSubmitEdit.disabled = true;
            }

            try {
                const formData = new FormData(editForm);
                await consume(fetch("php/edit_service.php", {
                    method: "POST",
                    body: formData
                }));
                
                if (editModal) editModal.classList.add("hidden");
                await fetchGamesFromDB();

            } catch (err) {
                if (editError) {
                    editError.textContent = err.message || "Error desconocido";
                    editError.classList.remove("hidden");
                }
                muestraError(err);
            } finally {
                if (btnSubmitEdit) {
                    btnSubmitEdit.textContent = originalBtnText;
                    btnSubmitEdit.disabled = false;
                }
            }
        });
    }

    // Initialize first view
    fetchGamesFromDB();
});
