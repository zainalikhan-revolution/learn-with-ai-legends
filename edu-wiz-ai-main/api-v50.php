<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') die('{}');

$AI = 'AIzaSyB9S6dUOUXFDs12rnAYu10CC4vYOscznKo';
$TTS = 'AIzaSyCdCTqlJhDtAyGv_2ujnRa3jLL6-og1F7E';

$act = $_GET['action'];
$in = json_decode(file_get_contents('php://input'), true);

if ($act == 'chat') {
    $p = $in['prompt'];
    $s = $in['system_instruction'];
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $AI;
    $data = array('contents' => array(array('parts' => array(array('text' => $s . "\n" . $p)))));
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    $r = curl_exec($ch);
    curl_close($ch);
    
    $d = json_decode($r, true);
    echo json_encode(array('content' => $d['candidates'][0]['content']['parts'][0]['text']));
    die();
}

if ($act == 'tts') {
    $txt = $in['text'];
    $tutor = $in['tutorName'];
    $hint = $in['languageHint'];
    
    $urdu = ($hint == 'ur' || strpos($txt, 'ا') !== false);
    $female = (stripos($tutor, 'Marie') !== false);
    
    if ($urdu) {
        $voice = $female ? 'ur-PK-Standard-A' : 'ur-PK-Standard-B';
        $lang = 'ur-PK';
    } else {
        $voice = $female ? 'en-US-Neural2-F' : 'en-US-Neural2-D';
        $lang = 'en-US';
    }
    
    $url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' . $TTS;
    $data = array(
        'input' => array('text' => substr($txt, 0, 999)),
        'voice' => array('languageCode' => $lang, 'name' => $voice),
        'audioConfig' => array('audioEncoding' => 'MP3')
    );
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    $r = curl_exec($ch);
    curl_close($ch);
    
    $d = json_decode($r, true);
    echo json_encode(array('audioContent' => $d['audioContent'], 'voiceUsed' => $voice));
    die();
}

echo json_encode(array('error' => 'Unknown'));
