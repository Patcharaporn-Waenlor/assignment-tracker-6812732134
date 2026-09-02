'use client';

import React from 'react';
import { Task } from '@/types/task';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DashboardStatsProps {
  tasks: Task[];
}

export default function DashboardStats({ tasks }: DashboardStatsProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const notStarted = tasks.filter((t) => t.status === 'not_started').length;

  const stats = [
    {
      label: 'งานทั้งหมด',
      value: total,
      icon: FileText,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
    },
    {
      label: 'ส่งแล้ว',
      value: done,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'กำลังทำ',
      value: inProgress,
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      label: 'ยังไม่เริ่ม',
      value: notStarted,
      icon: AlertCircle,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${stat.color}`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
