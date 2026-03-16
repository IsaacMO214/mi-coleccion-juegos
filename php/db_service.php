<?php
require_once "error_handling.php";
require_once "setup_db.php";

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Servicio que recibe y devuelve JSON
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if ($data === null && !empty($json)) {
        throw new ProblemDetailsError("El cuerpo de la solicitud no es un JSON válido.", 400);
    }
    
    $query = $data['query'] ?? '';
    $stmt = $db->prepare("SELECT * FROM juegos WHERE title LIKE ? OR genre LIKE ? ORDER BY id DESC");
    $searchParam = '%' . $query . '%';
    $stmt->execute([$searchParam, $searchParam]);
    $games = $stmt->fetchAll();
} else {
    // GET request (Default)
    $stmt = $db->query("SELECT * FROM juegos ORDER BY id DESC");
    $games = $stmt->fetchAll();
}

header('Content-Type: application/json');
echo json_encode($games);
