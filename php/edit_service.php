<?php
require_once "error_handling.php";
require_once "setup_db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    throw new ProblemDetailsError("Método no permitido. Use POST.", 405);
}

$id = trim($_POST["id"] ?? "");
$title = trim($_POST["title"] ?? "");
$genre = trim($_POST["genre"] ?? "");
$platforms_array = $_POST["platforms"] ?? [];
$platforms = is_array($platforms_array) ? implode(", ", array_map('trim', $platforms_array)) : trim($platforms_array);
$release_year = trim($_POST["release_year"] ?? "");

if (empty($id) || !is_numeric($id)) {
    throw new ProblemDetailsError("ID inválido para editar.", 400);
}

$db = getDB();

// Build dynamic update
$updates = [];
$params = [];

if (!empty($title)) {
    $updates[] = "title = ?";
    $params[] = $title;
}
if (!empty($genre)) {
    $updates[] = "genre = ?";
    $params[] = $genre;
}
if (!empty($platforms)) {
    $updates[] = "platforms = ?";
    $params[] = $platforms;
}
if ($release_year !== "" && is_numeric($release_year)) {
    $updates[] = "release_year = ?";
    $params[] = (int)$release_year;
}

if (empty($updates)) {
    throw new ProblemDetailsError("No hay campos válidos para actualizar.", 400);
}

$params[] = (int)$id;
$sql = "UPDATE juegos SET " . implode(", ", $updates) . " WHERE id = ?";

$stmt = $db->prepare($sql);
$stmt->execute($params);

header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => "Juego editado exitosamente."
]);
