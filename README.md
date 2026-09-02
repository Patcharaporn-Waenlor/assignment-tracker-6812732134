# ระบบติดตามการบ้านและงานส่ง (Homework & Assignment Tracker)

แอปพลิเคชันสำหรับช่วยนักศึกษาจัดการการบ้าน งานเดี่ยว งานกลุ่ม และโปรเจกต์จากหลายรายวิชาในที่เดียว ลดปัญหาการลืมส่งงาน และช่วยวางแผนการเรียนได้อย่างมีประสิทธิภาพ

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS (Minimalist Slate/Navy Theme, Thai Font `Prompt`)
- **Database / Backend**: Supabase (PostgreSQL) + Local Storage Fallback Mode
- **Icons**: Lucide React
- **Deploy Target**: Vercel Ready

---

## 🚀 ฟังก์ชันหลัก (Core Features)

1. **บันทึกงาน (Task Creation & Modal Form)**:
   - ฟอร์มกรอกชื่องาน, รายวิชา, รายละเอียด, วันกำหนดส่ง (Due Date) และสถานะเริ่มต้น
2. **แจ้งเตือนก่อนเดดไลน์ (Urgent Deadline Banner)**:
   - ตรวจสอบคำนวณวันคงเหลือก่อนถึงกำหนดส่ง แสดง Banner เตือนสีส้ม/แดงเมื่อเหลือน้อยกว่า 48 ชั่วโมง
3. **ติดตามสถานะงาน (Task Status Tracker)**:
   - 3 สถานะชัดเจนพร้อม Badge แยกสี:
     - 🟢 **ส่งแล้ว (done)** (สีเขียว)
     - 🟡 **กำลังทำ (in_progress)** (สีเหลือง/ส้ม)
     - 🔴 **ยังไม่เริ่ม (not_started)** (สีแดง/ชมพู)
4. **Dashboard สรุปงาน (Summary Metrics)**:
   - การ์ดสรุปจำนวนงานทั้งหมด, ส่งแล้ว, กำลังทำ และยังไม่เริ่ม
5. **ค้นหาและกรองงาน (Search & Filtering)**:
   - ค้นหาด้วยชื่องาน/รายวิชา แบบ Real-time และกรองสถานะงาน

---

## 🗄️ โครงสร้างตารางข้อมูล Supabase

รัน SQL Script นี้ใน **Supabase SQL Editor** ของคุณเพื่อสร้างตาราง `tasks`:

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

-- Enable RLS & Policy
alter table public.tasks enable row level security;
create policy "Allow public access" on public.tasks for all using (true) with check (true);
```

---

## 💻 การติดตั้งและรันในเครื่อง (Local Setup)

1. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```

2. **(Optional) ตั้งค่า Supabase Environment Variables**:
   สร้างไฟล์ `.env.local` แล้วใส่คีย์โครงการ Supabase ของคุณ:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(หมายเหตุ: หากยังไม่ได้ใส่คีย์ ระบบจะใช้ LocalStorage Fallback ให้ทดสอบและใช้งานได้ทันที)*

3. **รัน Development Server**:
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## 🌐 การ Deploy ขึ้น Vercel

1. Push โค้ดทั้งหมดขึ้น GitHub
2. ไปที่ [Vercel Dashboard](https://vercel.com) -> กด **Add New Project**
3. เลือก Repository `assignment-tracker-6812732134`
4. (ถ้ามี Supabase) ใส่ Environment Variables `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. กด **Deploy** เรียบร้อยทันที!
