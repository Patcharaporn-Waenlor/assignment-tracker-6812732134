<?php
// ==========================================================================
// AppServ / PHP MySQL Connection & REST API Helper
// Configured for AppServ (http://localhost/phpMyAdmin)
// ==========================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Default AppServ Database Connection Settings
$host = "localhost";
$user = "root";
$passwords_to_try = ["12345678", "", "root", "1234"];
$dbname = "assignment_tracker";

$pdo = null;
$connection_error = "";

foreach ($passwords_to_try as $pass) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        break;
    } catch (PDOException $e) {
        $connection_error = $e->getMessage();
    }
}

if (!$pdo) {
    echo json_encode([
        "status" => "error", 
        "message" => "Database connection failed: " . $connection_error
    ]);
    exit();
}

// Detect table structure dynamically (Supports both appserv_db.sql and simple database.sql)
try {
    $columnsStmt = $pdo->query("SHOW COLUMNS FROM tasks");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);

    $hasSubjectId = in_array('subject_id', $columns);
    $hasSubjectColumn = in_array('subject', $columns);
    $hasUserId = in_array('user_id', $columns);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Table 'tasks' not found in database '$dbname'."]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if ($hasSubjectId) {
            $stmt = $pdo->query("
                SELECT t.id, t.title, COALESCE(s.subject_name, s.subject_code, 'ทั่วไป') AS subject, 
                       t.task_type, t.description, t.due_date, t.due_time, t.priority, t.status, 
                       t.created_at, t.updated_at
                FROM tasks t
                LEFT JOIN subjects s ON t.subject_id = s.id
                ORDER BY t.due_date ASC, t.id DESC
            ");
        } else {
            $stmt = $pdo->query("SELECT * FROM tasks ORDER BY due_date ASC, id DESC");
        }
        $tasks = $stmt->fetchAll();
        echo json_encode($tasks);
        break;

    case 'POST':
        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);
        if (!$data) $data = $_POST;

        if (isset($data['title']) && isset($data['due_date'])) {
            $title = trim($data['title']);
            $subjectInput = trim($data['subject'] ?? 'ทั่วไป');
            $task_type = $data['task_type'] ?? 'individual';
            $description = $data['description'] ?? '';
            $due_date = $data['due_date'];
            $status = $data['status'] ?? 'not_started';

            if ($hasSubjectId) {
                // Find or insert subject_id
                $subject_id = null;
                $subStmt = $pdo->prepare("SELECT id FROM subjects WHERE subject_name = ? OR subject_code = ? LIMIT 1");
                $subStmt->execute([$subjectInput, $subjectInput]);
                $subRow = $subStmt->fetch();

                if ($subRow) {
                    $subject_id = $subRow['id'];
                } else {
                    $insSub = $pdo->prepare("INSERT INTO subjects (subject_code, subject_name) VALUES ('GEN', ?)");
                    $insSub->execute([$subjectInput]);
                    $subject_id = $pdo->lastInsertId();
                }

                // Get user_id
                $user_id = 1;
                if ($hasUserId) {
                    $uStmt = $pdo->query("SELECT id FROM users LIMIT 1");
                    $uRow = $uStmt->fetch();
                    if ($uRow) {
                        $user_id = $uRow['id'];
                    }
                }

                $stmt = $pdo->prepare("
                    INSERT INTO tasks (user_id, subject_id, title, task_type, description, due_date, due_time, priority, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $user_id,
                    $subject_id,
                    $title,
                    $task_type,
                    $description,
                    $due_date,
                    '23:59:00',
                    'medium',
                    $status
                ]);
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO tasks (title, subject, task_type, description, due_date, status) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $title,
                    $subjectInput,
                    $task_type,
                    $description,
                    $due_date,
                    $status
                ]);
            }

            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid input. Title and due_date are required."]);
        }
        break;

    case 'PUT':
        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);
        if (!$data) $data = $_POST;

        if (isset($data['id'])) {
            $id = intval($data['id']);

            // If updating status only
            if (isset($data['status']) && count($data) <= 2) {
                $stmt = $pdo->prepare("UPDATE tasks SET status = ? WHERE id = ?");
                $stmt->execute([$data['status'], $id]);
                echo json_encode(["status" => "success"]);
                break;
            }

            // Full update
            if ($hasSubjectId && isset($data['subject'])) {
                $subjectInput = trim($data['subject']);
                $subStmt = $pdo->prepare("SELECT id FROM subjects WHERE subject_name = ? OR subject_code = ? LIMIT 1");
                $subStmt->execute([$subjectInput, $subjectInput]);
                $subRow = $subStmt->fetch();

                if ($subRow) {
                    $subject_id = $subRow['id'];
                } else {
                    $insSub = $pdo->prepare("INSERT INTO subjects (subject_code, subject_name) VALUES ('GEN', ?)");
                    $insSub->execute([$subjectInput]);
                    $subject_id = $pdo->lastInsertId();
                }

                $stmt = $pdo->prepare("
                    UPDATE tasks 
                    SET title = ?, subject_id = ?, task_type = ?, description = ?, due_date = ?, status = ? 
                    WHERE id = ?
                ");
                $stmt->execute([
                    $data['title'],
                    $subject_id,
                    $data['task_type'] ?? 'individual',
                    $data['description'] ?? '',
                    $data['due_date'],
                    $data['status'] ?? 'not_started',
                    $id
                ]);
            } else {
                $stmt = $pdo->prepare("
                    UPDATE tasks 
                    SET title = ?, subject = ?, task_type = ?, description = ?, due_date = ?, status = ? 
                    WHERE id = ?
                ");
                $stmt->execute([
                    $data['title'],
                    $data['subject'] ?? 'ทั่วไป',
                    $data['task_type'] ?? 'individual',
                    $data['description'] ?? '',
                    $data['due_date'],
                    $data['status'] ?? 'not_started',
                    $id
                ]);
            }
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Missing task ID"]);
        }
        break;

    case 'DELETE':
        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);
        $id = $_GET['id'] ?? $data['id'] ?? null;

        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
            $stmt->execute([intval($id)]);
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Missing task ID"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
