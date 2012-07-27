<?php
header ($_SERVER['SERVER_PROTOCOL'] . 'Internal Server Error', true, 500);
header ('Content-Type: application/json', true);

if (!isset($_GET['terms'])) {
    echo "'terms' parameter missing";
    exit;
}

$data = array();
$dataFile = fopen('cities.csv', 'r');
$terms = explode(' ', $_GET['terms']);

while ((list($name, $postalCode, $longitude, $latitude) = fgetcsv($dataFile))) {
    foreach ($terms as $term) {
        if (strpos($name, $term) === false) break 2;
    }

    $data[] = array (
        'name' => $name,
        'postalCode' => $postalCode,
        'longitude' => $longitude,
        'latitude' => $latitude
    );
}

header ($_SERVER['SERVER_PROTOCOL'] . 'OK', true, 200);
echo json_encode($data);