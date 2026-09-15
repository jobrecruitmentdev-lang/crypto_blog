<?php
// backend/login.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$username = isset($body['username']) ? trim($body['username']) : '';
$password = isset($body['password']) ? trim($body['password']) : '';

if ($username === ADMIN_USER && $password === ADMIN_PASS) {
    $token = hash_hmac('sha256', ADMIN_USER . ':' . ADMIN_PASS, API_SECRET_KEY);
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'username' => ADMIN_USER,
            'role' => 'administrator'
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid username or password'
    ]);
}
