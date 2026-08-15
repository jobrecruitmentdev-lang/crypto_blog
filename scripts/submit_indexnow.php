<?php
$ENDPOINT = 'https://api.indexnow.org/indexnow';
$MAX_BATCH = 10000;

$root = dirname(__DIR__);
$keyFile = $root . '/.private/indexnow.key';

if (!is_file($keyFile)) {
    fwrite(STDERR, "Missing key file: $keyFile\n");
    exit(1);
}
$key = trim(file_get_contents($keyFile));

$args = array_slice($argv, 1);
$urls = [];
for ($i = 0; $i < count($args); $i++) {
    $a = $args[$i];
    $urls[] = $a;
}

$urls = array_values(array_unique(array_filter(array_map('trim', $urls))));
if (!$urls) { fwrite(STDERR, "No URLs provided.\n"); exit(1); }

$host = null;
foreach ($urls as $u) {
    $p = parse_url($u);
    if (empty($p['scheme']) || empty($p['host']) || !in_array($p['scheme'], ['http', 'https'], true)) {
        fwrite(STDERR, "Not an absolute http(s) URL: $u\n");
        exit(1);
    }
    if ($host === null) { $host = $p['host']; }
    elseif ($host !== $p['host']) {
        fwrite(STDERR, "All URLs must share one host.\n");
        exit(1);
    }
}

$keyLocation = "https://$host/$key.txt";
$exit = 0;

foreach (array_chunk($urls, $MAX_BATCH) as $n => $batch) {
    $payload = json_encode([
        'host'        => $host,
        'key'         => $key,
        'keyLocation' => $keyLocation,
        'urlList'     => array_values($batch),
    ], JSON_UNESCAPED_SLASHES);

    $ch = curl_init($ENDPOINT);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json; charset=utf-8'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    $count = count($batch);
    if ($err) {
        fwrite(STDERR, "Batch " . ($n + 1) . " error: $err\n");
        $exit = 1;
        continue;
    }
    $ok = in_array($code, [200, 202], true);
    fwrite($ok ? STDOUT : STDERR, "Batch " . ($n + 1) . ": HTTP $code" . ($body ? " $body" : "") . "\n");
    if (!$ok) { $exit = 1; }
}

exit($exit);
