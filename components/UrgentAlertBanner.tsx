'use client';

import React from 'react';
import { Task } from '@/types/task';
import { AlertTriangle, Clock } from 'lucide-react';

interface UrgentAlertBannerProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
}

export default function UrgentAlertBanner({ tasks, onSelectTask }: UrgentAlertBannerProps) {
  const now = new Date();
  
  // Find tasks due within 48 hours that are not done
  const urgentTasks = tasks.filter((t) => {
    if (t.status === 'done') return false;
    const dueDate = new Date(`${t.due_date}T23:59:59`);
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  });

  if (urgentTasks.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-amber-900 mb-1">
            แจ้งเตือนเดดไลน์ด่วน! มี {urgentTasks.length} งานใกล้ถึงกำหนดส่ง
          </h3>
          <div className="space-y-1.5 mt-2">
            {urgentTasks.map((t) => {
              const dueDate = new Date(`${t.due_date}T23:59:59`);
              const diffHours = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
              const daysLeft = Math.ceil(diffHours / 24);

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask && onSelectTask(t)}
                  className="flex items-center justify-between text-xs bg-white/80 hover:bg-white border border-amber-200/80 rounded-lg p-2.5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{t.title}</span>
                    <span className="text-slate-500">({t.subject})</span>
                  </div>
                  <div className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    <span>{daysLeft <= 1 ? `เหลืออีกประมาณ ${diffHours} ชั่วโมง!` : `เหลืออีก ${daysLeft} วัน`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
