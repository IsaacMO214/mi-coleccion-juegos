<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/recibeEnteroObligatorio.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once "setup_db.php";

$id = recibeEnteroObligatorio("id");

$db = getDB();
$stmt = $db->prepare("DELETE FROM juegos WHERE id = ?");
$stmt->execute([$id]);

devuelveJson([
    "success" => true,
    "message" => "Juego eliminado exitosamente."
]);
