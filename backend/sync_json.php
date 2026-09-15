<?php
// backend/sync_json.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/projects.php';
require_once __DIR__ . '/articles.php';

// Sync requires authentication
requireAdminAuth();

$stmtP = $pdo->query("SELECT * FROM projects WHERE is_active = 1 ORDER BY heat DESC, id DESC");
$projects = [];
while ($r = $stmtP->fetch()) {
    $projects[] = formatProjectRow($r);
}

$stmtA = $pdo->query("SELECT * FROM articles WHERE is_published = 1 ORDER BY date DESC, id DESC");
$articles = [];
while ($r = $stmtA->fetch()) {
    $articles[] = formatArticleRow($r);
}

echo json_encode([
    'success' => true,
    'projects_count' => count($projects),
    'articles_count' => count($articles),
    'projects' => $projects,
    'articles' => $articles
], JSON_UNESCAPED_UNICODE);
