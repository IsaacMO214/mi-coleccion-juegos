<?php

/**
 * Recibe un parámetro de texto desde GET o POST.
 * Devuelve false si el parámetro no existe.
 *
 * @param string $nombre Nombre del parámetro.
 * @return string|false El valor del parámetro o false si no existe.
 */
function recibeTexto(string $nombre): string|false
{
    $valor = $_GET[$nombre] ?? $_POST[$nombre] ?? false;

    if ($valor === false) {
        return false;
    }

    return trim($valor);
}
