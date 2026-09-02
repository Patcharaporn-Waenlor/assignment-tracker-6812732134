-- ==========================================================================
-- SUPABASE DATABASE SCHEMA: TASKS TABLE
-- Execute this script in your Supabase SQL Editor to create the schema.
-- ==========================================================================

create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  task_type text not null default 'individual' check (task_type in ('individual', 'group', 'project')),
  description text,
  due_date date not null,
  status text not null check (status in ('not_started', 'in_progress', 'done')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- Public Policy for read/write access
create policy "Allow public full access to tasks"
  on public.tasks
  for all
  using (true)
  with check (true);

-- Sample Data Insert
insert into public.tasks (title, subject, task_type, description, due_date, status)
values
  ('ออกแบบ ER-Diagram & Database Schema', 'Database Systems', 'individual', 'ออกแบบ Normalization (3NF) และเขียน DDL สำหรับระบบห้องพยาบาล', CURRENT_DATE + INTERVAL '1 day', 'in_progress'),
  ('พัฒนา Web Dashboard ด้วย HTML/CSS/JS', 'Web Development', 'project', 'สร้างระบบติดตามการบ้านพร้อมตัวกรองค้นหาและแบนเนอร์เตือนเดดไลน์', CURRENT_DATE + INTERVAL '3 days', 'in_progress'),
  ('จัดทำเอกสาร Software Requirement Specification', 'Software Engineering', 'group', 'เขียน Use Case Diagrams, Functional & Non-functional Requirements', CURRENT_DATE + INTERVAL '5 days', 'not_started'),
  ('ทำแบบฝึกหัด Decision Tree & Entropy', 'AI & Data Science', 'individual', 'คำนวณ Information Gain ด้วยมือและเขียน Python Code', CURRENT_DATE - INTERVAL '1 day', 'not_started'),
  ('ส่งสไลด์นำเสนอวิชาการสื่อสารทางเทคโนโลยี', 'Tech Communication', 'individual', 'จัดทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends 2026', CURRENT_DATE - INTERVAL '3 days', 'done');
