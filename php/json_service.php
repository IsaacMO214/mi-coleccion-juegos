<?php
require_once "error_handling.php";
require_once __DIR__ . "/lib/recibeJson.php";
require_once __DIR__ . "/lib/devuelveJson.php";

// Expect POST request with JSON payload
$data = recibeJson();

if (empty($data["gameId"])) {
    throw new ProblemDetailsError("Falta el campo requerido: 'gameId'.", 400); // Mantenemos el mismo, o podríamos usar ProblemDetailsException
}

// Mock some logic for the JSON response
$gameId = (int) $data["gameId"];
$statusMessage = "Procesamiento JSON exitoso. Recibimos el ID: " . $gameId;

devuelveJson([
    "success" => true,
    "message" => $statusMessage,
    "timestamp" => date('c')
]);
