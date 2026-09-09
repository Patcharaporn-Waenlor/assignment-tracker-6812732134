-- ==========================================================================
-- COMPLETE ACADEMIC ASSIGNMENT TRACKER DATABASE SCHEMA (FULL VERSION)
-- DBMS: MySQL / MariaDB (AppServ, XAMPP, phpMyAdmin Compatible)
-- Character Set: utf8mb4 / Engine: InnoDB with Foreign Key Constraints
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS `assignment_tracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `assignment_tracker`;

-- Disable FK checks temporarily for clean setup
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `task_attachments`;
DROP TABLE IF EXISTS `group_members`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. Table structure for `users` (ตารางข้อมูลผู้ใช้งาน / นักศึกษา)
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` VARCHAR(20) NOT NULL UNIQUE COMMENT 'รหัสนักศึกษา',
  `fullname` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุล',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT 'อีเมล',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'รหัสผ่านผ่านการ Hash',
  `major` VARCHAR(100) DEFAULT 'วิทยาการคอมพิวเตอร์' COMMENT 'สาขาวิชา',
  `avatar_url` VARCHAR(255) DEFAULT NULL COMMENT 'รูปโปรไฟล์',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table structure for `subjects` (ตารางรายวิชาเรียน)
-- --------------------------------------------------------
CREATE TABLE `subjects` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `subject_code` VARCHAR(20) NOT NULL COMMENT 'รหัสวิชา เช่น CS101',
  `subject_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อรายวิชา',
  `instructor_name` VARCHAR(150) DEFAULT NULL COMMENT 'ชื่ออาจารย์ผู้สอน',
  `color_code` VARCHAR(10) DEFAULT '#2563eb' COMMENT 'สีประจำวิชาสำหรับ UI',
  `room_no` VARCHAR(50) DEFAULT NULL COMMENT 'ห้องเรียน / ลิงก์ออนไลน์',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table structure for `tasks` (ตารางภาระการบ้านและงานส่ง)
-- --------------------------------------------------------
CREATE TABLE `tasks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL COMMENT 'เจ้าของงาน',
  `subject_id` INT(11) NOT NULL COMMENT 'วิชาที่เกี่ยวข้อง',
  `title` VARCHAR(255) NOT NULL COMMENT 'ชื่องาน / หัวข้อการบ้าน',
  `task_type` ENUM('individual', 'group', 'project') NOT NULL DEFAULT 'individual' COMMENT 'ประเภทงาน',
  `description` TEXT DEFAULT NULL COMMENT 'รายละเอียดงานเพิ่มเติม',
  `due_date` DATE NOT NULL COMMENT 'วันกำหนดส่ง',
  `due_time` TIME DEFAULT '23:59:00' COMMENT 'เวลากำหนดส่ง',
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium' COMMENT 'ระดับความสำคัญ',
  `status` ENUM('not_started', 'in_progress', 'done') NOT NULL DEFAULT 'not_started' COMMENT 'สถานะการทำงาน',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tasks_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table structure for `group_members` (ตารางสมาชิกกลุ่มสำหรับงานกลุ่ม/โปรเจกต์)
-- --------------------------------------------------------
CREATE TABLE `group_members` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `task_id` INT(11) NOT NULL COMMENT 'รหัสการบ้านงานกลุ่ม',
  `member_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อสมาชิกกลุ่ม',
  `role_description` VARCHAR(150) DEFAULT 'สมาชิก' COMMENT 'หน้าที่รับผิดชอบ',
  `contact_info` VARCHAR(100) DEFAULT NULL COMMENT 'เบอร์โทร / Line ID',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_members_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table structure for `task_attachments` (ตารางแนบไฟล์/ลิงก์อ้างอิงงาน)
-- --------------------------------------------------------
CREATE TABLE `task_attachments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `task_id` INT(11) NOT NULL COMMENT 'รหัสการบ้าน',
  `file_name` VARCHAR(255) NOT NULL COMMENT 'ชื่อไฟล์ หรือ ชื่อลิงก์',
  `file_url` VARCHAR(500) NOT NULL COMMENT 'Path ไฟล์ หรือ URL ลิงก์งาน',
  `file_type` VARCHAR(50) DEFAULT 'document' COMMENT 'ประเภทไฟล์ (pdf, zip, link)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_attachments_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table structure for `notifications` (ตารางประวัติการแจ้งเตือนเดดไลน์)
-- --------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL COMMENT 'ผู้รับแจ้งเตือน',
  `task_id` INT(11) NOT NULL COMMENT 'งานที่แจ้งเตือน',
  `message` VARCHAR(255) NOT NULL COMMENT 'ข้อความแจ้งเตือน',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=ยังไม่อ่าน, 1=อ่านแล้ว',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DATABASE VIEWS (มุมมองสรุปรายงาน)
-- --------------------------------------------------------

-- View 1: งานที่เลยกำหนดส่ง (Overdue Tasks View)
CREATE OR REPLACE VIEW `v_overdue_tasks` AS
SELECT 
  t.id AS task_id,
  t.title,
  s.subject_code,
  s.subject_name,
  t.due_date,
  t.due_time,
  t.status,
  u.fullname AS student_name
