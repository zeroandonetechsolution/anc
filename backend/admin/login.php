<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if (!is_post()) {
    header('Location: index.php');
    exit;
}

$csrf = isset($_POST['csrf']) ? $_POST['csrf'] : '';
if (!verify_csrf_token($csrf)) {
    header('Location: index.php?error=Invalid+request');
    exit;
}

$username = isset($_POST['username']) ? sanitize_input($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($username) || empty($password)) {
    header('Location: index.php?error=Username+and+password+are+required');
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT * FROM admin_users WHERE username = ?');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password_hash'])) {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        session_regenerate_id(true);
        header('Location: dashboard.php');
        exit;
    } else {
        header('Location: index.php?error=Invalid+username+or+password');
        exit;
    }
} catch (PDOException $e) {
    header('Location: index.php?error=Login+failed');
    exit;
}
