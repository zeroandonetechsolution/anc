<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if (!isset($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

if (!is_post()) {
    header('Location: dashboard.php');
    exit;
}

$csrf = isset($_POST['csrf']) ? $_POST['csrf'] : '';
if (!verify_csrf_token($csrf)) {
    header('Location: dashboard.php');
    exit;
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

if ($id > 0) {
    try {
        $stmt = $pdo->prepare('DELETE FROM contacts WHERE id = ?');
        $stmt->execute([$id]);
    } catch (PDOException $e) {
    }
}

header('Location: dashboard.php');
exit;
