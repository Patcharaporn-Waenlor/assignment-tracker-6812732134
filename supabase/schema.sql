-- ==========================================================================
-- SUPABASE DATABASE SCHEMA: TASKS TABLE
-- Execute this script in your Supabase SQL Editor to create the schema.
-- ==========================================================================

create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  description text,
  due_date date not null,
  status text not null check (status in ('not_started', 'in_progress', 'done')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- Public Policy for read/write access (Demo & Production Assignment Tracker)
create policy "Allow public full access to tasks"
  on public.tasks
  for all
  using (true)
  with check (true);

-- Initial Mock Data Insert
insert into public.tasks (title, subject, description, due_date, status)
values
  ('ออกแบบ ER-Diagram & Relational Schema', 'Database Systems', 'ออกแบบ 3NF และเขียน SQL Script สำหรับระบบห้องพยาบาล', CURRENT_DATE + INTERVAL '1 day', 'in_progress'),
  ('พัฒนา Frontend ด้วย Next.js & Tailwind', 'Web Development', 'สร้างระบบติดตามการบ้านและเชื่อมต่อกับ Supabase', CURRENT_DATE + INTERVAL '3 days', 'in_progress'),
  ('จัดทำเอกสาร Software Requirement Specification', 'Software Engineering', 'รวบรวม User Stories, Use Case Diagrams และ Non-functional Requirements', CURRENT_DATE + INTERVAL '5 days', 'not_started'),
  ('ทำแบบฝึกหัด Decision Tree & Entropy', 'AI & Machine Learning', 'คำนวณ Information Gain ด้วยมือและเขียน Python Code', CURRENT_DATE + INTERVAL '8 days', 'not_started'),
  ('ส่งสไลด์นำเสนอวิชาการสื่อสารเทคโนโลยี', 'Tech Communication', 'ทำสไลด์ 10 หน้า หัวข้อ Cloud Architecture Trends', CURRENT_DATE - INTERVAL '2 days', 'done');
