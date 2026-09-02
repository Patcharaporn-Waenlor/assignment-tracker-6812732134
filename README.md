# ระบบติดตามการบ้านและงานส่ง (Assignment & Project Tracker)
> **โครงงานเทคโนโลยีและแอปพลิเคชันสำหรับนักศึกษา (รหัสนักศึกษา: 6812732134)**

---

## 🎯 แนวคิดของโครงการ (Project Concept)
แอปพลิเคชันสำหรับช่วยนักศึกษาจัดการการบ้าน งานเดี่ยว งานกลุ่ม และโปรเจกต์จากหลายรายวิชาในที่เดียว ช่วยลดปัญหาการลืมส่งงาน ติดตามภาระงานคงค้างได้อย่างเห็นภาพ และช่วยวางแผนการเรียนได้อย่างมีประสิทธิภาพ

---

## ✨ ฟังก์ชันการทำงานหลัก (Core Features)

1. 📝 **บันทึกและจัดการงานง่าย (Task Management)**:
   - กรอกชื่องาน, รายวิชา, ประเภทงาน (เดี่ยว/กลุ่ม/โปรเจกต์), รายละเอียด, น้ำหนักคะแนน (%) และกำหนดส่ง
2. 🚨 **แจ้งเตือนก่อนเดดไลน์ (Urgent Deadline Warning Banner)**:
   - แสดงแถบเตือนสีแดง/ส้ม สำหรับงานที่มีกำหนดส่งภายใน 48 ชั่วโมง พร้อมนับเวลาถอยหลัง
3. 📊 **Dashboard สรุปภาพรวม (Visual Dashboard & Analytics)**:
   - การ์ดสถิติสรุปจำนวนงานทั้งหมด, งานที่ส่งแล้ว, ค้างส่ง, และงานด่วน
   - กราฟวงแหวน (Completion Ring) แสดงเปอร์เซ็นต์การส่งงานรวม
   - แถบความคืบหน้า (Progress Bar) แยกรายวิชา
4. 📌 **ติดตามสถานะงาน (Kanban Board & List View)**:
   - สลับมุมมอง Kanban Board (`To Do` -> `In Progress` -> `Completed`) หรือ List View
5. 🔍 **ค้นหาและกรองงาน (Search & Smart Filtering)**:
   - ค้นหาด้วยชื่องาน/รายวิชา + กรองตามรายวิชา, สถานะ และประเภทงาน
6. 📅 **ปฏิทินการเรียน (Academic Calendar View)**:
   - ปฏิทินแสดงเดดไลน์การบ้านและสอบในรูปแบบรายเดือน
7. 🤖 **ระบบจัดลำดับความสำคัญด้วย AI (AI Smart Scheduler)**:
   - อัลกอริทึมวิเคราะห์และคำนวณ **Urgency Index (0-100)** โดยประมวลผลจากเดดไลน์ น้ำหนักคะแนน และความยาก เพื่อแนะนำงานที่ควรเริ่มทำก่อน

---

## 🚀 การพัฒนาต่อยอดในอนาคต (Scalability Roadmap for Presentation)

- 🔗 **LMS Auto-Sync**: เชื่อมต่อ Microsoft Teams หรือ Google Classroom ดึงกำหนดส่งงานอัตโนมัติผ่าน OAuth2 API
- 🤖 **AI Study Assistant**: ช่วยวิเคราะห์โจทย์การบ้าน สรุปขั้นตอน และประเมินชั่วโมงที่ต้องใช้
- 📱 **Multi-channel Alerts**: แจ้งเตือนเตือนภัยผ่าน LINE Notify หรือ Telegram ก่อนเดดไลน์
- 📈 **Academic Workload Analytics**: Dashboard ช่วยอาจารย์วิเคราะห์ภาระงานของนักศึกษาในแต่ละสัปดาห์

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphic Design System, Theme Switcher), Vanilla JavaScript (ES6 State Manager)
- **Typography & Icons**: Google Fonts (`Kanit`, `Plus Jakarta Sans`), FontAwesome 6.5
- **Data Storage**: LocalStorage Persistence API
