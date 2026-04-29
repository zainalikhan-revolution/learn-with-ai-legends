<?php
/**
 * SPEECH TESTER V5100
 * Use this to test if your server can talk to Google Cloud TTS.
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

$config = include('config.php');
$key = isset($config['VITE_GOOGLE_CLOUD_TTS_KEY']) ? $config['VITE_GOOGLE_CLOUD_TTS_KEY'] : 'NOT_FOUND';

echo "<h1>🎙️ Speech Tester V5100</h1>";
echo "<b>Key detected from config.php:</b> " . substr($key, 0, 8) . "...<br><br>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $text = $_POST['text'];
    $lang = $_POST['lang'];
    
    echo "<h2>Testing: $lang</h2>";
    echo "Text: $text<br>";

    $url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" . $key;
    $payload = array(
        'input' => array('text' => $text),
        'voice' => array('languageCode' => $lang, 'name' => ($lang == 'ur-PK' ? 'ur-PK-Standard-A' : 'en-US-Neural2-F')),
        'audioConfig' => array('audioEncoding' => 'MP3')
    );

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    echo "<b>HTTP Code:</b> $httpCode<br>";
    if ($curlErr) echo "<b>CURL Error:</b> $curlErr<br>";

    $data = json_decode($response, true);
    if (isset($data['audioContent'])) {
        echo "<h3 style='color:green;'>✅ SUCCESS! Audio content received.</h3>";
        echo "<audio controls src='data:audio/mp3;base64," . $data['audioContent'] . "' autoplay></audio>";
    } else {
        echo "<h3 style='color:red;'>❌ FAILED! No audio received.</h3>";
        echo "<pre>" . print_r($data, true) . "</pre>";
    }
}
?>

<form method="post">
    <textarea name="text" rows="3" style="width:100%">آپ کیسے ہیں؟ میں ایک ٹیوٹر ہوں۔</textarea><br>
    <select name="lang">
        <option value="ur-PK">Urdu (ur-PK)</option>
        <option value="en-US">English (en-US)</option>
    </select>
    <button type="submit">Test Now</button>
</form>
