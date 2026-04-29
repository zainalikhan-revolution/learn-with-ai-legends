?php
// ============================================
// AI PROXY (RENAMED TO FORCE UPDATE)
// VERSION: FINAL V2 (Gemini Flash 001)
// ============================================

// 1. Load Config
$config = [];
if (file_exists('config.php')) {
    $config = require 'config.php';
} else {
    $config = [
        'VITE_GROQ_API_KEY' => getenv('VITE_GROQ_API_KEY'),
        'VITE_OPENAI_API_KEY' => getenv('VITE_OPENAI_API_KEY'),
        'VITE_OPENROUTER_API_KEY' => getenv('VITE_OPENROUTER_API_KEY'),
        'VITE_DEEPSEEK_API_KEY' => getenv('VITE_DEEPSEEK_API_KEY'),
        'VITE_GOOGLE_CLOUD_VISION_KEY' => getenv('VITE_GOOGLE_CLOUD_VISION_KEY'),
        'VITE_GEMINI_API_KEY' => getenv('VITE_GEMINI_API_KEY'),
        'VITE_ELEVENLABS_API_KEY' => getenv('VITE_ELEVENLABS_API_KEY'),
    ];
}

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function sendJson($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

// ============================================
// 1. CHAT ENDPOINT
// ============================================
if ($action === 'chat') {
    $provider = $input['provider'] ?? '';
    $prompt = $input['prompt'] ?? '';
    $options = $input['options'] ?? [];
    
    $apiKey = '';
    $endpoint = '';
    $model = '';
    $headers = ['Content-Type: application/json'];

    switch ($provider) {
        case 'groq':
            $apiKey = $config['VITE_GROQ_API_KEY'];
            $endpoint = 'https://api.groq.com/openai/v1/chat/completions';
            $model = $options['model'] ?? 'llama-3.3-70b-versatile';
            break;
        case 'openrouter':
            $apiKey = $config['VITE_OPENROUTER_API_KEY'];
            $endpoint = 'https://openrouter.ai/api/v1/chat/completions';
            $model = $options['model'] ?? 'meta-llama/llama-3.1-8b-instruct:free';
            $headers[] = 'HTTP-Referer: ' . ($_SERVER['HTTP_REFERER'] ?? 'http://localhost');
            $headers[] = 'X-Title: E-Study Card';
            break;
        case 'deepseek':
            $apiKey = $config['VITE_DEEPSEEK_API_KEY'];
            $endpoint = 'https://api.deepseek.com/v1/chat/completions';
            $model = $options['model'] ?? 'deepseek-chat';
            break;
        case 'openai':
            $apiKey = $config['VITE_OPENAI_API_KEY'];
            $endpoint = 'https://api.openai.com/v1/chat/completions';
            $model = $options['model'] ?? 'gpt-3.5-turbo';
            break;
        default:
            sendJson(['error' => 'Invalid provider'], 400);
    }

    if (!$apiKey) sendJson(['error' => "API Key for $provider not configured"], 500);

    $headers[] = "Authorization: Bearer $apiKey";

    $data = [
        'model' => $model,
        'messages' => [['role' => 'user', 'content' => $prompt]],
        'temperature' => $options['temperature'] ?? 0.7,
        'max_tokens' => 1000
    ];

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 400) sendJson(['error' => "Provider returned $httpCode", 'details' => $response], $httpCode);

    $json = json_decode($response, true);
    $content = $json['choices'][0]['message']['content'] ?? '';
    sendJson(['content' => $content]);
}

// ============================================
// 2. VISION ENDPOINT
// ============================================
if ($action === 'vision') {
    $provider = $input['provider'] ?? '';
    $base64Image = $input['base64Image'] ?? '';
    $prompt = $input['prompt'] ?? '';
    
    if ($provider === 'google_cloud') {
        $apiKey = $config['VITE_GOOGLE_CLOUD_VISION_KEY'];
        if (!$apiKey) sendJson(['error' => 'Google Cloud Key missing'], 500);

        $url = "https://vision.googleapis.com/v1/images:annotate?key=$apiKey";
        $data = [
            'requests' => [[
                'image' => ['content' => $base64Image],
                'features' => [
                    ['type' => 'TEXT_DETECTION', 'maxResults' => 10],
                    ['type' => 'LABEL_DETECTION', 'maxResults' => 10]
                ]
            ]]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $json = json_decode($response, true);
        if (isset($json['error'])) sendJson(['error' => 'Google Cloud Error: ' . json_encode($json['error'])], 400);

        $text = $json['responses'][0]['textAnnotations'][0]['description'] ?? 'No text detected';
        $labels = array_map(function($l) { return $l['description']; }, $json['responses'][0]['labelAnnotations'] ?? []);
        $labelStr = implode(', ', $labels);
        
        // NO PROMPT REPETITION HERE
        $result = "I can see: $labelStr.\n\nDetected text: $text";
        sendJson(['content' => $result]);

    } elseif ($provider === 'gemini') {
        $apiKey = $config['VITE_GEMINI_API_KEY'];
        if (!$apiKey) sendJson(['error' => 'Gemini Key missing'], 500);

        // Use specific version 'gemini-1.5-flash-001'
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=$apiKey";
        $data = [
            'contents' => [[
                'parts' => [
                    ['text' => $prompt],
                    ['inline_data' => ['mime_type' => 'image/jpeg', 'data' => $base64Image]]
                ]
            ]]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $json = json_decode($response, true);
        if (isset($json['error'])) sendJson(['error' => 'Gemini Error: ' . json_encode($json['error'])], 400);

        $result = $json['candidates'][0]['content']['parts'][0]['text'] ?? 'No response';
        sendJson(['content' => $result]);
    } else {
        sendJson(['error' => 'Invalid vision provider'], 400);
    }
}

// ============================================
// 3. VOICE ENDPOINT
// ============================================
if ($action === 'voice') {
    $text = $input['text'] ?? '';
    $voiceId = $input['voiceId'] ?? '';
    $modelId = $input['model_id'] ?? 'eleven_turbo_v2_5';
    $voiceSettings = $input['voice_settings'] ?? [];

    $apiKey = $config['VITE_ELEVENLABS_API_KEY'] ?? '';
    if (!$apiKey) sendJson(['error' => 'ElevenLabs Key missing'], 500);

    $url = "https://api.elevenlabs.io/v1/text-to-speech/$voiceId";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'text' => $text,
        'model_id' => $modelId,
        'voice_settings' => $voiceSettings
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: audio/mpeg',
        'Content-Type: application/json',
        "xi-api-key: $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 400) sendJson(['error' => "ElevenLabs Error $httpCode", 'details' => $response], $httpCode);

    header('Content-Type: audio/mpeg');
    echo $response;
    exit;
}

sendJson(['error' => 'Invalid action'], 400);
?>

