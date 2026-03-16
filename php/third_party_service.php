<?php
require_once "error_handling.php";

// Free public API for games
$url = "https://www.freetogame.com/api/games?platform=pc&sort-by=release-date";

$opts = [
    "http" => [
        "method" => "GET",
        "header" => "User-Agent: ProyectoGestionJuegos/1.0\r\n"
    ]
];

$context = stream_context_create($opts);

$response = @file_get_contents($url, false, $context);

if ($response === false) {
    throw new ProblemDetailsError("Error al contactar el servicio de terceros.", 502);
}

header('Content-Type: application/json');
echo $response;
