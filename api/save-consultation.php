<?php
// Alternative PHP version for saving consultations
// Use this if you're using PHP instead of Node.js

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['datePersian']) || !isset($data['dateGregorian']) || !isset($data['time'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$dbUrl = 'postgresql://neondb_owner:npg_NXrMy0KVPbf4@ep-shy-night-a15k3q4f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

try {
    $conn = pg_connect($dbUrl);
    
    if (!$conn) {
        throw new Exception('Database connection failed');
    }
    
    // Create table if not exists
    pg_query($conn, "
        CREATE TABLE IF NOT EXISTS consultations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            date_gregorian DATE NOT NULL,
            date_persian VARCHAR(20) NOT NULL,
            time VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Insert consultation
    $query = "INSERT INTO consultations (name, date_gregorian, date_persian, time) VALUES ($1, $2, $3, $4) RETURNING id";
    $result = pg_query_params($conn, $query, [
        $data['name'],
        $data['dateGregorian'],
        $data['datePersian'],
        $data['time']
    ]);
    
    if ($result) {
        $row = pg_fetch_assoc($result);
        echo json_encode([
            'success' => true,
            'id' => $row['id'],
            'message' => 'Consultation booked successfully'
        ]);
    } else {
        throw new Exception('Failed to insert consultation');
    }
    
    pg_close($conn);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

