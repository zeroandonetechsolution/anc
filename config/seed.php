<?php
require_once __DIR__ . '/config.php';

$sqlFile = __DIR__ . '/schema.sql';
if (!file_exists($sqlFile)) {
    die('schema.sql not found');
}

$sql = file_get_contents($sqlFile);

try {
    $pdo->exec($sql);
    echo "Database seeded successfully.\n";
} catch (PDOException $e) {
    die('Seeding failed: ' . $e->getMessage());
}
