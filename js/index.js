import "./lib/manejaErrores.js"
import { consume } from "./lib/consume.js"
import { recibeJson } from "./lib/recibeJson.js"
import { accionElimina } from "./lib/accionElimina.js"
import { htmlentities } from "./lib/htmlentities.js"


/** @type {HTMLDivElement | null} */
const dbResults = document.querySelector("#db-results")

/** @type {HTMLInputElement | null} */
const searchInput = document.querySelector("#search-input")

/** @type {HTMLButtonElement | null} */
const btnBuscar = document.querySelector("#btn-buscar")

/** @type {HTMLButtonElement | null} */
const btnTodos = document.querySelector("#btn-todos")

const mostrarJuegos = async (url) => {
    if (!dbResults) return

    dbResults.innerHTML = "<p>Cargando juegos...</p>"

    const res = await consume(recibeJson(url))
    const games = await res.json()

    if (!games || games.length === 0) {
        dbResults.innerHTML = "<p>No hay juegos que coincidan.</p>"
        return
    }

    // Cada tarjeta tiene un <form> para eliminar, compatible con accionElimina
    dbResults.innerHTML = games.map(game => {
        const title = typeof game.title === "string" ? htmlentities(game.title) : ""
        const genre = typeof game.genre === "string" ? htmlentities(game.genre) : ""
        const platforms = typeof game.platforms === "string" ? htmlentities(game.platforms) : ""
        const year = typeof game.release_year !== "undefined" ? htmlentities(String(game.release_year)) : ""
        const id = game.id
        return `
        <div class="game-card">
            <h3>${title}</h3>
            <div class="tag">${genre}</div>
            <div class="meta">Lanzamiento: ${year}</div>
            <div class="meta"><i class="fi fi-rr-gamepad"></i> ${platforms}</div>
            <div class="card-actions">
                <a href="editar.html?id=${id}" class="btn-sm btn-edit">
                    <i class="fi fi-rr-edit"></i> Editar
                </a>
                <form style="display:inline" onsubmit="return false">
                    <input type="hidden" name="id" value="${id}">
                    <button type="button" class="btn-sm btn-delete"
                        onclick="eliminarJuego(this.closest('form'))">
                        <i class="fi fi-rr-trash"></i> Eliminar
                    </button>
                </form>
            </div>
        </div>`
    }).join("")
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
    btnTodos.addEventListener("click", () => mostrarJuegos("php/db_service.php"))
}

// Expuesto globalmente para el onclick dinámico
window["eliminarJuego"] = (/** @type {HTMLFormElement} */ formulario) =>
    accionElimina("php/delete_service.php", formulario, "¿Eliminar este juego?", "index.html")

mostrarJuegos("php/db_service.php")