FROM `tasks` t
JOIN `subjects` s ON t.subject_id = s.id
JOIN `users` u ON t.user_id = u.id
WHERE t.status != 'done' AND t.due_date < CURDATE();

-- View 2: สรุปสถิติจำนวนงานแยกตามสถานะ (Dashboard Task Summary View)
CREATE OR REPLACE VIEW `v_task_summary` AS
SELECT 
  COUNT(*) AS total_tasks,
  SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS total_done,
  SUM(CASE WHEN status = 'in_progress' AND due_date >= CURDATE() THEN 1 ELSE 0 END) AS total_in_progress,
  SUM(CASE WHEN status = 'not_started' AND due_date >= CURDATE() THEN 1 ELSE 0 END) AS total_not_started,
  SUM(CASE WHEN status != 'done' AND due_date < CURDATE() THEN 1 ELSE 0 END) AS total_overdue
FROM `tasks`;

-- --------------------------------------------------------
-- SAMPLE DEMO DATA INSERT
-- --------------------------------------------------------

-- Insert Demo Users
INSERT INTO `users` (`id`, `student_id`, `fullname`, `email`, `password_hash`, `major`) VALUES
(1, '6812732134', 'นักศึกษา ตัวอย่าง', 'student@university.ac.th', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFX3K1K', 'เทคโนโลยีสารสนเทศ');

-- Insert Demo Subjects
INSERT INTO `subjects` (`id`, `subject_code`, `subject_name`, `instructor_name`, `color_code`, `room_no`) VALUES
(1, 'CS201', 'Database Systems', 'ดร.สมชาย ใจดี', '#2563eb', 'Lab 402'),
(2, 'CS202', 'Web Development', 'อ.วิภาดา สายชล', '#059669', 'Lab 305'),
(3, 'CS203', 'Software Engineering', 'ดร.ประเสริฐ ยอดเยี่ยม', '#d97706', 'Room 501'),
(4, 'CS204', 'AI & Data Science', 'ผศ.ดร.กิตติพงษ์ สุขใจ', '#e11d48', 'Room 603'),
(5, 'GEN101', 'Tech Communication', 'อ.อนันต์ แสงทอง', '#7c3aed', 'Online Zoom');

-- Insert Demo Tasks
INSERT INTO `tasks` (`id`, `user_id`, `subject_id`, `title`, `task_type`, `description`, `due_date`, `due_time`, `priority`, `status`) VALUES
(1, 1, 1, 'ออกแบบ ER-Diagram & Database Schema', 'individual', 'ออกแบบ Normalization (3NF) และเขียน DDL สำหรับระบบห้องพยาบาลมหาวิทยาลัย', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '23:59:00', 'high', 'in_progress'),
(2, 1, 2, 'พัฒนา Web Dashboard ด้วย HTML/CSS/JS', 'project', 'สร้างระบบติดตามการบ้านพร้อมตัวกรองค้นหาและแบนเนอร์เตือนเดดไลน์', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '23:59:00', 'urgent', 'in_progress'),
(3, 1, 3, 'จัดทำเอกสาร Software Requirement Specification (SRS)', 'group', 'เขียน Use Case Diagrams, Functional & Non-functional Requirements', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '17:00:00', 'medium', 'not_started'),
(4, 1, 4, 'ทำแบบฝึกหัด Decision Tree & Entropy', 'individual', 'คำนวณ Information Gain ด้วยมือ และเขียน Python Code ด้วย Scikit-learn', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '23:59:00', 'high', 'not_started'),
(5, 1, 5, 'ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี', 'individual', 'จัดทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends 2026', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '12:00:00', 'low', 'done');

-- Insert Demo Group Members
INSERT INTO `group_members` (`task_id`, `member_name`, `role_description`, `contact_info`) VALUES
(3, 'นักศึกษา ตัวอย่าง (หัวหน้ากลุ่ม)', 'เขียน SRS และ Diagram', '081-234-5678'),
(3, 'สมชาย สายลุย', 'ออกแบบ UI Mockups', 'somchai@email.com'),
(3, 'สมหญิง จริงใจ', 'รวบรวม Requirement', 'somying@email.com');

-- Insert Demo Attachments
INSERT INTO `task_attachments` (`task_id`, `file_name`, `file_url`, `file_type`) VALUES
(1, 'สเปกโจทย์ ER-Diagram.pdf', 'https://example.com/files/er-spec.pdf', 'pdf'),
(2, 'GitHub Project Repository', 'https://github.com/example/assignment-tracker', 'link');

-- Insert Demo Notifications
INSERT INTO `notifications` (`user_id`, `task_id`, `message`, `is_read`) VALUES
(1, 4, 'แจ้งเตือน: งาน Decision Tree & Entropy เลยกำหนดส่งแล้ว!', 0),
(1, 1, 'แจ้งเตือน: งาน ER-Diagram เหลือเวลาอีก 24 ชั่วโมง', 0);
