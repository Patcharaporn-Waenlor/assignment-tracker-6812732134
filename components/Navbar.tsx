'use client';

import React from 'react';
import { BookOpen, Plus, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export default function Navbar({ onOpenAddModal }: NavbarProps) {
  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-white leading-tight">
              ระบบติดตามการบ้านและงานส่ง
            </h1>
            <p className="text-xs text-slate-400 font-normal">
              Homework & Assignment Tracker
            </p>
          </div>
        </div>

        {/* Date & Add Action Button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{today}</span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มการบ้าน</span>
          </button>
        </div>

      </div>
    </header>
  );
}
