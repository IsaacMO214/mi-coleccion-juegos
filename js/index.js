import "./lib/manejaErrores.js"
import { consume } from "./lib/consume.js"
import { recibeJson } from "./lib/recibeJson.js"

/** @type {HTMLDivElement | null} */
const dbResults = document.querySelector("#db-results")

/** @type {HTMLDivElement | null} */
const dbErrorMsg = document.querySelector("#db-error-msg")

/** @type {HTMLInputElement | null} */
const searchInput = document.querySelector("#search-input")

/** @type {HTMLButtonElement | null} */
const btnBuscar = document.querySelector("#btn-buscar")

/** @type {HTMLButtonElement | null} */
const btnTodos = document.querySelector("#btn-todos")

const mostrarJuegos = async (url) => {
    if (!dbResults || !dbErrorMsg) return

    dbErrorMsg.classList.add("hidden")
    dbResults.innerHTML = "<p>Cargando juegos...</p>"

    const res = await consume(recibeJson(url))
    const games = await res.json()

    if (!games || games.length === 0) {
        dbResults.innerHTML = "<p>No hay juegos que coincidan.</p>"
        return
    }

    dbResults.innerHTML = games.map(game => `
        <div class="game-card">
            <h3>${game.title}</h3>
            <div class="tag">${game.genre}</div>
            <div class="meta">Lanzamiento: ${game.release_year}</div>
            <div class="meta"><i class="fi fi-rr-gamepad"></i> ${game.platforms}</div>
            <div class="card-actions">
                <a href="editar.html?id=${game.id}" class="btn-sm btn-edit">
                    <i class="fi fi-rr-edit"></i> Editar
                </a>
                <button class="btn-sm btn-delete" onclick="eliminarJuego(${game.id})">
                    <i class="fi fi-rr-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join("")
}

if (btnBuscar) {
    btnBuscar.addEventListener("click", () => {
        const query = searchInput ? searchInput.value.trim() : ""
        const url = query
            ? `php/db_service.php?query=${encodeURIComponent(query)}`
            : "php/db_service.php"
        mostrarJuegos(url)
    })
}

if (btnTodos) {
    btnTodos.addEventListener("click", () => {
        mostrarJuegos("php/db_service.php")
    })
}

window["eliminarJuego"] = async (id) => {
    if (!confirm("¿Eliminar este juego?")) return

    const formData = new FormData()
    formData.append("id", id)

    await consume(fetch("php/delete_service.php", { method: "POST", body: formData }))
    mostrarJuegos("php/db_service.php")
}

mostrarJuegos("php/db_service.php")
