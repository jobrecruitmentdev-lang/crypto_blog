<?php
// backend/ticker.php
// Production Ticker & Announcement Strip REST API

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Auto-initialize ticker_items and site_settings tables if not present
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS ticker_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        symbol VARCHAR(30) NOT NULL,
        price VARCHAR(50) NOT NULL,
        change_24h VARCHAR(30) NOT NULL,
        is_up TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (
        key_name VARCHAR(100) PRIMARY KEY,
        key_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Check if empty, seed default items
    $countCheck = $pdo->query("SELECT COUNT(*) FROM ticker_items")->fetchColumn();
    if ($countCheck == 0) {
        $stmt = $pdo->prepare("INSERT INTO ticker_items (symbol, price, change_24h, is_up, sort_order) VALUES (?, ?, ?, ?, ?)");
        $seeds = [
            ['BTC', '$64,250', '+2.4%', 1, 1],
            ['ETH', '$3,480', '+1.8%', 1, 2],
            ['SOL', '$152', '-0.5%', 0, 3],
            ['BERA', '$14.20', '+8.9%', 1, 4],
            ['MONAD', '$28.50', '+12.1%', 1, 5],
        ];
        foreach ($seeds as $s) {
            $stmt->execute($s);
        }
    }

    // Check if alpha_dispatch setting exists
    $alphaCheck = $pdo->prepare("SELECT key_value FROM site_settings WHERE key_name = 'alpha_dispatch'");
    $alphaCheck->execute();
    if (!$alphaCheck->fetch()) {
        $defaultAlpha = json_encode([
            'title' => '2026 Security Playbook →',
            'url'   => '/blog/how-to-farm-airdrops-safely-2026/'
        ]);
        $pdo->prepare("INSERT INTO site_settings (key_name, key_value) VALUES ('alpha_dispatch', ?)")->execute([$defaultAlpha]);
    }
} catch (PDOException $e) {
    // Database schema fallback if permissions are restricted
}

$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// GET: Fetch all active ticker items & alpha dispatch settings
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, symbol, price, change_24h, is_up, sort_order FROM ticker_items WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $formatted = array_map(function($row) {
            return [
                'id' => (int)$row['id'],
                'sym' => $row['symbol'],
                'price' => $row['price'],
                'chg' => $row['change_24h'],
                'up' => (bool)$row['is_up'],
                'sort' => (int)$row['sort_order'],
            ];
        }, $items);

        $alphaRow = $pdo->query("SELECT key_value FROM site_settings WHERE key_name = 'alpha_dispatch'")->fetch();
        $alphaDispatch = $alphaRow ? json_decode($alphaRow['key_value'], true) : [
            'title' => '2026 Security Playbook →',
            'url'   => '/blog/how-to-farm-airdrops-safely-2026/'
        ];

        echo json_encode([
            'ticker' => $formatted,
            'alphaDispatch' => $alphaDispatch
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch ticker data: ' . $e->getMessage()]);
    }
    exit;
}

// Ensure caller is authenticated as admin for any write operations
requireAdminAuth();

// -----------------------------------------------------------------------------
// POST: Add new ticker item OR update alpha dispatch
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body.']);
        exit;
    }

    // Case 1: Update Alpha Dispatch
    if (isset($input['alphaDispatch'])) {
        $alphaData = json_encode([
            'title' => trim($input['alphaDispatch']['title'] ?? '2026 Security Playbook →'),
            'url'   => trim($input['alphaDispatch']['url'] ?? '/blog/how-to-farm-airdrops-safely-2026/')
        ]);
        $stmt = $pdo->prepare("INSERT INTO site_settings (key_name, key_value) VALUES ('alpha_dispatch', ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)");
        $stmt->execute([$alphaData]);
        echo json_encode(['success' => true, 'alphaDispatch' => json_decode($alphaData, true)]);
        exit;
    }

    // Case 2: Add Ticker Item
    $symbol = strtoupper(trim($input['sym'] ?? $input['symbol'] ?? ''));
    $price = trim($input['price'] ?? '');
    $chg = trim($input['chg'] ?? $input['change_24h'] ?? '+0.0%');

    if ($symbol === '' || $price === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Symbol and Price are required.']);
        exit;
    }

    // Auto calculate trend: negative if contains '-'
    $isUp = strpos($chg, '-') === false ? 1 : 0;
    if (isset($input['up'])) {
        $isUp = $input['up'] ? 1 : 0;
    }

    $sortOrder = isset($input['sort']) ? (int)$input['sort'] : (int)($pdo->query("SELECT MAX(sort_order) FROM ticker_items")->fetchColumn() + 1);

    $stmt = $pdo->prepare("INSERT INTO ticker_items (symbol, price, change_24h, is_up, sort_order) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$symbol, $price, $chg, $isUp, $sortOrder]);
    $newId = (int)$pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'item' => [
            'id' => $newId,
            'sym' => $symbol,
            'price' => $price,
            'chg' => $chg,
            'up' => (bool)$isUp,
            'sort' => $sortOrder
        ]
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// PUT: Update an existing ticker item
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : (int)($input['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing or invalid item ID for update.']);
        exit;
    }

    $symbol = strtoupper(trim($input['sym'] ?? $input['symbol'] ?? ''));
    $price = trim($input['price'] ?? '');
    $chg = trim($input['chg'] ?? $input['change_24h'] ?? '');

    $isUp = strpos($chg, '-') === false ? 1 : 0;
    if (isset($input['up'])) {
        $isUp = $input['up'] ? 1 : 0;
    }

    $sort = isset($input['sort']) ? (int)$input['sort'] : null;

    if ($sort !== null) {
        $stmt = $pdo->prepare("UPDATE ticker_items SET symbol = ?, price = ?, change_24h = ?, is_up = ?, sort_order = ? WHERE id = ?");
        $stmt->execute([$symbol, $price, $chg, $isUp, $sort, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE ticker_items SET symbol = ?, price = ?, change_24h = ?, is_up = ? WHERE id = ?");
        $stmt->execute([$symbol, $price, $chg, $isUp, $id]);
    }

    echo json_encode([
        'success' => true,
        'item' => [
            'id' => $id,
            'sym' => $symbol,
            'price' => $price,
            'chg' => $chg,
            'up' => (bool)$isUp,
            'sort' => $sort
        ]
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// DELETE: Remove ticker item
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing or invalid item ID for delete.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM ticker_items WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'deletedId' => $id]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed.']);
