# ระบบติดตามการบ้านและงานส่ง (Homework & Assignment Tracker)

แอปพลิเคชันสำหรับช่วยนักศึกษาจัดการการบ้าน งานเดี่ยว งานกลุ่ม และโปรเจกต์จากหลายรายวิชาในที่เดียว ลดปัญหาการลืมส่งงาน และช่วยวางแผนการเรียนได้อย่างมีประสิทธิภาพ

---

## 🎨 Design System & Aesthetic Directives

- **สไตล์ดีไซน์**: Dashboard เครื่องมือจริงจัง สไตล์ Minimalist Slate/Navy
- **โทนสี 3 สีหลัก**: ขาว (`#ffffff`) + น้ำเงินกรมท่า (`#0f172a` / `#1e293b`) + เทาอ่อน (`#f8fafc` / `#f1f5f9`)
- **ฟอนต์ภาษาไทย**: **Prompt** (Google Fonts) อ่านง่ายสบายตา เว้นระยะห่าง (Whitespace) สมดุล

---

## 🚀 ฟังก์ชันหลัก (Core Features)

1. **บันทึกงาน (Task Management & Modal Form)**:
   - ฟอร์มกรอกชื่องาน, รายวิชา, **ประเภทงาน (งานเดี่ยว / งานกลุ่ม / โปรเจกต์)**, รายละเอียด, วันกำหนดส่ง (Due Date) และสถานะเริ่มต้น
2. **ระบบตรวจจับสถานะเลยกำหนดส่ง (Automatic Overdue Detection)**:
   - ตรวจจับงานที่มีสถานะยังไม่เริ่มหรือกำลังทำ เมื่อเลยวันกำหนดส่งระบบจะเปลี่ยนป้ายสถานะเป็น **"เลยกำหนดส่ง" (Overdue)** สีแดงเข้มอัตโนมัติ
3. **Dashboard สรุปงาน (5 Summary Cards)**:
   - การ์ดสรุปตัวเลข 5 การ์ด: **งานทั้งหมด**, **ส่งแล้ว**, **กำลังทำ**, **ยังไม่เริ่ม**, และ **เลยกำหนดส่ง** (กดคลิกที่การ์ดเพื่อกรองรายการงานได้ทันที)
4. **แจ้งเตือนก่อนเดดไลน์ (Urgent Deadline Alert)**:
   - แสดงแบนเนอร์ข้อความเตือนเมื่องานใกล้ครบกำหนดส่งภายใน 48 ชั่วโมง
5. **ติดตามสถานะงาน (4 Status Badges)**:
   - 🟢 **ส่งแล้ว (`done`)** (สีเขียว)
   - 🟡 **กำลังทำ (`in_progress`)** (สีเหลือง/ส้ม)
   - 🔴 **ยังไม่เริ่ม (`not_started`)** (สีแดง/ชมพู)
   - 🍷 **เลยกำหนดส่ง (`overdue`)** (สีแดงเข้ม)
6. **ค้นหาและกรองงาน (Search & Filtering)**:
   - ค้นหาด้วยชื่องาน/รายวิชา แบบ Real-time และกรองสถานะงาน
7. **ปฏิทินกำหนดส่ง (Academic Calendar View)**:
   - มุมมองปฏิทินแสดงการบ้านและวันกำหนดส่งประจำเดือน

---

## 🗄️ โครงสร้างตารางข้อมูล Supabase (PostgreSQL)

```sql
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

-- Enable RLS Policy
alter table public.tasks enable row level security;
create policy "Allow public access" on public.tasks for all using (true) with check (true);
```

---

## 💻 การเปิดใช้งาน (Instant Run)

สามารถเปิดเล่นและใช้งานได้ทันทีโดย **ดับเบิลคลิกที่ไฟล์ `index.html`** ในเบราว์เซอร์ (Chrome / Edge) โดยไม่ต้องติดตั้ง Node/npm
