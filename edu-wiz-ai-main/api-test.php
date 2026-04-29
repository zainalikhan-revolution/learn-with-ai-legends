<?php
// TEST VERSION - NO CURL
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

echo json_encode(array('test' => 'server_alive', 'action' => $_GET['action']));
