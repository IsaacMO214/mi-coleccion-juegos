<?php

require_once __DIR__ . "/BAD_REQUEST.php";
require_once __DIR__ . "/ProblemDetailsException.php";

/**
 * Recibe un parámetro entero obligatorio desde GET o POST.
 * Si no llega o no es un entero válido, lanza ProblemDetailsException con 400.
 *
 * @param string $nombre Nombre del parámetro esperado.
 * @return int El valor del parámetro como entero.
 */
function recibeEnteroObligatorio(string $nombre): int
{
    $valor = $_GET[$nombre] ?? $_POST[$nombre] ?? null;

    if ($valor === null || trim($valor) === "") {
        throw new ProblemDetailsException([
            "status" => BAD_REQUEST,
            "title"  => "Falta el parámetro \"$nombre\".",
            "type"   => "/errors/faltaparametro.html"
        ]);
    }

    if (!is_numeric($valor) || (int)$valor != $valor) {
        throw new ProblemDetailsException([
            "status" => BAD_REQUEST,
            "title"  => "El parámetro \"$nombre\" debe ser un número entero.",
            "type"   => "/errors/parametronovalido.html"
        ]);
    }

    return (int)$valor;
}
