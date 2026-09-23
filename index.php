<?php
$req = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($req === '/' || $req === '/index.php') {
    $file = __DIR__ . '/frontend/index.html';
    if (file_exists($file)) {
        readfile($file);
        exit;
    }
}

$target = __DIR__ . $req;
if (file_exists($target) && is_file($target)) {
    readfile($target);
    exit;
}

http_response_code(404);
echo 'Not Found';
