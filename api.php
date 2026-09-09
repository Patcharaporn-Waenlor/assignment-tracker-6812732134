<?php
// ==========================================================================
// AppServ / PHP MySQL Connection & REST API Helper
// Configured for AppServ (http://localhost/phpMyAdmin)
// ==========================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

// Default AppServ Database Connection Settings
$host = "localhost";
$user = "root";
$pass = "12345678"; // หรือรหัสผ่านของคุณใน AppServ (เช่น root หรือว่างเปล่า)
$dbname = "assignment_tracker";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM tasks ORDER BY due_date ASC");
        $tasks = $stmt->fetchAll();
        echo json_encode($tasks);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['title']) && isset($data['subject']) && isset($data['due_date'])) {
            $stmt = $pdo->prepare("INSERT INTO tasks (title, subject, task_type, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['subject'],
                $data['task_type'] ?? 'individual',
                $data['description'] ?? '',
                $data['due_date'],
                $data['status'] ?? 'not_started'
            ]);
            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid input"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
