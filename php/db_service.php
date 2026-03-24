<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/recibeTexto.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once "setup_db.php";

$db = getDB();

// ?id=X → devuelve un solo juego (para la página de editar)
if (isset($_GET["id"])) {
    $id = recibeTexto("id");
    $stmt = $db->prepare("SELECT * FROM juegos WHERE id = ?");
    $stmt->execute([$id]);
    $game = $stmt->fetch();
    devuelveJson($game);
}

// ?query=texto → búsqueda por título o género
if (isset($_GET["query"])) {
    $query = recibeTexto("query");
    $param = "%" . $query . "%";
    $stmt = $db->prepare("SELECT * FROM juegos WHERE title LIKE ? OR genre LIKE ? ORDER BY id DESC");
    $stmt->execute([$param, $param]);
    devuelveJson($stmt->fetchAll());
}

// Sin parámetros → todos los juegos
$stmt = $db->query("SELECT * FROM juegos ORDER BY id DESC");
devuelveJson($stmt->fetchAll());
