<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/BAD_REQUEST.php";
require_once __DIR__ . "/lib/recibeTexto.php";
require_once __DIR__ . "/lib/recibeEnteroObligatorio.php";
require_once __DIR__ . "/lib/ProblemDetailsException.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once "setup_db.php";

$id    = recibeEnteroObligatorio("id");
$title = recibeTexto("title");
$genre = recibeTexto("genre");
$release_year = recibeTexto("release_year");
$platforms_raw = $_POST["platforms"] ?? [];
$platforms = is_array($platforms_raw)
    ? implode(", ", array_map("trim", $platforms_raw))
    : trim($platforms_raw);

if ($title === false || $title === "")
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "Falta el título del juego.",
        "type"   => "/errors/faltatitle.html"
    ]);

if ($genre === false || $genre === "")
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "Falta el género del juego.",
        "type"   => "/errors/faltagenre.html"
    ]);

if ($platforms === "")
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "Debes seleccionar al menos una plataforma.",
        "type"   => "/errors/faltaplatforms.html"
    ]);

if (
    $release_year === false
    || $release_year === ""
    || !is_numeric($release_year)
    || (int)$release_year < 1950
    || (int)$release_year > 2100
)
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title"  => "El año de lanzamiento es inválido (debe estar entre 1950 y 2100).",
        "type"   => "/errors/faltareleaseyear.html"
    ]);

$db = getDB();
$stmt = $db->prepare(
    "UPDATE juegos SET title = ?, genre = ?, platforms = ?, release_year = ? WHERE id = ?"
);
$stmt->execute([$title, $genre, $platforms, (int)$release_year, $id]);

devuelveJson([
    "success" => true,
    "message" => "Juego editado exitosamente."
]);
