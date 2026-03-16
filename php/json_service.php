<?php
require_once "error_handling.php";

// Expect POST request with JSON payload
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data === null) {
    throw new ProblemDetailsError("El cuerpo de la solicitud no es un JSON válido.", 400);
}

if (empty($data["gameId"])) {
    throw new ProblemDetailsError("Falta el campo requerido: 'gameId'.", 400);
}

// Mock some logic for the JSON response
$gameId = (int) $data["gameId"];
$statusMessage = "Procesamiento JSON exitoso. Recibimos el ID: " . $gameId;

header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => $statusMessage,
    "timestamp" => date('c')
]);
