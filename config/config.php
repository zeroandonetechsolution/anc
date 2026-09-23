<?php
define('SITE_NAME', 'Rubi Cables');
define('SITE_URL', 'http://localhost:8000');
define('ADMIN_EMAIL', 'admin@rubicables.com');

$pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
