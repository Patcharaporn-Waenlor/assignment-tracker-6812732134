-- ==========================================================================
-- MySQL DATABASE SCHEMA: ASSIGNMENT TRACKER (FOR APPSERV / PHPMYADMIN)
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS `assignment_tracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `assignment_tracker`;

-- 1. สร้างตาราง tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subject` varchar(150) NOT NULL,
  `task_type` enum('individual','group','project') NOT NULL DEFAULT 'individual',
  `description` text DEFAULT NULL,
  `due_date` date NOT NULL,
  `status` enum('not_started','in_progress','done') NOT NULL DEFAULT 'not_started',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. เพิ่มข้อมูลตัวอย่าง (Sample Data)
INSERT INTO `tasks` (`title`, `subject`, `task_type`, `description`, `due_date`, `status`) VALUES
('ออกแบบ ER-Diagram & Database Schema', 'Database Systems', 'individual', 'ออกแบบ Normalization (3NF) และเขียน DDL สำหรับระบบห้องพยาบาล', DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), 'in_progress'),
('พัฒนา Web Dashboard ด้วย HTML/CSS/JS', 'Web Development', 'project', 'สร้างระบบติดตามการบ้านพร้อมตัวกรองค้นหาและแบนเนอร์เตือนเดดไลน์', DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), 'in_progress'),
('จัดทำเอกสาร Software Requirement Specification', 'Software Engineering', 'group', 'เขียน Use Case Diagrams, Functional & Non-functional Requirements', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'not_started'),
('ทำแบบฝึกหัด Decision Tree & Entropy', 'AI & Data Science', 'individual', 'คำนวณ Information Gain ด้วยมือและเขียน Python Code', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'not_started'),
('ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี', 'Tech Communication', 'individual', 'จัดทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends 2026', DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), 'done');
