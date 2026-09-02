# ระบบติดตามการบ้านและงานส่ง (Homework & Assignment Tracker)

แอปพลิเคชันสำหรับช่วยนักศึกษาจัดการการบ้าน งานเดี่ยว งานกลุ่ม และโปรเจกต์จากหลายรายวิชาในที่เดียว ลดปัญหาการลืมส่งงาน และช่วยวางแผนการเรียนได้อย่างมีประสิทธิภาพ

---

## 🎨 Design System & Aesthetic Directives

- **สไตล์ดีไซน์**: Dashboard เครื่องมือจริงจัง เรียบหรู ไม่ดูเป็นเทมเพลต AI ทั่วไป
- **โทนสี 3 สีหลัก**: ขาว (`#ffffff`) + น้ำเงินกรมท่า (`#0f172a` / `#1e293b`) + เทาอ่อน (`#f8fafc` / `#f1f5f9`)
- **ฟอนต์ภาษาไทย**: **Prompt** (Google Fonts) อ่านง่ายสบายตา เว้นระยะห่าง (Whitespace) สมดุล
- **ไม่มี Gradient ฉูดฉาด**, **ไม่มี Animation เกินจำเป็น**

---

## 🚀 ฟังก์ชันหลัก (Core Features)

1. **บันทึกงาน (Task Management & Modal Form)**:
   - ฟอร์มกรอกชื่องาน, รายวิชา, รายรายละเอียด, วันกำหนดส่ง (Due Date) และสถานะเริ่มต้น
2. **แจ้งเตือนก่อนเดดไลน์ (Urgent Deadline Alert)**:
   - แสดงแบนเนอร์ข้อความเตือนเมื่องานใกล้ครบกำหนดส่งภายใน 48 ชั่วโมง เช่น *"เหลืออีก 1 วัน! งาน Database กำลังจะถึงกำหนดส่ง"*
3. **ติดตามสถานะงาน (3 Status Badges)**:
   - 🟢 **ส่งแล้ว (`done`)** (สีเขียว)
   - 🟡 **กำลังทำ (`in_progress`)** (สีเหลือง/ส้ม)
   - 🔴 **ยังไม่เริ่ม (`not_started`)** (สีแดง/ชมพู)
4. **Dashboard สรุปงาน (Summary Cards)**:
   - การ์ดสรุปจำนวนงานทั้งหมด, จำนวนที่ส่งแล้ว, กำลังทำ และยังไม่เริ่ม
5. **ค้นหาและกรองงาน (Search & Filtering)**:
   - ค้นหาด้วยชื่องาน/รายวิชา แบบ Real-time และกรองสถานะงาน

---

## 🗄️ โครงสร้างตารางข้อมูล Supabase (PostgreSQL)

```sql
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
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
