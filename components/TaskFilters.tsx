'use client';

import React from 'react';
import { TaskStatus } from '@/types/task';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  subjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  subjects: string[];
}

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  subjects,
}: TaskFiltersProps) {
  const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'not_started', label: 'ยังไม่เริ่ม' },
    { value: 'in_progress', label: 'กำลังทำ' },
    { value: 'done', label: 'ส่งแล้ว' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาชื่องาน หรือ รายวิชา..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Subject Select */}
        <select
          value={subjectFilter}
          onChange={(e) => onSubjectFilterChange(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">ทุกรายวิชา</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>

        {/* Status Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`text-xs font-medium px-3 py-1.2 rounded-md transition-colors ${
                statusFilter === opt.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
