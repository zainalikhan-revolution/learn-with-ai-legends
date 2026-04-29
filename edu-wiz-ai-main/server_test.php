<?php
header("Content-Type: text/plain");
echo "=== SERVER DIAGNOSTIC ===\n\n";
echo "PHP Version: " . phpversion() . "\n";
echo "CURL Available: " . (function_exists('curl_init') ? 'YES' : 'NO') . "\n";
echo "JSON Available: " . (function_exists('json_encode') ? 'YES' : 'NO') . "\n";

if (file_exists('config.php')) {
    echo "config.php: EXISTS\n";
    $cfg = @include('config.php');
    echo "Config loaded: " . (is_array($cfg) ? 'YES' : 'NO') . "\n";
    if (is_array($cfg)) {
        echo "Keys found: " . count($cfg) . "\n";
    }
} else {
    echo "config.php: NOT FOUND\n";
}

echo "\n=== END DIAGNOSTIC ===";
