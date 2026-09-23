<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if (!is_post()) {
    json_response(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    $input = $_POST;
}

$errors = [];

$name = isset($input['name']) ? sanitize_input($input['name']) : '';
$email = isset($input['email']) ? sanitize_input($input['email']) : '';
$phone = isset($input['phone']) ? sanitize_input($input['phone']) : '';
$service = isset($input['service']) ? sanitize_input($input['service']) : '';
$message = isset($input['message']) ? sanitize_input($input['message']) : '';

if (empty($name)) {
    $errors['name'] = 'Name is required';
}

if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (empty($phone)) {
    $errors['phone'] = 'Phone is required';
} elseif (!preg_match('/^\d{10,}$/', $phone)) {
    $errors['phone'] = 'Phone must be at least 10 digits';
}

if (empty($service)) {
    $errors['service'] = 'Service is required';
}

if (empty($message)) {
    $errors['message'] = 'Message is required';
}

if (!empty($errors)) {
    json_response(['success' => false, 'errors' => $errors], 422);
}

$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';

try {
    $stmt = $pdo->prepare(
        'INSERT INTO contacts (name, email, phone, service, message, ip) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, $email, $phone, $service, $message, $ip]);
    json_response(['success' => true, 'message' => 'Thank you, we will contact you shortly.']);
} catch (PDOException $e) {
    json_response(['success' => false, 'message' => 'Database error occurred'], 500);
}
