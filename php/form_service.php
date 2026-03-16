<?php
require_once "error_handling.php";
require_once "setup_db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    throw new ProblemDetailsError("Método no permitido. Use POST.", 405);
}

$title = trim($_POST["title"] ?? "");
$genre = trim($_POST["genre"] ?? "");
$platforms_array = $_POST["platforms"] ?? [];
$platforms = is_array($platforms_array) ? implode(", ", array_map('trim', $platforms_array)) : trim($platforms_array);
$release_year = trim($_POST["release_year"] ?? "");

// Data validation
if (empty($title) || empty($genre)) {
    throw new ProblemDetailsError("Faltan datos requeridos: Título y Género no pueden estar vacíos.", 400);
}

if (empty($platforms)) {
    throw new ProblemDetailsError("Falta ingresar al menos una plataforma.", 400);
}

if (!is_numeric($release_year) || $release_year < 1950 || $release_year > 2100) {
    throw new ProblemDetailsError("Año de lanzamiento inválido.", 400);
}

// Database Insertion
$db = getDB();
$stmt = $db->prepare("INSERT INTO juegos (title, genre, platforms, release_year) VALUES (?, ?, ?, ?)");
$stmt->execute([$title, $genre, $platforms, (int)$release_year]);

header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => "Juego añadido exitosamente a la base de datos."
]);
