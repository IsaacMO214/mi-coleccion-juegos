<?php
require_once "error_handling.php";
require_once "setup_db.php";
require_once __DIR__ . "/lib/recibeJson.php";
require_once __DIR__ . "/lib/devuelveJson.php";

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Servicio que recibe y devuelve JSON usando las nuevas librerías
    $data = recibeJson();
    
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

devuelveJson($games);
