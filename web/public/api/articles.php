<?php
// backend/articles.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function formatArticleRow($row) {
    return [
        'id' => (int)$row['id'],
        'slug' => $row['slug'],
        'pageType' => $row['page_type'],
        'tag' => $row['tag'],
        'title' => $row['title'],
        'excerpt' => $row['excerpt'],
        'tldr' => $row['tldr'],
        'keyTakeaways' => is_string($row['key_takeaways']) ? (json_decode($row['key_takeaways'], true) ?: []) : ($row['key_takeaways'] ?: []),
        'date' => $row['date'],
        'updatedAt' => $row['updated_at_date'],
        'read' => $row['read_time'],
        'authorSlug' => $row['author_slug'],
        'body' => $row['body'],
        'featuredImage' => $row['featured_image'],
        'middleImage' => $row['middle_image'],
        'preFaqImage' => $row['pre_faq_image'],
        'faqs' => is_string($row['faqs']) ? (json_decode($row['faqs'], true) ?: []) : ($row['faqs'] ?: []),
        'seo' => is_string($row['seo']) ? (json_decode($row['seo'], true) ?: new stdClass()) : ($row['seo'] ?: new stdClass()),
        'isPublished' => (bool)$row['is_published'],
        'createdAt' => $row['created_at'],
        'updatedAtTimestamp' => $row['updated_at']
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// GET: Retrieve single or list of articles
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
    if ($slug !== '') {
        $stmt = $pdo->prepare("SELECT * FROM articles WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if ($row) {
            echo json_encode(formatArticleRow($row));
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Article not found']);
        }
        exit;
    }

    $pageType = isset($_GET['type']) ? trim($_GET['type']) : '';
    $includeDrafts = isset($_GET['all']) && checkAdminAuth();

    if ($pageType !== '') {
        $sql = $includeDrafts
            ? "SELECT * FROM articles WHERE page_type = ? ORDER BY date DESC, id DESC"
            : "SELECT * FROM articles WHERE page_type = ? AND is_published = 1 ORDER BY date DESC, id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$pageType]);
    } else {
        $sql = $includeDrafts
            ? "SELECT * FROM articles ORDER BY date DESC, id DESC"
            : "SELECT * FROM articles WHERE is_published = 1 ORDER BY date DESC, id DESC";
        $stmt = $pdo->query($sql);
    }

    $rows = $stmt->fetchAll();
    $results = [];
    foreach ($rows as $r) {
        $results[] = formatArticleRow($r);
    }
    echo json_encode(['articles' => $results, 'count' => count($results)]);
    exit;
}

// Write actions require admin token
requireAdminAuth();

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

