'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskInput, TaskStatus } from '@/types/task';
import { X, Save } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskInput: TaskInput, id?: string) => Promise<void>;
  editingTask: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, editingTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSubject(editingTask.subject);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.due_date);
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setSubject('');
      setDescription('');
      setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
      setStatus('not_started');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;

    setIsSubmitting(true);
    try {
      await onSave(
        {
          title,
          subject,
          description: description || null,
          due_date: dueDate,
          status,
        },
        editingTask?.id
      );
      onClose();
    } catch (err) {
      console.error('Error saving task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            {editingTask ? 'แก้ไขการบ้าน / งานส่ง' : 'เพิ่มการบ้าน / งานส่งใหม่'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่องาน / หัวข้อการบ้าน *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ออกแบบ ER Diagram วิชา Database"
              className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รายวิชา *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="เช่น Database Systems"
                className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กำหนดส่ง (Due Date) *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สถานะเริ่มต้น *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="not_started">ยังไม่เริ่ม (Not Started)</option>
              <option value="in_progress">กำลังทำ (In Progress)</option>
              <option value="done">ส่งแล้ว (Done)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดเพิ่มเติม
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุข้อกำหนด ขั้นตอน หรือคำสั่งอาจารย์..."
              className="w-full text-sm px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
