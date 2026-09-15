<?php
// backend/auth_helper.php
require_once __DIR__ . '/config.php';

function checkAdminAuth() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
        $expected = hash_hmac('sha256', ADMIN_USER . ':' . ADMIN_PASS, API_SECRET_KEY);
        if (hash_equals($expected, $token)) {
            return true;
        }
    }

    // Direct secret key check for scripts/automation
    $apiKey = isset($headers['X-Api-Key']) ? $headers['X-Api-Key'] : '';
    if ($apiKey && hash_equals(API_SECRET_KEY, $apiKey)) {
        return true;
    }

    return false;
}

function requireAdminAuth() {
    if (!checkAdminAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Invalid or missing admin authentication token.']);
        exit;
    }
}
