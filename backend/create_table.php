<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once 'db.php';

// ONLY RUN THIS ONCE, VERY SIMPLE SECURITY
if (isset($_GET['setup']) && $_GET['setup'] === 'yes_please_123') {
    try {
        $sql = "CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            content LONGTEXT NOT NULL,
            excerpt TEXT,
            cover_image VARCHAR(255),
            published_at DATETIME,
            author_id INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($sql);
        echo json_encode(["success" => true, "message" => "Table 'posts' created successfully!"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error creating table: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Unauthorized"]);
}
