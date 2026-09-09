'use client';

import React from 'react';
import { Task } from '@/types/task';
import { Layers, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';

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

  const stats = [
    {
      label: 'งานทั้งหมด',
      sublabel: 'ALL',
      value: total,
      icon: Layers,
      accentBorder: 'before:bg-gradient-to-r before:from-blue-500 before:to-blue-400',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      iconClass: 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-blue-500/10',
      hoverBg: 'hover:border-blue-300 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/30',
    },
    {
      label: 'ส่งแล้ว',
      sublabel: 'DONE',
      value: done,
      icon: CheckCircle2,
      accentBorder: 'before:bg-gradient-to-r before:from-emerald-500 before:to-emerald-400',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconClass: 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-emerald-500/10',
      hoverBg: 'hover:border-emerald-300 hover:bg-gradient-to-b hover:from-white hover:to-emerald-50/30',
    },
    {
      label: 'กำลังทำ',
      sublabel: 'IN PROGRESS',
      value: inProgress,
      icon: Loader2,
      accentBorder: 'before:bg-gradient-to-r before:from-amber-500 before:to-amber-400',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      iconClass: 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 shadow-amber-500/10',
      hoverBg: 'hover:border-amber-300 hover:bg-gradient-to-b hover:from-white hover:to-amber-50/30',
    },
    {
      label: 'ยังไม่เริ่ม',
      sublabel: 'NOT STARTED',
      value: notStarted,
      icon: AlertCircle,
      accentBorder: 'before:bg-gradient-to-r before:from-rose-500 before:to-rose-400',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      iconClass: 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 shadow-rose-500/10',
      hoverBg: 'hover:border-rose-300 hover:bg-gradient-to-b hover:from-white hover:to-rose-50/30',
    },
    {
      label: 'เลยกำหนดส่ง',
      sublabel: 'OVERDUE',
      value: overdue,
      icon: Clock,
      accentBorder: 'before:bg-gradient-to-r before:from-red-600 before:to-red-500',
      badgeClass: 'bg-red-50 text-red-800 border-red-200',
      iconClass: 'bg-gradient-to-br from-red-100 to-red-50 text-red-700 shadow-red-500/15',
      hoverBg: 'hover:border-red-300 hover:bg-gradient-to-b hover:from-white hover:to-red-50/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className={`group relative bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-2xl ${stat.accentBorder} ${stat.hoverBg}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                {stat.label}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap ${stat.badgeClass}`}
              >
                {stat.sublabel}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.value}
              </span>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${stat.iconClass}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
