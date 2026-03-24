<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/BAD_REQUEST.php";
require_once __DIR__ . "/lib/recibeTexto.php";
require_once __DIR__ . "/lib/ProblemDetailsException.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once "setup_db.php";

$id = recibeTexto("id");

if ($id === false || $id === "")
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "Falta el id del juego.",
        "type"   => "/errors/faltaid.html"
    ]);

if (!is_numeric($id))
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "El id debe ser un número entero.",
        "type"   => "/errors/faltaid.html"
    ]);

$db = getDB();
$stmt = $db->prepare("DELETE FROM juegos WHERE id = ?");
$stmt->execute([(int)$id]);

devuelveJson([
    "success" => true,
    "message" => "Juego eliminado exitosamente."
]);
