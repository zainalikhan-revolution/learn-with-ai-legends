<?php
$config = include('config.php');
header('Content-Type: application/javascript');

if (!$config || !is_array($config)) {
    echo "console.error('❌ config.php failed to load or is not an array!');\n";
} else {
    echo "window.__ENV__ = " . json_encode($config) . ";\n";
    echo "console.log('✅ API Keys Bridge Loaded from config.php (' + Object.keys(window.__ENV__).length + ' keys)');\n";
}
?>
