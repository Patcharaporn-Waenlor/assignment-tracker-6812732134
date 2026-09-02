import type { Metadata } from 'next';
import { Prompt } from 'next-font-google' || { className: '' };
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบติดตามการบ้านและงานส่ง (Homework & Assignment Tracker)',
  description: 'แอปพลิเคชันสำหรับช่วยนักศึกษาจัดการการบ้าน งานเดี่ยว งานกลุ่ม และโปรเจกต์จากหลายรายวิชาในที่เดียว',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body class="bg-slate-50 text-slate-900 min-h-screen font-prompt antialiased">
        {children}
      </body>
    </html>
  );
}
