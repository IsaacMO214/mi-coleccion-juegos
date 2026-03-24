<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/ProblemDetailsException.php";
require_once __DIR__ . "/lib/devuelveJson.php";

$url = "https://www.freetogame.com/api/games?platform=pc&sort-by=release-date";

$opts = [
    "http" => [
        "method" => "GET",
        "header" => "User-Agent: ProyectoGestionJuegos/1.0\r\n"
    ]
];

$context  = stream_context_create($opts);
$response = @file_get_contents($url, false, $context);

if ($response === false)
    throw new ProblemDetailsException([
        "status" => 502,
        "title"  => "No se pudo contactar el servicio de terceros (FreeToGame).",
        "type"   => "/errors/errorexterno.html"
    ]);

$data = json_decode($response);

devuelveJson($data);
