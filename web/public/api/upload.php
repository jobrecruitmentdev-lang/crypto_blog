<?php
// backend/upload.php
// Production Image Upload & WebP Auto-Compression API

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Only POST is supported.']);
    exit;
}

// Ensure caller is authenticated as admin
requireAdminAuth();

// Locate uploaded file
$fileKey = null;
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileKey = 'file';
} elseif (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileKey = 'image';
}

if (!$fileKey) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or file upload error code: ' . ($_FILES['file']['error'] ?? $_FILES['image']['error'] ?? 'missing')]);
    exit;
}

$uploadedFile = $_FILES[$fileKey];
$tmpPath = $uploadedFile['tmp_name'];
$originalName = $uploadedFile['name'];
$fileSize = $uploadedFile['size'];

// Max size: 5MB
$maxBytes = 5 * 1024 * 1024;
if ($fileSize > $maxBytes) {
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds maximum 5MB limit.']);
    exit;
}

// Validate MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $tmpPath);
finfo_close($finfo);

$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/jpg'  => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    'image/svg+xml' => 'svg'
];

if (!array_key_exists($mimeType, $allowedMimes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file format: ' . $mimeType . '. Allowed: JPG, PNG, WEBP, GIF, SVG.']);
    exit;
}

// Prepare destination directory
$targetDir = realpath(__DIR__ . '/../images/uploads');
if (!$targetDir) {
    $targetDir = __DIR__ . '/../images/uploads';
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
}

// Clean prefix
$prefix = isset($_POST['type']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['type']) : 'upload';
if (empty($prefix)) {
    $prefix = 'upload';
}

$uniqueId = time() . '_' . substr(md5(uniqid(rand(), true)), 0, 8);

// Handle SVG directly (vector graphic, no GD rasterization)
if ($mimeType === 'image/svg+xml') {
    $filename = $prefix . '_' . $uniqueId . '.svg';
    $destPath = $targetDir . DIRECTORY_SEPARATOR . $filename;
    if (move_uploaded_file($tmpPath, $destPath)) {
        echo json_encode([
            'success' => true,
            'url' => '/images/uploads/' . $filename,
            'filename' => $filename,
            'mime' => 'image/svg+xml',
            'size' => filesize($destPath)
        ]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save SVG file on server.']);
        exit;
    }
}

// For raster images, convert to WebP using GD if available
$canConvertToWebp = function_exists('imagewebp') && function_exists('imagecreatefromstring');

if ($canConvertToWebp) {
    $imgData = file_get_contents($tmpPath);
    $sourceImg = @imagecreatefromstring($imgData);

    if ($sourceImg !== false) {
        $origWidth = imagesx($sourceImg);
        $origHeight = imagesy($sourceImg);

        // Max dimension clamp: 1600px for desktop sharpness without bloated bytes
        $maxWidth = 1600;
        if ($origWidth > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = (int)round($origHeight * ($newWidth / $origWidth));
        } else {
            $newWidth = $origWidth;
            $newHeight = $origHeight;
        }

        $canvas = imagecreatetruecolor($newWidth, $newHeight);

        // Enable alpha transparency
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);

        // High quality bicubic/resampled scaling
        imagecopyresampled($canvas, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

        $filename = $prefix . '_' . $uniqueId . '.webp';
        $destPath = $targetDir . DIRECTORY_SEPARATOR . $filename;

        // Save WebP with 85% visual fidelity (Google recommended)
        $saved = imagewebp($canvas, $destPath, 85);

        imagedestroy($sourceImg);
        imagedestroy($canvas);

        if ($saved && file_exists($destPath)) {
            echo json_encode([
                'success' => true,
                'url' => '/images/uploads/' . $filename,
                'filename' => $filename,
                'mime' => 'image/webp',
                'width' => $newWidth,
                'height' => $newHeight,
                'size' => filesize($destPath)
            ]);
            exit;
        }
    }
}

// Fallback if GD cannot convert to WebP
$ext = $allowedMimes[$mimeType];
$filename = $prefix . '_' . $uniqueId . '.' . $ext;
$destPath = $targetDir . DIRECTORY_SEPARATOR . $filename;

if (move_uploaded_file($tmpPath, $destPath)) {
    echo json_encode([
        'success' => true,
        'url' => '/images/uploads/' . $filename,
        'filename' => $filename,
        'mime' => $mimeType,
        'size' => filesize($destPath)
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save uploaded image.']);
}
