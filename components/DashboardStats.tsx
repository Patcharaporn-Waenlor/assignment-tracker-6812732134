'use client';

import React from 'react';
import { Task } from '@/types/task';
import { Layers, CheckCircle2, Zap, Hourglass, Flame } from 'lucide-react';

interface DashboardStatsProps {
  tasks: Task[];
}

export default function DashboardStats({ tasks }: DashboardStatsProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter(
    (t) => t.status === 'in_progress' && t.due_date >= todayStr
  ).length;
  const notStarted = tasks.filter(
    (t) => t.status === 'not_started' && t.due_date >= todayStr
  ).length;
  const overdue = tasks.filter(
    (t) => t.status !== 'done' && t.due_date < todayStr
  ).length;

  const donePct = total > 0 ? Math.round((done / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const notStartedPct = total > 0 ? Math.round((notStarted / total) * 100) : 0;
  const overduePct = total > 0 ? Math.round((overdue / total) * 100) : 0;

  const stats = [
    {
      label: 'งานทั้งหมด',
      sublabel: 'ทั้งหมด',
      value: total,
      icon: Layers,
      cardBg: 'bg-gradient-to-br from-white via-blue-50/40 to-blue-100/60 border-blue-200/80 hover:border-blue-500 hover:shadow-blue-500/15',
      chipBg: 'bg-blue-100 text-blue-800',
      iconBox: 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-blue-500/30',
      barFill: 'bg-gradient-to-r from-blue-600 to-blue-400',
      pctText: 'ภาระการเรียนสะสมทั้งหมด',
      pctWidth: 100,
    },
    {
      label: 'ส่งงานเรียบร้อย',
      sublabel: 'ส่งแล้ว',
      value: done,
      icon: CheckCircle2,
      cardBg: 'bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/60 border-emerald-200/80 hover:border-emerald-500 hover:shadow-emerald-500/15',
      chipBg: 'bg-emerald-100 text-emerald-800',
      iconBox: 'bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-emerald-500/30',
      barFill: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
      pctText: `${donePct}% ของงานทั้งหมด`,
      pctWidth: donePct,
    },
    {
      label: 'กำลังดำเนินการ',
      sublabel: 'กำลังทำ',
      value: inProgress,
      icon: Zap,
      cardBg: 'bg-gradient-to-br from-white via-amber-50/40 to-amber-100/60 border-amber-200/80 hover:border-amber-500 hover:shadow-amber-500/15',
      chipBg: 'bg-amber-100 text-amber-900',
      iconBox: 'bg-gradient-to-br from-amber-600 to-amber-500 text-white shadow-amber-500/30',
      barFill: 'bg-gradient-to-r from-amber-600 to-amber-400',
      pctText: `${inProgressPct}% อยู่ระหว่างทำ`,
      pctWidth: inProgressPct,
    },
    {
      label: 'ยังไม่ได้เริ่มทำ',
      sublabel: 'ยังไม่เริ่ม',
      value: notStarted,
      icon: Hourglass,
      cardBg: 'bg-gradient-to-br from-white via-rose-50/40 to-rose-100/60 border-rose-200/80 hover:border-rose-500 hover:shadow-rose-500/15',
      chipBg: 'bg-rose-100 text-rose-900',
      iconBox: 'bg-gradient-to-br from-rose-600 to-rose-500 text-white shadow-rose-500/30',
      barFill: 'bg-gradient-to-r from-rose-600 to-rose-400',
      pctText: `${notStartedPct}% รอเริ่มงาน`,
      pctWidth: notStartedPct,
    },
    {
      label: 'เกินกำหนดส่งแล้ว',
      sublabel: 'เลยกำหนดส่ง',
      value: overdue,
      icon: Flame,
      cardBg: 'bg-gradient-to-br from-white via-red-50/50 to-red-100/70 border-red-300/80 hover:border-red-600 hover:shadow-red-500/20',
      chipBg: 'bg-red-100 text-red-900',
      iconBox: 'bg-gradient-to-br from-red-700 to-red-500 text-white shadow-red-500/35',
      barFill: 'bg-gradient-to-r from-red-700 to-red-500',
      pctText: `${overduePct}% ต้องรีบส่งด่วน`,
      pctWidth: overduePct,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className={`group relative rounded-2xl p-5 shadow-sm hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer border ${stat.cardBg}`}
          >
            {/* Header: Icon & Chip */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${stat.iconBox}`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <span
                className={`text-xs font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${stat.chipBg}`}
              >
                {stat.sublabel}
              </span>
            </div>

            {/* Body: Value */}
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-slate-500">รายการ</span>
            </div>

            {/* Footer: Title & Progress bar */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-slate-800 leading-tight">
                {stat.label}
              </span>
              <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stat.barFill}`}
                  style={{ width: `${stat.pctWidth}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {stat.pctText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
