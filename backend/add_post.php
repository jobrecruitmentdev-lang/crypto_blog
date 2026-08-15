<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'db.php';
// Hardcoding secret here because config.php is rsync-ignored and we don't want to overwrite live DB creds
$API_SECRET_KEY = 'super_secret_automation_key_123';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->api_key) || $data->api_key !== $API_SECRET_KEY) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

if (!isset($data->title) || !isset($data->slug) || !isset($data->content)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields: title, slug, content"]);
    exit;
}

$title = $data->title;
$slug = $data->slug;
$content = $data->content;
$excerpt = isset($data->excerpt) ? $data->excerpt : '';
$cover_image = isset($data->cover_image) ? $data->cover_image : '';
$published_at = date('Y-m-d H:i:s');
$author_id = 1; // Default to admin

try {
    $stmt = $pdo->prepare("INSERT INTO posts (title, slug, content, excerpt, cover_image, published_at, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $slug, $content, $excerpt, $cover_image, $published_at, $author_id]);
    echo json_encode(["success" => true, "message" => "Post created successfully", "id" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    // Handle duplicate slug
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["error" => "Slug already exists"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
