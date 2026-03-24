<?php

require_once __DIR__ . "/BAD_REQUEST.php";
require_once __DIR__ . "/ProblemDetailsException.php";

/**
 * Recibe un parámetro de texto obligatorio desde GET o POST.
 * Si no llega o está vacío, lanza ProblemDetailsException con 400.
 *
 * @param string $nombre Nombre del parámetro esperado.
 * @return string El valor del parámetro.
 */
function recibeTextoObligatorio(string $nombre): string
{
    $valor = $_GET[$nombre] ?? $_POST[$nombre] ?? null;

    if ($valor === null || trim($valor) === "") {
        throw new ProblemDetailsException([
            "status" => BAD_REQUEST,
            "title"  => "Falta el parámetro \"$nombre\".",
            "type"   => "/errors/faltaparametro.html"
        ]);
    }

    return trim($valor);
}
