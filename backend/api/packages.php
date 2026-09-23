<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$packages = [
    [
        'id' => 1,
        'name' => 'Basic',
        'price' => 199,
        'currency' => 'Rs.',
        'description' => '100 SD channels',
        'features' => ['100 SD Channels', 'Basic Setup', 'Standard Support']
    ],
    [
        'id' => 2,
        'name' => 'HD',
        'price' => 349,
        'currency' => 'Rs.',
        'description' => '200+ channels + HD',
        'features' => ['200+ Channels', 'HD Channels', 'Priority Support', 'Free Installation']
    ],
    [
        'id' => 3,
        'name' => 'Smart 4K',
        'price' => 549,
        'currency' => 'Rs.',
        'description' => '300+ HD+OTT',
        'features' => ['300+ HD Channels', '4K Support', 'OTT Integration', '24/7 Premium Support', 'DVR Recording']
    ]
];

echo json_encode(['success' => true, 'packages' => $packages]);
