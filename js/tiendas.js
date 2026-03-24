import "./lib/manejaErrores.js"

/** @type {HTMLButtonElement | null} */
const btnGetLocation = document.querySelector("#btn-get-location")

/** @type {HTMLSpanElement | null} */
const locationStatus = document.querySelector("#location-status")

/** @type {HTMLIFrameElement | null} */
const mapIframe = document.querySelector("#map-iframe")

if (btnGetLocation) {
    btnGetLocation.addEventListener("click", () => {
        if (!navigator.geolocation) {
            if (locationStatus) locationStatus.textContent = "Geolocalización no soportada por el navegador."
            return
        }

        if (locationStatus) locationStatus.textContent = "Obteniendo ubicación..."
        btnGetLocation.disabled = true

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude
                if (mapIframe) mapIframe.src = `https://www.google.com/maps?q=tiendas+de+videojuegos+near+${lat},${lon}&hl=es&z=14&output=embed`
                if (locationStatus) {
                    locationStatus.textContent = "Ubicación detectada."
                    locationStatus.style.color = "var(--success)"
                }
                btnGetLocation.disabled = false
            },
            () => {
                if (locationStatus) {
                    locationStatus.textContent = "Error al obtener la ubicación. Verifica los permisos."
                    locationStatus.style.color = "var(--error)"
                }
                btnGetLocation.disabled = false
            }
        )
    })
}