// -----------------------------------------------------------------------------
// POST: Create a new article (intelligence, guide, methodology, editorial)
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $slug = trim(isset($data['slug']) ? $data['slug'] : '');
    $title = trim(isset($data['title']) ? $data['title'] : '');
    $pageType = trim(isset($data['pageType']) ? $data['pageType'] : 'intelligence');

    if ($slug === '' || $title === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Slug and title are required.']);
        exit;
    }

    if (!in_array($pageType, ['intelligence', 'guides', 'methodology', 'editorial'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid pageType. Allowed: intelligence, guides, methodology, editorial.']);
        exit;
    }

    // Check slug collision
    $stmt = $pdo->prepare("SELECT id FROM articles WHERE slug = ? LIMIT 1");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Article with this slug already exists.']);
        exit;
    }

    $tag = isset($data['tag']) ? trim($data['tag']) : ($pageType === 'guides' ? 'Farming Playbook' : 'Ecosystem Alpha');
    $excerpt = isset($data['excerpt']) ? trim($data['excerpt']) : '';
    $tldr = isset($data['tldr']) ? trim($data['tldr']) : $excerpt;
    $keyTakeaways = json_encode(isset($data['keyTakeaways']) ? (array)$data['keyTakeaways'] : [], JSON_UNESCAPED_UNICODE);
    $date = isset($data['date']) ? trim($data['date']) : date('Y-m-d');
    $updatedAtDate = isset($data['updatedAt']) ? trim($data['updatedAt']) : $date;
    $read = isset($data['read']) ? trim($data['read']) : '8 min read';
    $authorSlug = isset($data['authorSlug']) ? trim($data['authorSlug']) : 'ai-intelligence-engine';
    $body = isset($data['body']) ? trim($data['body']) : '';
    $featuredImage = isset($data['featuredImage']) ? trim($data['featuredImage']) : '/images/generated/' . $slug . '-featured-3d.jpg';
    $middleImage = isset($data['middleImage']) ? trim($data['middleImage']) : '/images/generated/' . $slug . '-middle-3d.jpg';
    $preFaqImage = isset($data['preFaqImage']) ? trim($data['preFaqImage']) : '/images/generated/' . $slug . '-pre_faq-3d.jpg';
    $faqs = json_encode(isset($data['faqs']) ? (array)$data['faqs'] : [], JSON_UNESCAPED_UNICODE);
    $seo = json_encode(isset($data['seo']) ? (object)$data['seo'] : new stdClass(), JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare("INSERT INTO articles 
        (slug, page_type, tag, title, excerpt, tldr, key_takeaways, date, updated_at_date, read_time, author_slug, body, featured_image, middle_image, pre_faq_image, faqs, seo, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
    $stmt->execute([
        $slug, $pageType, $tag, $title, $excerpt, $tldr, $keyTakeaways, $date, $updatedAtDate, $read, $authorSlug, $body, $featuredImage, $middleImage, $preFaqImage, $faqs, $seo
    ]);

    $newId = $pdo->lastInsertId();
    $fetchStmt = $pdo->prepare("SELECT * FROM articles WHERE id = ?");
    $fetchStmt->execute([$newId]);
    $created = $fetchStmt->fetch();

    http_response_code(201);
    echo json_encode(['success' => true, 'article' => formatArticleRow($created)]);
    exit;
}

// -----------------------------------------------------------------------------
// PUT: Update an existing article
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $targetSlug = isset($_GET['slug']) ? trim($_GET['slug']) : (isset($data['slug']) ? trim($data['slug']) : '');
    if ($targetSlug === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Target slug is required for update.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM articles WHERE slug = ? LIMIT 1");
    $stmt->execute([$targetSlug]);
    $existing = $stmt->fetch();
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Article not found.']);
        exit;
    }

    $pageType = isset($data['pageType']) ? trim($data['pageType']) : $existing['page_type'];
    $tag = isset($data['tag']) ? trim($data['tag']) : $existing['tag'];
    $title = isset($data['title']) ? trim($data['title']) : $existing['title'];
    $excerpt = isset($data['excerpt']) ? trim($data['excerpt']) : $existing['excerpt'];
    $tldr = isset($data['tldr']) ? trim($data['tldr']) : $existing['tldr'];
    $keyTakeaways = isset($data['keyTakeaways']) ? json_encode((array)$data['keyTakeaways'], JSON_UNESCAPED_UNICODE) : $existing['key_takeaways'];
    $date = isset($data['date']) ? trim($data['date']) : $existing['date'];
    $updatedAtDate = isset($data['updatedAt']) ? trim($data['updatedAt']) : date('Y-m-d');
    $read = isset($data['read']) ? trim($data['read']) : $existing['read_time'];
    $authorSlug = isset($data['authorSlug']) ? trim($data['authorSlug']) : $existing['author_slug'];
    $body = isset($data['body']) ? trim($data['body']) : $existing['body'];
    $featuredImage = isset($data['featuredImage']) ? trim($data['featuredImage']) : $existing['featured_image'];
    $middleImage = isset($data['middleImage']) ? trim($data['middleImage']) : $existing['middle_image'];
    $preFaqImage = isset($data['preFaqImage']) ? trim($data['preFaqImage']) : $existing['pre_faq_image'];
    $faqs = isset($data['faqs']) ? json_encode((array)$data['faqs'], JSON_UNESCAPED_UNICODE) : $existing['faqs'];
    $seo = isset($data['seo']) ? json_encode((object)$data['seo'], JSON_UNESCAPED_UNICODE) : $existing['seo'];
    $isPublished = isset($data['isPublished']) ? ((bool)$data['isPublished'] ? 1 : 0) : (int)$existing['is_published'];

    $updateStmt = $pdo->prepare("UPDATE articles SET 
        page_type = ?, tag = ?, title = ?, excerpt = ?, tldr = ?, key_takeaways = ?, date = ?, updated_at_date = ?, read_time = ?, author_slug = ?, body = ?, featured_image = ?, middle_image = ?, pre_faq_image = ?, faqs = ?, seo = ?, is_published = ?, updated_at = NOW()
        WHERE slug = ?");
    $updateStmt->execute([
        $pageType, $tag, $title, $excerpt, $tldr, $keyTakeaways, $date, $updatedAtDate, $read, $authorSlug, $body, $featuredImage, $middleImage, $preFaqImage, $faqs, $seo, $isPublished, $targetSlug
    ]);

    $fetchStmt = $pdo->prepare("SELECT * FROM articles WHERE slug = ?");
    $fetchStmt->execute([$targetSlug]);
    $updated = $fetchStmt->fetch();

    echo json_encode(['success' => true, 'article' => formatArticleRow($updated)]);
    exit;
}

// -----------------------------------------------------------------------------
// DELETE: Remove article
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $targetSlug = isset($_GET['slug']) ? trim($_GET['slug']) : (isset($data['slug']) ? trim($data['slug']) : '');
    if ($targetSlug === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Target slug is required for deletion.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM articles WHERE slug = ?");
    $stmt->execute([$targetSlug]);
    $affected = $stmt->rowCount();

    if ($affected > 0) {
        echo json_encode(['success' => true, 'deletedSlug' => $targetSlug]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Article not found or already deleted.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
