<?php

require_once __DIR__ . "/ProblemDetailsException.php";

function devuelveResultadoNoJson()
{
    throw new ProblemDetailsException([
        "status" => 500,
        "title" => "Los datos no se pudieron convertir a JSON.",
        "type" => "/errors/interno.html"
    ]);
}
