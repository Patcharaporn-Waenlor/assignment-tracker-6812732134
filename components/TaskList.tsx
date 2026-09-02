'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Calendar, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onStatusChange, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">ไม่พบรายการการบ้าน</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          ยังไม่มีข้อมูลการบ้านตรงกับเงื่อนไขที่เลือก สามารถกดเพิ่มการบ้านใหม่ได้
        </p>
      </div>
    );
  }

  // Render Status Badge
  const renderStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            ส่งแล้ว
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            กำลังทำ
          </span>
        );
      case 'not_started':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            ยังไม่เริ่ม
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-200">
        {tasks.map((task) => {
          const dueDate = new Date(`${task.due_date}T23:59:59`);
          const now = new Date();
          const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isUrgent = diffDays <= 2 && task.status !== 'done';

          return (
            <div
              key={task.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
            >
              {/* Main Information */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {task.subject}
                  </span>
                  {renderStatusBadge(task.status)}
                  {isUrgent && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                      ด่วน!
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-base text-slate-900 truncate mb-1">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2 font-normal">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>กำหนดส่ง: <strong className="text-slate-700">{task.due_date}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-between sm:justify-end">
                {/* Status Cycle Selector */}
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-medium py-1.5 px-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="not_started">ยังไม่เริ่ม</option>
                  <option value="in_progress">กำลังทำ</option>
                  <option value="done">ส่งแล้ว</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="แก้ไข"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
