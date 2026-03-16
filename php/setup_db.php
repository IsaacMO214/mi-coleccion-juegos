<?php
require_once "error_handling.php";

function getDB() {
    $dbPath = __DIR__ . '/games.db';
    $isNew = !file_exists($dbPath);
    
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    if ($isNew) {
        $db->exec("CREATE TABLE IF NOT EXISTS juegos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            genre TEXT NOT NULL,
            platforms TEXT NOT NULL,
            release_year INTEGER NOT NULL
        )");
        
        // Insert sample data
        $stmt = $db->prepare("INSERT INTO juegos (title, genre, platforms, release_year) VALUES (?, ?, ?, ?)");
        $stmt->execute(["The Legend of Zelda: Breath of the Wild", "Aventura", "Nintendo Switch 2", 2017]);
        $stmt->execute(["Super Mario Odyssey", "Plataformas", "Nintendo Switch 2", 2017]);
        $stmt->execute(["The Witcher 3: Wild Hunt", "RPG", "PC, PlayStation 4, Xbox One", 2015]);
    }
    
    return $db;
}

// if executed directly, initialize the DB
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    getDB();
    echo json_encode(["status" => "Dabase setup sequence completed successfully."]);
}
