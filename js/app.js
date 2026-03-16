document.addEventListener("DOMContentLoaded", () => {
    // ---- Navigation Logic ----
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".view-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            // Update active states
            navButtons.forEach(b => b.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(targetId).classList.add("active");
            
            // Auto fetch when appropriate section is opened
            if(targetId === "view-db") fetchGamesFromDB();
            if(targetId === "view-recommendations") {
                if(document.getElementById("recommendations-results").innerHTML.trim() === "") {
                    fetchRecommendations();
                }
            }
        });
    });

    // Helper to format ProblemDetails
    const formatErrorMsg = (err) => {
        if(err.detail) return `${err.title}: ${err.detail}`;
        if(err.title) return err.title;
        return "Un error desconocido ocurrió.";
    };

    // ---- DB Service Logic ----

    const dbResults = document.getElementById("db-results");
    const dbErrorMsg = document.getElementById("db-error-msg");
    const searchInput = document.getElementById("search-input");
    
    let allGames = []; // Almacenar juegos para búsqueda en cliente

    let searchTimeout = null;

    const renderGames = (gamesToRender) => {
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
        try {
            dbErrorMsg.classList.add("hidden");
            dbResults.innerHTML = "<p>Cargando juegos...</p>";
            let res;

            if (searchTerm) {
                // Servicio que RECIBE JSON (Búsqueda) y DEVUELVE JSON
                res = await fetch("php/db_service.php", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchTerm })
                });
            } else {
                // GET normal
                res = await fetch("php/db_service.php");
            }
            
            if(!res.ok) {
                const errData = await res.json();
                throw errData;
            }

            allGames = await res.json(); // DEVUELVE JSON
            renderGames(allGames);

        } catch (err) {
            dbResults.innerHTML = "";
            dbErrorMsg.textContent = formatErrorMsg(err);
            dbErrorMsg.classList.remove("hidden");
        }
    };
    
    // Función global para eliminar 
    window.deleteGame = async (id) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este juego?")) return;
        
        try {
            const formData = new FormData();
            formData.append("id", id);
            
            const res = await fetch("php/delete_service.php", {
                method: "POST",
                body: formData
            });
            
            if(!res.ok) throw await res.json();
            
            // Refrescar lista
            await fetchGamesFromDB();
        } catch (err) {
            alert(formatErrorMsg(err));
        }
    };

    // Búsqueda en servidor enviando JSON (Debounce)
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchGamesFromDB(query);
        }, 300); // 300ms delay
    };

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    // ---- Terceros API Logic (Recomendaciones Pestaña) ----
    const recResults = document.getElementById("recommendations-results");
    const apiErrorMsg = document.getElementById("api-error-msg");
    const btnRefreshRecs = document.getElementById("btn-refresh-recommendations");

    const fetchRecommendations = async () => {
        try {
            apiErrorMsg.classList.add("hidden");
            recResults.innerHTML = "<p>Conectando con la API y buscando juegos gratis...</p>";
            
            const res = await fetch("php/third_party_service.php");
            if(!res.ok) throw new Error("Fallo al contactar el servicio de terceros.");
            
            const data = await res.json();
            
            if(data && data.length > 0) {
                // Tomar 12 juegos aleatorios de la extensa lista gratuita para no saturar
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
            apiErrorMsg.textContent = "Servicio no disponible actualmente. " + e.message;
            apiErrorMsg.classList.remove("hidden");
        }
    };

    if(btnRefreshRecs) {
        btnRefreshRecs.addEventListener("click", fetchRecommendations);
    }


    // ---- Edit Service Logic ----
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const editError = document.getElementById("edit-error");
    const btnSubmitEdit = document.getElementById("btn-submit-edit");
    const btnCloseEdit = document.getElementById("btn-close-edit");

    window.openEditModal = (id) => {
        const game = allGames.find(g => g.id == id);
        if (!game) return;
        
        document.getElementById("edit-id").value = game.id;
        document.getElementById("edit-title").value = game.title;
        document.getElementById("edit-genre").value = game.genre;
        
        const checkboxes = document.querySelectorAll('#edit-form input[name="platforms[]"]');
        checkboxes.forEach(cb => cb.checked = false);
        const gamePlatforms = game.platforms.split(",").map(p => p.trim());
        checkboxes.forEach(cb => {
            if (gamePlatforms.includes(cb.value)) {
                cb.checked = true;
            }
        });

        document.getElementById("edit-release_year").value = game.release_year;
        
        editError.classList.add("hidden");
        editModal.classList.remove("hidden");
    };

    if (btnCloseEdit) {
        btnCloseEdit.addEventListener("click", () => {
            editModal.classList.add("hidden");
        });
    }

    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            editError.classList.add("hidden");
            
            const originalBtnText = btnSubmitEdit.textContent;
            btnSubmitEdit.textContent = "Guardando...";
            btnSubmitEdit.disabled = true;

            try {
                const formData = new FormData(editForm);
                const res = await fetch("php/edit_service.php", {
                    method: "POST",
                    body: formData
                });

                if(!res.ok) throw await res.json();
                
                editModal.classList.add("hidden");
                // Refrescar base de datos
                await fetchGamesFromDB();

            } catch (err) {
                editError.textContent = formatErrorMsg(err);
                editError.classList.remove("hidden");
            } finally {
                btnSubmitEdit.textContent = originalBtnText;
                btnSubmitEdit.disabled = false;
            }
        });
    }

    // ---- Form Service Logic ----
    const gameForm = document.getElementById("game-form");
    const btnSubmitForm = document.getElementById("btn-submit-form");
    const formError = document.getElementById("form-error");
    const formSuccess = document.getElementById("form-success");

    gameForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        formError.classList.add("hidden");
        formSuccess.classList.add("hidden");
        
        const originalBtnText = btnSubmitForm.textContent;
        btnSubmitForm.textContent = "Guardando...";
        btnSubmitForm.disabled = true;

        try {
            const formData = new FormData(gameForm);
            
            const res = await fetch("php/form_service.php", {
                method: "POST",
                body: formData
            });

            if(!res.ok) {
                const errData = await res.json();
                throw errData;
            }

            const result = await res.json();
            formSuccess.textContent = result.message || "Guardado con éxito.";
            formSuccess.classList.remove("hidden");
            gameForm.reset();

        } catch (err) {
            formError.textContent = formatErrorMsg(err);
            formError.classList.remove("hidden");
        } finally {
            btnSubmitForm.textContent = originalBtnText;
            btnSubmitForm.disabled = false;
        }
    });


    // ---- Map & Geolocation Logic ----
    const btnGetLocation = document.getElementById("btn-get-location");
    const locationStatus = document.getElementById("location-status");
    const mapIframe = document.getElementById("map-iframe");

    if (btnGetLocation) {
        btnGetLocation.addEventListener("click", () => {
            if (!navigator.geolocation) {
                locationStatus.textContent = "Geolocalización no soportada por el navegador.";
                return;
            }

            locationStatus.textContent = "Obteniendo ubicación...";
            btnGetLocation.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    // Búsqueda de tiendas de videojuegos cerca del usuario
                    mapIframe.src = `https://www.google.com/maps?q=tiendas+de+videojuegos+near+${lat},${lon}&hl=es&z=14&output=embed`;
                    locationStatus.textContent = "Ubicación detectada.";
                    locationStatus.style.color = "var(--success)";
                    btnGetLocation.disabled = false;
                },
                (error) => {
                    locationStatus.textContent = "Error al obtener la ubicación. Verifica los permisos.";
                    locationStatus.style.color = "var(--error)";
                    btnGetLocation.disabled = false;
                }
            );
        });
    }

    // Initialize first view
    fetchGamesFromDB();
});
