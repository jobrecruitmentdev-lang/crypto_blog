<?php
// backend/tracker.php
// Institutional Airdrop Portfolio & Operations Tracker API for DHARA COMMAND
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

// Enhanced CORS support for methods & headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Api-Key");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -----------------------------------------------------------------------------
// Auto-Migration: Ensure table exists
// -----------------------------------------------------------------------------
try {
    $createTableSql = "
        CREATE TABLE IF NOT EXISTS airdrop_tracker (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_name VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL DEFAULT 'tap_to_earn',
            status VARCHAR(50) NOT NULL DEFAULT 'active',
            listing_date DATE NULL,
            listing_quarter VARCHAR(50) DEFAULT '',
            expected_tokens VARCHAR(100) DEFAULT '0',
            est_price DECIMAL(16, 6) DEFAULT 0.000000,
            expected_usd DECIMAL(16, 2) DEFAULT 0.00,
            actual_received_usd DECIMAL(16, 2) DEFAULT 0.00,
            accounts_count INT DEFAULT 1,
            daily_routine VARCHAR(50) DEFAULT 'daily_claim',
            farm_url TEXT,
            notes TEXT,
            daily_task_done TINYINT(1) DEFAULT 0,
            daily_task_date DATE NULL,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_category (category),
            INDEX idx_listing_date (listing_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    $pdo->exec($createTableSql);
} catch (PDOException $e) {
    // Silently continue if already exists or permissions handled
}

function formatTrackerRow($row) {
    return [
        'id' => (int)$row['id'],
        'projectName' => $row['project_name'] ?: 'Untitled Project',
        'category' => $row['category'] ?: 'tap_to_earn',
        'status' => $row['status'] ?: 'active',
        'listingDate' => $row['listing_date'] ?: '',
        'listingQuarter' => $row['listing_quarter'] ?: '',
        'expectedTokens' => (string)($row['expected_tokens'] !== null ? $row['expected_tokens'] : '0'),
        'estPrice' => (float)$row['est_price'],
        'expectedUsd' => (float)$row['expected_usd'],
        'actualReceivedUsd' => (float)$row['actual_received_usd'],
        'accountsCount' => (int)($row['accounts_count'] ?: 1),
        'dailyRoutine' => $row['daily_routine'] ?: 'daily_claim',
        'farmUrl' => $row['farm_url'] ?: '',
        'notes' => $row['notes'] ?: '',
        'dailyTaskDone' => (bool)$row['daily_task_done'],
        'dailyTaskDate' => $row['daily_task_date'] ?: '',
        'sortOrder' => (int)($row['sort_order'] ?: 0),
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at']
    ];
}

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

// -----------------------------------------------------------------------------
// GET: Retrieve all tracker entries & calculate KPI metrics
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM airdrop_tracker ORDER BY sort_order ASC, CASE WHEN status = 'active' THEN 0 WHEN status = 'listing_soon' THEN 1 ELSE 2 END, id DESC");
        $rows = $stmt->fetchAll();

        // If table is empty, auto-seed with initial starter items
        if (count($rows) === 0) {
            $seeds = [
                [
                    'project_name' => 'Blum Crypto',
                    'category' => 'tap_to_earn',
                    'status' => 'active',
                    'listing_date' => date('Y-m-d', strtotime('+20 days')),
                    'listing_quarter' => 'Q4 2026',
                    'expected_tokens' => '250000',
                    'est_price' => 0.005,
                    'expected_usd' => 125.00,
                    'actual_received_usd' => 0.00,
                    'accounts_count' => 2,
                    'daily_routine' => 'eight_hour',
                    'farm_url' => 'https://t.me/blum',
                    'notes' => 'Claim farm every 8 hours. Play drop games daily with tickets.',
                    'daily_task_done' => 0
                ],
                [
                    'project_name' => 'Grass DePIN Network',
                    'category' => 'depin_node',
                    'status' => 'listing_soon',
                    'listing_date' => date('Y-m-d', strtotime('+7 days')),
                    'listing_quarter' => 'Stage 2 TGE',
                    'expected_tokens' => '120',
                    'est_price' => 1.85,
                    'expected_usd' => 222.00,
                    'actual_received_usd' => 0.00,
                    'accounts_count' => 1,
                    'daily_routine' => 'passive_node',
                    'farm_url' => 'https://app.getgrass.io',
                    'notes' => 'Node running on Chrome browser extension. Solana wallet connected.',
                    'daily_task_done' => 1
                ],
                [
                    'project_name' => 'Berachain bArtio Testnet',
                    'category' => 'testnet',
                    'status' => 'active',
                    'listing_date' => date('Y-m-d', strtotime('+45 days')),
                    'listing_quarter' => 'Q4 2026',
                    'expected_tokens' => '500',
                    'est_price' => 4.50,
                    'expected_usd' => 2250.00,
                    'actual_received_usd' => 0.00,
                    'accounts_count' => 3,
                    'daily_routine' => 'weekly_tx',
                    'farm_url' => 'https://bartio.faucet.berachain.com',
                    'notes' => 'Weekly swap on BEX + stake HONEY in Berps vault.',
                    'daily_task_done' => 0
                ],
                [
                    'project_name' => 'Major Telegram Stars',
                    'category' => 'tap_to_earn',
                    'status' => 'snapshot',
                    'listing_date' => date('Y-m-d', strtotime('+12 days')),
                    'listing_quarter' => 'TGE Nov',
                    'expected_tokens' => '45000',
                    'est_price' => 0.008,
                    'expected_usd' => 360.00,
                    'actual_received_usd' => 0.00,
                    'accounts_count' => 1,
                    'daily_routine' => 'daily_claim',
                    'farm_url' => 'https://t.me/major',
                    'notes' => 'Snapshot phase completed. TON wallet verified with 0.1 TON balance.',
                    'daily_task_done' => 1
                ]
            ];

            $insertSql = "INSERT INTO airdrop_tracker (project_name, category, status, listing_date, listing_quarter, expected_tokens, est_price, expected_usd, actual_received_usd, accounts_count, daily_routine, farm_url, notes, daily_task_done) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $insStmt = $pdo->prepare($insertSql);
            foreach ($seeds as $s) {
                $insStmt->execute([
                    $s['project_name'], $s['category'], $s['status'], $s['listing_date'],
                    $s['listing_quarter'], $s['expected_tokens'], $s['est_price'],
                    $s['expected_usd'], $s['actual_received_usd'], $s['accounts_count'],
                    $s['daily_routine'], $s['farm_url'], $s['notes'], $s['daily_task_done']
                ]);
            }

            // Refetch after seeding
            $stmt = $pdo->query("SELECT * FROM airdrop_tracker ORDER BY sort_order ASC, id DESC");
            $rows = $stmt->fetchAll();
        }

        $items = [];
        $totalActive = 0;
        $totalExpectedUsd = 0.0;
        $totalActualUsd = 0.0;
        $listingThisMonth = 0;
        $dailyPending = 0;
        $currentMonth = date('Y-m');

        foreach ($rows as $r) {
            $formatted = formatTrackerRow($r);
            $items[] = $formatted;

            if ($formatted['status'] === 'active') {
                $totalActive++;
            }
            $totalExpectedUsd += $formatted['expectedUsd'];
            $totalActualUsd += $formatted['actualReceivedUsd'];

            if (!empty($formatted['listingDate']) && strpos($formatted['listingDate'], $currentMonth) === 0) {
                $listingThisMonth++;
            }

            if ($formatted['status'] === 'active' && !$formatted['dailyTaskDone']) {
                $dailyPending++;
            }
        }

        echo json_encode([
            'success' => true,
            'items' => $items,
            'stats' => [
                'totalItems' => count($items),
                'totalActive' => $totalActive,
                'totalExpectedUsd' => round($totalExpectedUsd, 2),
                'totalActualUsd' => round($totalActualUsd, 2),
                'listingThisMonth' => $listingThisMonth,
                'dailyPending' => $dailyPending
            ]
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
}

// Write actions require valid admin auth token
requireAdminAuth();

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

// -----------------------------------------------------------------------------
// POST: Create a new airdrop entry
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    $projectName = trim(isset($data['projectName']) ? $data['projectName'] : 'New Airdrop');
    $category = trim(isset($data['category']) ? $data['category'] : 'tap_to_earn');
    $status = trim(isset($data['status']) ? $data['status'] : 'active');
    $listingDate = !empty($data['listingDate']) ? $data['listingDate'] : null;
    $listingQuarter = trim(isset($data['listingQuarter']) ? $data['listingQuarter'] : '');
    $expectedTokens = trim(isset($data['expectedTokens']) ? (string)$data['expectedTokens'] : '0');
    $estPrice = isset($data['estPrice']) ? (float)$data['estPrice'] : 0.0;
    
    // Auto-calculate expected USD if 0 or not provided
    $expectedUsd = isset($data['expectedUsd']) && (float)$data['expectedUsd'] > 0 
        ? (float)$data['expectedUsd'] 
        : (floatval(preg_replace('/[^0-9.]/', '', $expectedTokens)) * $estPrice);

    $actualReceivedUsd = isset($data['actualReceivedUsd']) ? (float)$data['actualReceivedUsd'] : 0.0;
    $accountsCount = isset($data['accountsCount']) ? max(1, (int)$data['accountsCount']) : 1;
    $dailyRoutine = trim(isset($data['dailyRoutine']) ? $data['dailyRoutine'] : 'daily_claim');
    $farmUrl = trim(isset($data['farmUrl']) ? $data['farmUrl'] : '');
    $notes = trim(isset($data['notes']) ? $data['notes'] : '');
    $dailyTaskDone = !empty($data['dailyTaskDone']) ? 1 : 0;

    $sql = "INSERT INTO airdrop_tracker (project_name, category, status, listing_date, listing_quarter, expected_tokens, est_price, expected_usd, actual_received_usd, accounts_count, daily_routine, farm_url, notes, daily_task_done) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $projectName, $category, $status, $listingDate, $listingQuarter,
        $expectedTokens, $estPrice, $expectedUsd, $actualReceivedUsd,
        $accountsCount, $dailyRoutine, $farmUrl, $notes, $dailyTaskDone
    ]);

    $newId = $pdo->lastInsertId();
    $fetchStmt = $pdo->prepare("SELECT * FROM airdrop_tracker WHERE id = ?");
    $fetchStmt->execute([$newId]);
    $newRow = $fetchStmt->fetch();

    echo json_encode([
        'success' => true,
        'item' => formatTrackerRow($newRow),
        'message' => 'Airdrop entry created successfully.'
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// PATCH: Debounced Single Field or Partial Auto-Save
// -----------------------------------------------------------------------------
if ($method === 'PATCH') {
    $id = isset($data['id']) ? (int)$data['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid record id is required.']);
        exit;
    }

    // Check if item exists
    $checkStmt = $pdo->prepare("SELECT * FROM airdrop_tracker WHERE id = ?");
    $checkStmt->execute([$id]);
    $existing = $checkStmt->fetch();
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'Airdrop tracker record not found.']);
        exit;
    }

    // Supported field mappings
    $fieldMap = [
        'projectName' => 'project_name',
        'category' => 'category',
        'status' => 'status',
        'listingDate' => 'listing_date',
        'listingQuarter' => 'listing_quarter',
        'expectedTokens' => 'expected_tokens',
        'estPrice' => 'est_price',
        'expectedUsd' => 'expected_usd',
        'actualReceivedUsd' => 'actual_received_usd',
        'accountsCount' => 'accounts_count',
        'dailyRoutine' => 'daily_routine',
        'farmUrl' => 'farm_url',
        'notes' => 'notes',
        'dailyTaskDone' => 'daily_task_done',
        'sortOrder' => 'sort_order'
    ];

    $updates = [];
    $params = [];

    // Support single field update: { id: 1, field: 'estPrice', value: 0.05 }
    if (isset($data['field']) && isset($data['value']) && isset($fieldMap[$data['field']])) {
        $dbCol = $fieldMap[$data['field']];
        $val = $data['value'];
        if ($dbCol === 'listing_date' && empty($val)) $val = null;
        if ($dbCol === 'daily_task_done') $val = $val ? 1 : 0;
        $updates[] = "$dbCol = ?";
        $params[] = $val;
    }

    // Support multi-field updates: { id: 1, updates: { status: 'snapshot', ... } }
    if (isset($data['updates']) && is_array($data['updates'])) {
        foreach ($data['updates'] as $key => $val) {
            if (isset($fieldMap[$key])) {
                $dbCol = $fieldMap[$key];
                if ($dbCol === 'listing_date' && empty($val)) $val = null;
                if ($dbCol === 'daily_task_done') $val = $val ? 1 : 0;
                $updates[] = "$dbCol = ?";
                $params[] = $val;
            }
        }
    }

    // If expectedTokens or estPrice changed and expectedUsd was not manually supplied, recalculate
    if (
        (isset($data['field']) && in_array($data['field'], ['expectedTokens', 'estPrice'])) ||
        (isset($data['updates']) && (isset($data['updates']['expectedTokens']) || isset($data['updates']['estPrice'])))
    ) {
        $tokensVal = isset($data['updates']['expectedTokens']) 
            ? (string)$data['updates']['expectedTokens'] 
            : ($data['field'] === 'expectedTokens' ? (string)$data['value'] : (string)$existing['expected_tokens']);
            
        $priceVal = isset($data['updates']['estPrice']) 
            ? (float)$data['updates']['estPrice'] 
            : ($data['field'] === 'estPrice' ? (float)$data['value'] : (float)$existing['est_price']);

        $numericTokens = floatval(preg_replace('/[^0-9.]/', '', $tokensVal));
        $newExpectedUsd = round($numericTokens * $priceVal, 2);

        $updates[] = "expected_usd = ?";
        $params[] = $newExpectedUsd;
    }

    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields provided for update.']);
        exit;
    }

    $params[] = $id;
    $sql = "UPDATE airdrop_tracker SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Fetch updated
    $checkStmt->execute([$id]);
    $updatedRow = $checkStmt->fetch();

    echo json_encode([
        'success' => true,
        'item' => formatTrackerRow($updatedRow),
        'message' => 'Auto-saved successfully.'
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// PUT: Full row update
// -----------------------------------------------------------------------------
if ($method === 'PUT') {
    $id = isset($data['id']) ? (int)$data['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid record id is required.']);
        exit;
    }

    $projectName = trim(isset($data['projectName']) ? $data['projectName'] : 'Untitled Airdrop');
    $category = trim(isset($data['category']) ? $data['category'] : 'tap_to_earn');
    $status = trim(isset($data['status']) ? $data['status'] : 'active');
    $listingDate = !empty($data['listingDate']) ? $data['listingDate'] : null;
    $listingQuarter = trim(isset($data['listingQuarter']) ? $data['listingQuarter'] : '');
    $expectedTokens = trim(isset($data['expectedTokens']) ? (string)$data['expectedTokens'] : '0');
    $estPrice = isset($data['estPrice']) ? (float)$data['estPrice'] : 0.0;
    
    $expectedUsd = isset($data['expectedUsd']) && (float)$data['expectedUsd'] > 0
        ? (float)$data['expectedUsd']
        : (floatval(preg_replace('/[^0-9.]/', '', $expectedTokens)) * $estPrice);

    $actualReceivedUsd = isset($data['actualReceivedUsd']) ? (float)$data['actualReceivedUsd'] : 0.0;
    $accountsCount = isset($data['accountsCount']) ? max(1, (int)$data['accountsCount']) : 1;
    $dailyRoutine = trim(isset($data['dailyRoutine']) ? $data['dailyRoutine'] : 'daily_claim');
    $farmUrl = trim(isset($data['farmUrl']) ? $data['farmUrl'] : '');
    $notes = trim(isset($data['notes']) ? $data['notes'] : '');
    $dailyTaskDone = !empty($data['dailyTaskDone']) ? 1 : 0;
    $sortOrder = isset($data['sortOrder']) ? (int)$data['sortOrder'] : 0;

    $sql = "UPDATE airdrop_tracker SET
        project_name = ?,
        category = ?,
        status = ?,
        listing_date = ?,
        listing_quarter = ?,
        expected_tokens = ?,
        est_price = ?,
        expected_usd = ?,
        actual_received_usd = ?,
        accounts_count = ?,
        daily_routine = ?,
        farm_url = ?,
        notes = ?,
        daily_task_done = ?,
        sort_order = ?
        WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $projectName, $category, $status, $listingDate, $listingQuarter,
        $expectedTokens, $estPrice, $expectedUsd, $actualReceivedUsd,
        $accountsCount, $dailyRoutine, $farmUrl, $notes, $dailyTaskDone,
        $sortOrder, $id
    ]);

    $fetchStmt = $pdo->prepare("SELECT * FROM airdrop_tracker WHERE id = ?");
    $fetchStmt->execute([$id]);
    $row = $fetchStmt->fetch();

    echo json_encode([
        'success' => true,
        'item' => formatTrackerRow($row),
        'message' => 'Record updated successfully.'
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// DELETE: Remove record
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($data['id']) ? (int)$data['id'] : 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid record id is required.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM airdrop_tracker WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'id' => $id,
        'message' => 'Airdrop entry removed from tracker.'
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed.']);
