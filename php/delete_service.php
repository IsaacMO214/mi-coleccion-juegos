<?php
require_once "error_handling.php";
require_once "setup_db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    throw new ProblemDetailsError("Método no permitido. Use POST.", 405);
}

$id = trim($_POST["id"] ?? "");

if (empty($id) || !is_numeric($id)) {
    throw new ProblemDetailsError("ID inválido para eliminar.", 400);
}

// Database Deletion
$db = getDB();
$stmt = $db->prepare("DELETE FROM juegos WHERE id = ?");
$stmt->execute([(int)$id]);

header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => "Juego eliminado exitosamente."
]);
