<?php
// backend/get_posts.php
require_once 'db.php';

try {
    $stmt = $pdo->prepare("
        SELECT id, title, slug, excerpt, cover_image_url, published_at 
        FROM blog_posts 
        WHERE status = 'published' 
        ORDER BY published_at DESC
    ");
    $stmt->execute();
    $posts = $stmt->fetchAll();
    
    echo json_encode(["success" => true, "data" => $posts]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to fetch posts."]);
}
