<?php
// backend/framework.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

$methodologyFile = __DIR__ . '/methodology_framework.json';
$editorialFile = __DIR__ . '/editorial_framework.json';

// Default seed if files don't exist yet on Hostinger
$defaultMethodology = [
    [
        "step" => "01",
        "title" => "Smart Contract & Bytecode Verification",
        "icon" => "🛡️",
        "desc" => "We verify contract source code on block explorers, analyze proxy upgradeability timelocks, and check audit reports from CertiK, OpenZeppelin, or Trail of Bits.",
        "metric" => "Explorer Verification & Timelock Status"
    ],
    [
        "step" => "02",
        "title" => "Core Team & GitHub Development Cadence",
        "icon" => "👥",
        "desc" => "Evaluation of developer commit frequency, code freshness, institutional venture backing, and public leadership track records.",
        "metric" => "Active GitHub Repos & Public Commits"
    ],
    [
        "step" => "03",
        "title" => "Tokenomics & Airdrop Allocation Model",
        "icon" => "📊",
        "desc" => "Analysis of total supply distribution, insider lockups, community pool percentages, and anti-dumping vesting cliffs.",
        "metric" => "Community Allocation >= 10%"
    ],
    [
        "step" => "04",
        "title" => "Gas Efficiency & Capital Requirements",
        "icon" => "⛽",
        "desc" => "Clear documentation of estimated gas costs, mandatory minimum deposits, and risk-adjusted ROI expectations.",
        "metric" => "Zero Pay-to-Win Exploits"
    ],
    [
        "step" => "05",
        "title" => "Continuous Telemetry & Lifecycle Monitoring",
        "icon" => "📡",
        "desc" => "Post-publication RPC indexing to track snapshot block heights, contract deprecations, and point system updates.",
        "metric" => "24/7 Node State Monitoring"
    ]
];

$defaultEditorial = [
    [
        "num" => "01",
        "title" => "Cryptographic Source Ingestion",
        "desc" => "All protocol announcements must originate from verifiable DNS records, signed developer commits, or verified smart contracts.",
        "badge" => "Cryptographic Ingestion"
    ],
    [
        "num" => "02",
        "title" => "Testnet / Mainnet Simulation",
        "desc" => "Our technical nodes execute qualifying deposit or interaction steps directly to evaluate gas consumption and contract approvals.",
        "badge" => "On-Chain Simulation"
    ],
    [
        "num" => "03",
        "title" => "Sybil & Security Audit",
        "desc" => "Code repositories and audit reports are scanned for malicious proxy patterns, honeypots, or centralized rug-pull attack vectors.",
        "badge" => "Security Filter"
    ],
    [
        "num" => "04",
        "title" => "Human Editorial Peer Review",
        "desc" => "Before publication, research leads verify plain-language clarity, risk disclaimers, and step-by-step reproducibility.",
        "badge" => "Peer Review"
    ]
];

if ($method === 'GET') {
    $type = isset($_GET['type']) ? trim($_GET['type']) : 'methodology';
    if ($type === 'editorial') {
        if (file_exists($editorialFile)) {
            $data = json_decode(file_get_contents($editorialFile), true);
            echo json_encode(['success' => true, 'type' => 'editorial', 'pillars' => $data ?: $defaultEditorial]);
        } else {
            echo json_encode(['success' => true, 'type' => 'editorial', 'pillars' => $defaultEditorial]);
        }
    } else {
        if (file_exists($methodologyFile)) {
            $data = json_decode(file_get_contents($methodologyFile), true);
            echo json_encode(['success' => true, 'type' => 'methodology', 'steps' => $data ?: $defaultMethodology]);
        } else {
            echo json_encode(['success' => true, 'type' => 'methodology', 'steps' => $defaultMethodology]);
        }
    }
    exit;
}

// POST requires admin token
requireAdminAuth();

$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: [];
$type = isset($body['type']) ? trim($body['type']) : 'methodology';

if ($type === 'editorial') {
    $pillars = isset($body['pillars']) ? $body['pillars'] : [];
    file_put_contents($editorialFile, json_encode($pillars, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'message' => 'Editorial pillars updated successfully.', 'pillars' => $pillars]);
} else {
    $steps = isset($body['steps']) ? $body['steps'] : [];
    file_put_contents($methodologyFile, json_encode($steps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'message' => 'Methodology framework steps updated successfully.', 'steps' => $steps]);
}
