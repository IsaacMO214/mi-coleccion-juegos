document.addEventListener("DOMContentLoaded", () => {
    // ---- Map & Geolocation Logic ----
    const btnGetLocation = document.getElementById("btn-get-location");
    const locationStatus = document.getElementById("location-status");
    const mapIframe = document.getElementById("map-iframe");

    if (btnGetLocation) {
        btnGetLocation.addEventListener("click", () => {
            if (!navigator.geolocation) {
                if (locationStatus) locationStatus.textContent = "Geolocalización no soportada por el navegador.";
                return;
            }

            if (locationStatus) locationStatus.textContent = "Obteniendo ubicación...";
            btnGetLocation.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    if (mapIframe) mapIframe.src = `https://www.google.com/maps?q=tiendas+de+videojuegos+near+${lat},${lon}&hl=es&z=14&output=embed`;
                    if (locationStatus) {
                        locationStatus.textContent = "Ubicación detectada.";
                        locationStatus.style.color = "var(--success)";
                    }
                    btnGetLocation.disabled = false;
                },
                (error) => {
                    if (locationStatus) {
                        locationStatus.textContent = "Error al obtener la ubicación. Verifica los permisos.";
                        locationStatus.style.color = "var(--error)";
                    }
                    btnGetLocation.disabled = false;
                }
            );
        });
    }
});
