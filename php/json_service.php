<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/BAD_REQUEST.php";
require_once __DIR__ . "/lib/recibeJson.php";
require_once __DIR__ . "/lib/ProblemDetailsException.php";
require_once __DIR__ . "/lib/devuelveJson.php";

$data = recibeJson();

if (empty($data["gameId"]))
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "Falta el campo \"gameId\".",
        "type"   => "/errors/faltagameid.html"
    ]);

$gameId = (int) $data["gameId"];

devuelveJson([
    "success"   => true,
    "message"   => "Procesamiento JSON exitoso. Recibimos el ID: " . $gameId,
    "timestamp" => date("c")
]);
