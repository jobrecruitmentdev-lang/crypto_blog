<?php
// backend/projects.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

// Handle CORS Pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function formatProjectRow($row) {
    return [
        'id' => (int)$row['id'],
        'slug' => $row['slug'],
        'name' => $row['name'],
        'chain' => $row['chain'],
        'status' => is_string($row['status']) ? (json_decode($row['status'], true) ?: []) : ($row['status'] ?: []),
        'reward' => $row['reward'],
        'difficulty' => $row['difficulty'],
        'time' => $row['time'],
        'heat' => (int)$row['heat'],
        'desc' => $row['description'],
        'tags' => is_string($row['tags']) ? (json_decode($row['tags'], true) ?: []) : ($row['tags'] ?: []),
        'featuredImage' => $row['featured_image'],
        'farmingSteps' => is_string($row['farming_steps']) ? (json_decode($row['farming_steps'], true) ?: []) : ($row['farming_steps'] ?: []),
        'officialLinks' => is_string($row['official_links']) ? (json_decode($row['official_links'], true) ?: new stdClass()) : ($row['official_links'] ?: new stdClass()),
        'riskScore' => (int)$row['risk_score'],
        'isActive' => (bool)$row['is_active'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at']
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// GET: Retrieve single or list of projects
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
    if ($slug !== '') {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if ($row) {
            echo json_encode(formatProjectRow($row));
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found']);
        }
        exit;
    }

    $includeInactive = isset($_GET['all']) && checkAdminAuth();
    $sql = $includeInactive 
        ? "SELECT * FROM projects ORDER BY heat DESC, id DESC"
        : "SELECT * FROM projects WHERE is_active = 1 ORDER BY heat DESC, id DESC";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();
    $results = [];
    foreach ($rows as $r) {
        $results[] = formatProjectRow($r);
    }
    echo json_encode(['projects' => $results, 'count' => count($results)]);
    exit;
}

// Write actions require admin token
requireAdminAuth();

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

// -----------------------------------------------------------------------------
// POST: Create a new project
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $slug = trim(isset($data['slug']) ? $data['slug'] : '');
    $name = trim(isset($data['name']) ? $data['name'] : '');
    $chain = trim(isset($data['chain']) ? $data['chain'] : 'EVM');

    if ($slug === '' || $name === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Slug and name are required.']);
        exit;
    }

    // Check slug collision
    $stmt = $pdo->prepare("SELECT id FROM projects WHERE slug = ? LIMIT 1");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Project with this slug already exists.']);
        exit;
    }

    $status = json_encode(isset($data['status']) ? (array)$data['status'] : ['Ongoing'], JSON_UNESCAPED_UNICODE);
    $reward = isset($data['reward']) ? trim($data['reward']) : '$500 - $2,500';
    $difficulty = isset($data['difficulty']) ? trim($data['difficulty']) : 'Medium';
    $time = isset($data['time']) ? trim($data['time']) : '15 min';
    $heat = isset($data['heat']) ? (int)$data['heat'] : 250;
    $desc = isset($data['desc']) ? trim($data['desc']) : (isset($data['description']) ? trim($data['description']) : '');
    $tags = json_encode(isset($data['tags']) ? (array)$data['tags'] : ['Confirmed'], JSON_UNESCAPED_UNICODE);
    $featuredImage = isset($data['featuredImage']) ? trim($data['featuredImage']) : (isset($data['featured_image']) ? trim($data['featured_image']) : '/images/generated/' . $slug . '-project-3d.jpg');
    $farmingSteps = json_encode(isset($data['farmingSteps']) ? (array)$data['farmingSteps'] : [], JSON_UNESCAPED_UNICODE);
    $officialLinks = json_encode(isset($data['officialLinks']) ? (object)$data['officialLinks'] : new stdClass(), JSON_UNESCAPED_UNICODE);
    $riskScore = isset($data['riskScore']) ? (int)$data['riskScore'] : 20;

    $stmt = $pdo->prepare("INSERT INTO projects 
        (slug, name, chain, status, reward, difficulty, time, heat, description, tags, featured_image, farming_steps, official_links, risk_score, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
    $stmt->execute([
        $slug, $name, $chain, $status, $reward, $difficulty, $time, $heat, $desc, $tags, $featuredImage, $farmingSteps, $officialLinks, $riskScore
    ]);

    $newId = $pdo->lastInsertId();
    $fetchStmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
    $fetchStmt->execute([$newId]);
    $created = $fetchStmt->fetch();

    http_response_code(201);
    echo json_encode(['success' => true, 'project' => formatProjectRow($created)]);
    exit;
}

// -----------------------------------------------------------------------------
// PUT: Update an existing project
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $targetSlug = isset($_GET['slug']) ? trim($_GET['slug']) : (isset($data['slug']) ? trim($data['slug']) : '');
    if ($targetSlug === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Target slug is required for update.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM projects WHERE slug = ? LIMIT 1");
    $stmt->execute([$targetSlug]);
    $existing = $stmt->fetch();
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Project not found.']);
        exit;
    }

    $name = isset($data['name']) ? trim($data['name']) : $existing['name'];
    $chain = isset($data['chain']) ? trim($data['chain']) : $existing['chain'];
    $status = isset($data['status']) ? json_encode((array)$data['status'], JSON_UNESCAPED_UNICODE) : $existing['status'];
    $reward = isset($data['reward']) ? trim($data['reward']) : $existing['reward'];
    $difficulty = isset($data['difficulty']) ? trim($data['difficulty']) : $existing['difficulty'];
    $time = isset($data['time']) ? trim($data['time']) : $existing['time'];
    $heat = isset($data['heat']) ? (int)$data['heat'] : (int)$existing['heat'];
    $desc = isset($data['desc']) ? trim($data['desc']) : (isset($data['description']) ? trim($data['description']) : $existing['description']);
    $tags = isset($data['tags']) ? json_encode((array)$data['tags'], JSON_UNESCAPED_UNICODE) : $existing['tags'];
    $featuredImage = isset($data['featuredImage']) ? trim($data['featuredImage']) : (isset($data['featured_image']) ? trim($data['featured_image']) : $existing['featured_image']);
    $farmingSteps = isset($data['farmingSteps']) ? json_encode((array)$data['farmingSteps'], JSON_UNESCAPED_UNICODE) : $existing['farming_steps'];
    $officialLinks = isset($data['officialLinks']) ? json_encode((object)$data['officialLinks'], JSON_UNESCAPED_UNICODE) : $existing['official_links'];
    $riskScore = isset($data['riskScore']) ? (int)$data['riskScore'] : (int)$existing['risk_score'];
    $isActive = isset($data['isActive']) ? ((bool)$data['isActive'] ? 1 : 0) : (int)$existing['is_active'];

    $updateStmt = $pdo->prepare("UPDATE projects SET 
        name = ?, chain = ?, status = ?, reward = ?, difficulty = ?, time = ?, heat = ?, description = ?, tags = ?, featured_image = ?, farming_steps = ?, official_links = ?, risk_score = ?, is_active = ?, updated_at = NOW()
        WHERE slug = ?");
    $updateStmt->execute([
        $name, $chain, $status, $reward, $difficulty, $time, $heat, $desc, $tags, $featuredImage, $farmingSteps, $officialLinks, $riskScore, $isActive, $targetSlug
    ]);

    $fetchStmt = $pdo->prepare("SELECT * FROM projects WHERE slug = ?");
    $fetchStmt->execute([$targetSlug]);
    $updated = $fetchStmt->fetch();

    echo json_encode(['success' => true, 'project' => formatProjectRow($updated)]);
    exit;
}

// -----------------------------------------------------------------------------
// DELETE: Remove project
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $targetSlug = isset($_GET['slug']) ? trim($_GET['slug']) : (isset($data['slug']) ? trim($data['slug']) : '');
    if ($targetSlug === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Target slug is required for deletion.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM projects WHERE slug = ?");
    $stmt->execute([$targetSlug]);
    $affected = $stmt->rowCount();

    if ($affected > 0) {
        echo json_encode(['success' => true, 'deletedSlug' => $targetSlug]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Project not found or already deleted.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
