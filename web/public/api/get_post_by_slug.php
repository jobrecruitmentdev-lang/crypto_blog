<?php
// backend/get_post_by_slug.php
require_once 'db.php';

if (!isset($_GET['slug']) || empty($_GET['slug'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Slug is required."]);
    exit;
}

$slug = $_GET['slug'];

try {
    $stmt = $pdo->prepare("
        SELECT id, title, slug, excerpt, body, cover_image_url, published_at, seo_title, seo_description, focus_keyword
        FROM blog_posts 
        WHERE slug = ? AND status = 'published'
        LIMIT 1
    ");
    $stmt->execute([$slug]);
    $post = $stmt->fetch();
    
    if ($post) {
        echo json_encode(["success" => true, "data" => $post]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Post not found."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to fetch the post."]);
}
